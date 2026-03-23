import {createRouter, createWebHistory} from 'vue-router'
import {userStore} from '@/store/user'
import axios from 'axios'

// 验证 token 是否有效
const validateToken = async (token) => {
    if (!token) return false

    try {
        const response = await axios.get('/api/finance-data/auth/validate', {
            headers: {
                'satoken': token
            },
            timeout: 5000
        })
        return response.data && response.data.code === 200
    } catch (error) {
        console.error('Token 验证失败:', error)
        return false
    }
}

// 导入页面组件
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'

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
            // 跳过基础路由（'', 'profile', 'password'）
            if (!['', 'UserProfile', 'ChangePassword'].includes(childName)) {
                if (registeredDynamicRoutes.has(childName)) {
                    console.log('移除动态路由:', childName)
                    registeredDynamicRoutes.delete(childName)
                }
            }
        })
    }
    // Vue Router 4 不支持直接删除路由，所以我们需要通过标记来管理
    // 这里我们清空记录，下次重新注册时会覆盖
    registeredDynamicRoutes.clear()
}

// 动态路由注册，返回处理后的菜单数据
export const registerDynamicRoutes = (menus) => {
    console.log('原始菜单数据:', menus)

    // 处理空菜单情况
    if (!menus || menus.length === 0) {
        console.log('菜单为空，清空动态路由')
        clearDynamicRoutes()
        return []
    }

    // 先为菜单添加完整路径
    const menusWithPath = addFullPathToMenus(menus)
    console.log('添加路径后的菜单:', menusWithPath)
    const routes = generateRoutes(menusWithPath)
    console.log('生成的路由:', routes)

    // 记录并添加新路由
    routes.forEach(route => {
        registeredDynamicRoutes.add(route.name)
        router.addRoute('Dashboard', route)
    })

    // 标记动态路由已初始化
    dynamicRoutesInitialized = true

    console.log('当前路由表:', router.getRoutes())
    console.log('已注册的动态路由:', Array.from(registeredDynamicRoutes))

    // 返回处理后的菜单数据，供组件使用
    return menusWithPath
}

