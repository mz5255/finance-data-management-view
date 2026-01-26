/**
 * 根据菜单生成路由配置
 * @param {Array} menus 菜单数据
 * @returns {Array} 路由配置数组
 */
export const generateRoutes = (menus) => {
    const routes = []

    menus.forEach(menu => {
        if (menu.component) {
            const route = {
                path: menu.path.replace('/dashboard', ''),
                name: menu.name,
                component: () => import(`@/views${menu.component}.vue`),
                meta: {
                    title: menu.title,
                    permission: menu.permission,
                    requiresAuth: true
                }
            }
            routes.push(route)
        }

        if (menu.children && menu.children.length > 0) {
            routes.push(...generateRoutes(menu.children))
        }
    })

    return routes
}

/**
 * 注册动态路由
 * @param {Object} router 路由实例
 * @param {Array} menus 菜单数据
 */
export const registerDynamicRoutes = (router, menus) => {
    const routes = generateRoutes(menus)
    routes.forEach(route => {
        router.addRoute('Dashboard', route)
    })
}
