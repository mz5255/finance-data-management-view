import request from '@/utils/request'
import {mockMenuData} from '@/mock/menu'

export const permissionApi = {
    // 为用户分配角色
    assignRoles(userId, roleIds) {
        return request({
            url: '/api/finance-data/system/permission/assignRoles',
            method: 'post',
            params: {userId},
            data: roleIds
        })
    },

    // 为角色分配菜单权限
    assignMenus(roleId, menuIds) {
        return request({
            url: '/api/finance-data/system/permission/assignMenus',
            method: 'post',
            params: {roleId},
            data: menuIds
        })
    },

    // 获取用户角色
    getUserRoles(userId) {
        // 模拟返回用户角色
        return Promise.resolve({
            success: true,
            data: ['admin', 'user']
        })
    },

    // 获取用户权限
    getUserPermissions(userId) {
        // 模拟返回用户权限
        return Promise.resolve({
            success: true,
            data: ['system:view', 'system:user:list', 'system:permission:manage', 'user:profile']
        })
    },

    // 检查用户权限
    checkPermission(userId, permission) {
        return request({
            url: '/api/finance-data/system/permission/checkPermission',
            method: 'get',
            params: {userId, permission}
        })
    },

    // 检查用户角色
    checkRole(userId, roleKey) {
        return request({
            url: '/api/finance-data/system/permission/checkRole',
            method: 'get',
            params: {userId, roleKey}
        })
    },

    // 获取用户菜单树
    getUserMenus(userId) {
        // 模拟返回用户菜单
        return Promise.resolve({
            success: true,
            data: mockMenuData
        })
    }
}