// 为菜单添加完整路径
const addFullPathToMenus = (menus, parentPath = '') => {
    return menus.map(menu => {
        // 构建完整路径：父路径 + 当前菜单路径
        // 注意：这里的路径是相对于 Dashboard 的，所以不需要前导斜杠
        const fullPath = parentPath ? `${parentPath}/${menu.path}` : menu.path

        // 递归处理子菜单
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
    // 系统管理模块
    'system/user/index': () => import('../views/system/user/index.vue'),
    'system/role/index': () => import('../views/system/role/index.vue'),
    'system/menu/index': () => import('../views/system/menu/index.vue'),
    // AI 模块
    'ai/index': () => import('../views/ai/index.vue'),
}

// 根据组件路径获取组件（自动映射 + 手动映射）
const getComponent = (componentPath) => {
    if (!componentPath) return null

    // 先检查手动映射表
    if (componentMap[componentPath]) {
        console.log('使用手动映射:', componentPath)
        return componentMap[componentPath]
    }

    // 规范化路径：去掉前导斜杠
    const normalizedPath = componentPath.startsWith('/')
        ? componentPath.substring(1)
        : componentPath

    // 构建组件路径
    const componentUrl = `../views/${normalizedPath}.vue`

    console.log('查找组件:', componentPath, '->', componentUrl, '存在:', !!modules[componentUrl])

    return modules[componentUrl] || null
}

// 根据菜单生成路由（参照RuoYi框架）
const generateRoutes = (menus) => {
    const routes = []

    menus.forEach(menu => {
        // 统一 menuType 为大写，处理大小写不一致问题
        const menuType = menu.menuType ? menu.menuType.toUpperCase() : null
        console.log('处理菜单:', menu.menuName, 'menuType:', menuType, 'component:', menu.component, 'fullPath:', menu.fullPath)

        // 跳过按钮类型（F）
        if (menuType === 'F') {
            return
        }

        // 路由路径：使用 menu.path（当前层级路径）而不是 fullPath（完整路径）
        // fullPath 用于导航，path 用于路由注册
        const route = {
            path: menu.path || menu.fullPath,
            name: menu.menuName.replace(/\s+/g, ''),
            meta: {
                title: menu.menuName,
                permission: menu.perms,
                menuType: menuType,
                requiresAuth: true,
                fullPath: menu.fullPath  // 保存完整路径用于导航
            }
        }

        // 处理组件：目录类型使用 ParentView，菜单类型使用实际组件
        if (menuType === 'M' || !menu.component) {
            // 目录类型 - 使用 ParentView，只作为容器显示子路由
            route.component = () => import('@/components/ParentView.vue')
        } else if (menuType === 'C') {
            // 菜单类型 - 使用实际组件
            const componentImport = getComponent(menu.component)
            if (componentImport) {
                route.component = componentImport
            } else {
                console.warn('未找到组件映射:', menu.component, '菜单:', menu.menuName)
                return
            }
        }

        // 递归处理子菜单（构建 children）
        if (menu.children && menu.children.length > 0) {
            const childRoutes = generateRoutes(menu.children)
            // 过滤掉纯按钮类型的子路由，只保留有实际组件的路由
            const validChildren = childRoutes.filter(r => r.component || r.children?.length > 0)
            if (validChildren.length > 0) {
                route.children = validChildren
            }
        }

        routes.push(route)
        console.log('生成路由:', {name: route.name, path: route.path, hasChildren: !!route.children})
    })

    return routes
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token')

    console.log('路由守卫:', {to: to.path, from: from.path, meta: to.meta, dynamicRoutesInitialized})

    // 设置页面标题
    if (to.meta.title) {
        document.title = `${to.meta.title} - 综合数据管理平台`
    }

    // 检查是否需要登录
    if (to.meta.requiresAuth && !token) {
        console.log('需要登录但未找到 token，跳转到登录页')
        next('/auth/login')
        return
    }

    // 处理刷新页面时动态路由丢失的问题
    if (token && !dynamicRoutesInitialized) {
        console.log('检测到刷新页面，正在验证 token 并恢复动态路由...')

        // 先验证 token 是否有效
        const isValid = await validateToken(token)
        if (!isValid) {
            console.log('Token 无效或已过期，清除并跳转到登录页')
            localStorage.removeItem('token')
            localStorage.removeItem('userMenus')
            localStorage.removeItem('userPermissions')
            localStorage.removeItem('userRoles')
            localStorage.removeItem('userInfo')
            next('/auth/login')
            return
        }

        // 尝试从 localStorage 恢复菜单数据
        const cachedMenus = localStorage.getItem('userMenus')
        const cachedPermissions = localStorage.getItem('userPermissions')
        const cachedRoles = localStorage.getItem('userRoles')

        if (cachedMenus) {
            try {
                const menus = JSON.parse(cachedMenus)
                // 恢复 userStore 数据
                userStore.menus.push(...menus)
                if (cachedPermissions) {
                    userStore.permissions.push(...JSON.parse(cachedPermissions))
                }
                if (cachedRoles) {
                    userStore.roles.push(...JSON.parse(cachedRoles))
                }

                // 注册动态路由
                registerDynamicRoutes(menus)
                console.log('动态路由恢复完成')

                // 重新导航到目标路由（确保路由已注册）
                next({ ...to, replace: true })
                return
            } catch (e) {
                console.error('恢复菜单数据失败:', e)
                // 恢复失败，清除缓存并跳转登录
                localStorage.removeItem('token')
                localStorage.removeItem('userMenus')
                localStorage.removeItem('userPermissions')
                localStorage.removeItem('userRoles')
                localStorage.removeItem('userInfo')
                next('/auth/login')
                return
            }
        } else {
            console.log('localStorage 中没有缓存的菜单数据，跳转到登录页')
            localStorage.removeItem('token')
            next('/auth/login')
            return
        }
    }

    // 检查权限（如果有权限要求）
    if (to.meta.permission) {
        console.log('检查权限:', to.meta.permission, '用户权限:', userStore.permissions)
        if (!userStore.hasPermission(to.meta.permission)) {
            console.warn('权限不足，跳转到首页')
            next('/dashboard')
            return
        }
    }

    console.log('路由守卫通过，继续导航')
    next()
})

export default router
