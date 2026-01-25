import request from '@/utils/request'

export const authApi = {
    // 获取验证码
    getCaptcha(telephone) {
        return request({
            url: '/api/finance-data/auth/captchaImage',
            method: 'get',
            params: {telephone}
        })
    },

    // 用户注册
    register(data) {
        return request({
            url: '/api/finance-data/auth/register',
            method: 'post',
            data
        })
    },

    // 用户登录
    login(data) {
        return request({
            url: '/api/finance-data/auth/login',
            method: 'post',
            data
        })
    },

    // 查询用户信息
    getUserInfo(data) {
        return request({
            url: '/api/finance-data/auth/query',
            method: 'get',
            data
        })
    },

    // 用户登出
    logout() {
        return request({
            url: '/api/finance-data/auth/logout',
            method: 'post'
        })
    }
}