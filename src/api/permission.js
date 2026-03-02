import request from '@/utils/request'

export const permissionApi = {
    // 为用户分配角色
    assignRoles(userId, roleIds) {
        return request({
            url: `/api/finance-data/system/permission/assignRoles`,
            method: 'post',
            params: {userId},
            data: roleIds
        })
    },

    // 为角色分配菜单权限
    assignMenus(roleId, menuIds) {
        return request({
            url: `/api/finance-data/system/permission/assignMenus`,
            method: 'post',
            params: {roleId},
            data: menuIds
        })
    },

    // 获取用户角色
    getUserRoles(userId) {
        return request({
            url: `/api/finance-data/system/permission/userRoles/${userId}`,
            method: 'get'
        })
    },

    // 获取用户权限
    getUserPermissions(userId) {
        return request({
            url: `/api/finance-data/system/permission/userPermissions/${userId}`,
            method: 'get'
        })
    },

    // 检查用户权限
    checkPermission(userId, permission) {
        return request({
            url: `/api/finance-data/system/permission/checkPermission`,
            method: 'get',
            params: {userId, permission}
        })
    },

    // 检查用户角色
    checkRole(userId, roleKey) {
        return request({
            url: `/api/finance-data/system/permission/checkRole`,
            method: 'get',
            params: {userId, roleKey}
        })
    },

    // 获取用户菜单树
    getUserMenus(userId) {
        return request({
            url: `/api/finance-data/system/permission/getMenuTreeByUserId`,
            method: 'get',
            params: {userId}
        })
    },

    // 获取角色列表
    getRoleList() {
        return request({
            url: `/api/finance-data/system/permission/roleList`,
            method: 'get'
        })
    },

    // 获取菜单列表
    getMenuList() {
        return request({
            url: `/api/finance-data/system/permission/menuList`,
            method: 'get'
        })
    },

    // 获取菜单树
    getMenuTree() {
        return request({
            url: `/api/finance-data/system/permission/menuTree`,
            method: 'get'
        })
    },

    // 获取角色菜单权限
    getRoleMenus(roleId) {
        return request({
            url: `/api/finance-data/system/permission/roleMenus/${roleId}`,
            method: 'get'
        })
    }
}
