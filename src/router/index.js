import {createRouter, createWebHistory} from 'vue-router'
import {userStore} from '@/store/user'
import request from '@/utils/request'
// 导入页面组件
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'

// 验证 token 是否有效
const validateToken = async (token) => {
    if (!token) return false

    try {
        const response = await request({
            url: '/api/finance-data/auth/validate',
            method: 'get',
            timeout: 5000
        })
        // 注意：code 可能是字符串 '200' 或数字 200，使用 == 宽松比较
        return response && response.code == 200 && response.data === true
    } catch (error) {
        return false
    }
}

// 基础路由（不需要权限）
const baseRoutes = [
    {
        path: '/',
        redirect: '/auth/login'
    },
    {
        path: '/login',
        redirect: '/auth/login'
    },
    {
        path: '/auth/login',
        name: 'Login',
        component: Login,
        meta: {title: '登录'}
    },
    {
        path: '/auth/register',
        name: 'Register',
        component: Register,
        meta: {title: '注册'}
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/components/Layout.vue'),
        meta: {title: '仪表板', requiresAuth: true},
        children: [
            {
                path: '',
                component: () => import('@/views/Dashboard.vue')
            },
            {
                path: 'profile',
                name: 'UserProfile',
                component: () => import('@/views/auth/UserProfile.vue'),
                meta: {title: '个人信息', requiresAuth: true}
            },
            {
                path: 'password',
                name: 'ChangePassword',
                component: () => import('@/views/auth/ChangePassword.vue'),
                meta: {title: '修改密码', requiresAuth: true}
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: baseRoutes
})

// 记录已注册的动态路由名称
const registeredDynamicRoutes = new Set()

// 标记动态路由是否已初始化
let dynamicRoutesInitialized = false

// 清理已注册的动态路由
const clearDynamicRoutes = () => {
    const dashboardRoute = router.getRoutes().find(r => r.name === 'Dashboard')
    if (dashboardRoute && dashboardRoute.children) {
        dashboardRoute.children.forEach(child => {
            const childName = child.name
            if (!['', 'UserProfile', 'ChangePassword'].includes(childName)) {
                if (registeredDynamicRoutes.has(childName)) {
                    registeredDynamicRoutes.delete(childName)
                }
            }
        })
    }
    registeredDynamicRoutes.clear()
}

// 动态路由注册，返回处理后的菜单数据
export const registerDynamicRoutes = (menus) => {
    if (!menus || menus.length === 0) {
        clearDynamicRoutes()
        return []
    }

    const menusWithPath = addFullPathToMenus(menus)
    const routes = generateRoutes(menusWithPath)

    routes.forEach(route => {
        registeredDynamicRoutes.add(route.name)
        router.addRoute('Dashboard', route)
    })

    dynamicRoutesInitialized = true

    return menusWithPath
}

// 为菜单添加完整路径
const addFullPathToMenus = (menus, parentPath = '') => {
    return menus.map(menu => {
        const fullPath = parentPath ? `${parentPath}/${menu.path}` : menu.path
        const children = menu.children && menu.children.length > 0
            ? addFullPathToMenus(menu.children, fullPath)
            : []

        return {
            ...menu,
            fullPath,
            children
        }
    })
}

// 使用 import.meta.glob 自动导入 views 目录下的所有组件
const modules = import.meta.glob('../views/**/*.vue')

// 组件路径映射表（处理特殊命名规则）
const componentMap = {
    'system/user/index': () => import('../views/system/user/index.vue'),
    'system/role/index': () => import('../views/system/role/index.vue'),
    'system/menu/index': () => import('../views/system/menu/index.vue'),
    'ai/index': () => import('../views/ai/index.vue'),
}

// 根据组件路径获取组件
const getComponent = (componentPath) => {
    if (!componentPath) return null

    if (componentMap[componentPath]) {
        return componentMap[componentPath]
    }

    const normalizedPath = componentPath.startsWith('/')
        ? componentPath.substring(1)
        : componentPath

    const componentUrl = `../views/${normalizedPath}.vue`

    return modules[componentUrl] || null
}

// 根据菜单生成路由
const generateRoutes = (menus) => {
    const routes = []

    menus.forEach(menu => {
        const menuType = menu.menuType ? menu.menuType.toUpperCase() : null

        if (menuType === 'F') {
            return
        }

        const route = {
            path: menu.path || menu.fullPath,
            name: menu.menuName.replace(/\s+/g, ''),
            meta: {
                title: menu.menuName,
                permission: menu.perms,
                menuType: menuType,
                requiresAuth: true,
                fullPath: menu.fullPath
            }
        }

        if (menuType === 'M' || !menu.component) {
            route.component = () => import('@/components/ParentView.vue')
        } else if (menuType === 'C') {
            const componentImport = getComponent(menu.component)
            if (componentImport) {
                route.component = componentImport
            } else {
                return
            }
        }

        if (menu.children && menu.children.length > 0) {
            const childRoutes = generateRoutes(menu.children)
            const validChildren = childRoutes.filter(r => r.component || r.children?.length > 0)
            if (validChildren.length > 0) {
                route.children = validChildren
            }
        }

        routes.push(route)
    })

    return routes
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token')

    // 设置页面标题
    if (to.meta.title) {
        document.title = `${to.meta.title} - 综合数据管理平台`
    }

    // 检查是否需要登录
    if (to.meta.requiresAuth && !token) {
        next('/auth/login')
        return
    }

    // 处理刷新页面时动态路由丢失的问题
    if (token && !dynamicRoutesInitialized) {
        const isValid = await validateToken(token)
        if (!isValid) {
            localStorage.removeItem('token')
            localStorage.removeItem('userMenus')
            localStorage.removeItem('userPermissions')
            localStorage.removeItem('userRoles')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('userId')
            next('/auth/login')
            return
        }

        const userId = localStorage.getItem('userId')
        if (userId) {
            try {
                await userStore.loadUserData(userId)
                registerDynamicRoutes(userStore.menus)
                next({ ...to, replace: true })
                return
            } catch (e) {
                localStorage.removeItem('token')
                localStorage.removeItem('userId')
                next('/auth/login')
                return
            }
        } else {
            localStorage.removeItem('token')
            next('/auth/login')
            return
        }
    }

    // 检查权限
    if (to.meta.permission && !userStore.hasPermission(to.meta.permission)) {
        next('/dashboard')
        return
    }

    next()
})

export default router
