// 模拟菜单数据，实际应该从后端API获取
export const mockMenuData = [
    {
        id: 1,
        title: '系统管理',
        path: '/dashboard/system',
        icon: 'icon-system',
        permission: 'system:view',
        children: [
            {
                id: 11,
                title: '用户管理',
                path: '/dashboard/user',
                component: '/UserList',
                permission: 'system:user:list',
                icon: 'icon-user'
            },
            {
                id: 12,
                title: '权限管理',
                path: '/dashboard/permission/management',
                component: '/permission/PermissionManagement',
                permission: 'system:permission:manage',
                icon: 'icon-permission'
            }
        ]
    },
    {
        id: 2,
        title: '个人中心',
        path: '/dashboard/auth/profile',
        component: '/auth/UserProfile',
        permission: 'user:profile',
        icon: 'icon-profile'
    }
]