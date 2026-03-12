import {createRouter, createWebHistory} from 'vue-router'
import {userStore} from '@/store/user'

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
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: baseRoutes
})

// 动态路由注册，返回处理后的菜单数据
export const registerDynamicRoutes = (menus) => {
    console.log('原始菜单数据:', menus)
    // 先为菜单添加完整路径
    const menusWithPath = addFullPathToMenus(menus)
    console.log('添加路径后的菜单:', menusWithPath)
    const routes = generateRoutes(menusWithPath)
    console.log('生成的路由:', routes)
    routes.forEach(route => {
        router.addRoute('Dashboard', route)
    })
    console.log('当前路由表:', router.getRoutes())
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

// 根据菜单生成路由
const generateRoutes = (menus) => {
    const routes = []

    menus.forEach(menu => {
        // 只处理有 component 的菜单（忽略目录类型的菜单）
        if (menu.component) {
            // 处理组件路径，使用Vite支持的动态导入格式
            const componentPath = menu.component
            let componentImport

            // 根据组件路径映射到具体的导入
            if (componentPath === '/UserList' || componentPath === '/demo/UserList') {
                componentImport = () => import('@/views/user/UserList.vue')
            } else if (componentPath === '/auth/UserProfile') {
                componentImport = () => import('@/views/auth/UserProfile.vue')
            } else if (componentPath === 'system/menu/index') {
                componentImport = () => import('@/views/system/MenuManagement.vue')
            } else if (componentPath === 'system/role/index') {
                componentImport = () => import('@/views/system/RoleManagement.vue')
            } else if (componentPath === 'system/user/index') {
                componentImport = () => import('@/views/user/UserList.vue')
            }

            if (componentImport) {
                const route = {
                    path: menu.fullPath,
                    name: menu.menuName.replace(/\s+/g, ''),
                    component: componentImport,
                    meta: {
                        title: menu.menuName,
                        permission: menu.perms,
                        requiresAuth: true
                    }
                }
                console.log('生成路由:', route)
                routes.push(route)
            }
        }

        // 递归处理子菜单
        if (menu.children && menu.children.length > 0) {
            routes.push(...generateRoutes(menu.children))
        }
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

    // 检查权限（如果有权限要求）
    if (to.meta.permission) {
        console.log('检查权限:', to.meta.permission, '用户权限:', userStore.permissions)
        if (!userStore.hasPermission(to.meta.permission)) {
            console.warn('权限不足，跳转到首页')
            next('/dashboard')
            return
        }
    }

    next()
})

export default router
