import request from '@/utils/request'

export const authApi = {
    // 获取图片验证码
    getCaptcha(captchaKey) {
        console.log('发起验证码请求...')
        return request({
            url: '/api/finance-data/auth/captchaImage',
            method: 'get',
            params: {captchaKey},
            responseType: 'blob'
        }).then(response => {
            console.log('验证码响应:', response)
            // 直接返回blob URL
            return URL.createObjectURL(response)
        }).catch(error => {
            console.error('验证码请求失败:', error)
            console.error('请求配置:', error.config)
            // 返回一个占位图片URL或者重新抛出错误
            throw error
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