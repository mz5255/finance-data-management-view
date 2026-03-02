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

// 动态路由注册
export const registerDynamicRoutes = (menus) => {
    const routes = generateRoutes(menus)
    routes.forEach(route => {
        router.addRoute('Dashboard', route)
    })
}

// 根据菜单生成路由
const generateRoutes = (menus) => {
    const routes = []

    menus.forEach(menu => {
        if (menu.component) {
            // 处理组件路径，使用Vite支持的动态导入格式
            const componentPath = menu.component
            let componentImport

            // 根据组件路径映射到具体的导入
            if (componentPath === '/UserList' || componentPath === '/demo/UserList') {
                componentImport = () => import('@/views/user/UserList.vue')
            } else if (componentPath === '/permission/PermissionManagement') {
                componentImport = () => import('@/views/permission/PermissionManagement.vue')
            } else if (componentPath === '/auth/UserProfile') {
                componentImport = () => import('@/views/auth/UserProfile.vue')
            }

            if (componentImport) {
                const route = {
                    path: menu.path.replace('/dashboard', ''),
                    name: menu.menuName.replace(/\s+/g, ''),
                    component: componentImport,
                    meta: {
                        title: menu.menuName,
                        permission: menu.perms,
                        requiresAuth: true
                    }
                }
                routes.push(route)
            }
        }

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

    // 检查权限
    if (to.meta.permission && !userStore.hasPermission(to.meta.permission)) {
        next('/dashboard')
        return
    }

    next()
})

export default router
