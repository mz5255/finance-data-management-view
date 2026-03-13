import request from '@/utils/request'

export const userApi = {
    // 获取用户列表（仅正常状态用户）
    getUserList(params = {}) {
        return request({
            url: '/api/finance-data/user/page',
            method: 'post',
            data: {
                pageNum: params.pageNum || 1,
                pageSize: params.pageSize || 20
            }
        })
    },

    // 获取所有用户列表（包括冻结用户，用于管理后台）
    getAllUsers(params = {}) {
        return request({
            url: '/api/finance-data/user/admin/page',
            method: 'post',
            data: {
                pageNum: params.pageNum || 1,
                pageSize: params.pageSize || 20
            }
        })
    },

    // 更改用户状态
    updateUserState(userId, state) {
        return request({
            url: '/api/finance-data/user/admin/state',
            method: 'put',
            params: {userId, state}
        })
    },

    // 删除用户
    deleteUser(userId) {
        return request({
            url: `/api/finance-data/user/${userId}`,
            method: 'delete'
        })
    },

    // 更新用户个人信息
    updateUserProfile(data) {
        return request({
            url: '/api/finance-data/user/profile',
            method: 'put',
            data
        })
    }
}