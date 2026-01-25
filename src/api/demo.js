import request from '@/utils/request'

export const demoApi = {
    // 获取用户列表
    getUserList() {
        return request({
            url: '/list',
            method: 'get'
        })
    },

    // 删除用户
    deleteUser() {
        return request({
            url: '/delete',
            method: 'post'
        })
    }
}