import request from '@/utils/request'

export const userApi = {
    // 获取用户列表
    getUserList() {
        // 调用UserController的page方法
        return request({
            url: '/api/finance-data/user/page',
            method: 'post',
            data: {
                pageNum: 1,
                pageSize: 20
            }
        }).catch(error => {
            console.error('用户列表请求错误:', error)
            console.error('请求URL:', error.config?.url)
            console.error('Token:', localStorage.getItem('token'))
            throw error
        })
    },

    // 删除用户
    deleteUser() {
        // 调用后端删除用户API
        return request({
            url: '/api/finance-data/user/delete',
            method: 'post'
        })
    }
}