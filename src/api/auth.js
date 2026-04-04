import request from '@/utils/request'

export const authApi = {
    // 获取图片验证码
    getCaptcha(captchaKey) {
        return request({
            url: '/api/finance-data/auth/captchaImage',
            method: 'get',
            params: {captchaKey},
            responseType: 'blob'
        }).then(response => {
            return URL.createObjectURL(response)
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
    getUserInfo() {
        return request({
            url: '/api/finance-data/user/info',
            method: 'get'
        })
    },

    // 用户登出
    logout() {
        return request({
            url: '/api/finance-data/auth/logout',
            method: 'post'
        })
    },

    // 修改密码
    changePassword(data) {
        return request({
            url: '/api/finance-data/auth/changePassword',
            method: 'post',
            data
        })
    }
}