import request from '@/utils/request'

export const permissionApi = {
    // ==================== 权限分配相关 ====================
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
            url: `/api/finance-data/system/role/assignMenus`,
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

    // ==================== 菜单管理相关 ====================
    // 获取菜单列表
    getMenuList() {
        return request({
            url: `/api/finance-data/system/menu/list`,
            method: 'get'
        })
    },

    // 获取菜单树
    getMenuTree() {
        return request({
            url: `/api/finance-data/system/menu/tree`,
            method: 'get'
        })
    },

    // 获取菜单详情
    getMenuDetail(menuId) {
        return request({
            url: `/api/finance-data/system/menu/${menuId}`,
            method: 'get'
        })
    },

    // 创建菜单
    createMenu(data) {
        return request({
            url: `/api/finance-data/system/menu`,
            method: 'post',
            data
        })
    },

    // 更新菜单
    updateMenu(data) {
        return request({
            url: `/api/finance-data/system/menu`,
            method: 'put',
            data
        })
    },

    // 删除菜单
    deleteMenu(menuId) {
        return request({
            url: `/api/finance-data/system/menu/${menuId}`,
            method: 'delete'
        })
    },

    // 获取角色菜单树（用于分配）
    getRoleMenuTree(roleId) {
        return request({
            url: `/api/finance-data/system/menu/roleMenuTree/${roleId}`,
            method: 'get'
        })
    },

    // ==================== 角色管理相关 ====================
    // 获取角色列表
    getRoleList() {
        return request({
            url: `/api/finance-data/system/role/list`,
            method: 'get'
        })
    },

    // 获取角色详情
    getRoleDetail(roleId) {
        return request({
            url: `/api/finance-data/system/role/${roleId}`,
            method: 'get'
        })
    },

    // 创建角色
    createRole(data) {
        return request({
            url: `/api/finance-data/system/role`,
            method: 'post',
            data
        })
    },

    // 更新角色
    updateRole(data) {
        return request({
            url: `/api/finance-data/system/role`,
            method: 'put',
            data
        })
    },

    // 删除角色
    deleteRole(roleId) {
        return request({
            url: `/api/finance-data/system/role/${roleId}`,
            method: 'delete'
        })
    },

    // 获取角色的菜单ID列表
    getRoleMenuIds(roleId) {
        return request({
            url: `/api/finance-data/system/role/menuIds/${roleId}`,
            method: 'get'
        })
    }
}
