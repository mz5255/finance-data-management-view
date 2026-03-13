import axios from 'axios'
import {ElMessage} from 'element-plus'

// 创建axios实例
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API || '',
    timeout: 10000,
    withCredentials: true  // 允许携带cookie
})

// 标记是否正在处理退出登录（避免重复处理）
let isLoggingOut = false

// 请求拦截器
request.interceptors.request.use(
    config => {
        console.log('发起请求:', config.method.toUpperCase(), config.url)
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['satoken'] = token
            console.log('Token:', token)
        }
        // 避免重定向循环
        config.maxRedirects = 0
        return config
    },
    error => {
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        // 如果是blob类型，直接返回
        if (response.config.responseType === 'blob') {
            return response.data
        }
        
        const res = response.data
        console.log('响应数据:', res)

        // 检查业务状态码
        if (res && (res.code == 400 || res.code == '400')) {
            console.log('检测到400错误:', res.message)
            ElMessage.error(res.message || '请求失败')
            return Promise.reject(new Error(res.message || '请求失败'))
        }

        return res
    },
    error => {
        console.error('响应错误:', error)

        // 处理400业务错误
        if (error.response && error.response.status === 400) {
            const res = error.response.data
            console.log('400错误响应:', res)
            if (res && res.message) {
                ElMessage.error(res.message)
            }
        }

        // 处理401未授权
        if (error.response && error.response.status === 401) {
            // 如果是在修改密码页面收到401，说明密码修改成功，静默处理
            // 其他情况则显示未授权提示
            if (window.location.pathname !== '/dashboard/password') {
                ElMessage.error('登录已过期，请重新登录')
            }

            localStorage.removeItem('token')

            // 避免在登录页面时重定向造成循环
            // 也避免在修改密码页面时重定向（因为组件会处理跳转）
            if (window.location.pathname !== '/auth/login' && window.location.pathname !== '/dashboard/password') {
                window.location.href = '/auth/login'
            }
        }

        // 处理重定向循环
        if (error.response && error.response.status === 302) {
            console.error('检测到重定向:', error.response.headers.location)
            // 避免重定向循环
            if (error.response.headers.location && error.response.headers.location.includes('/login')) {
                localStorage.removeItem('token')
                if (window.location.pathname !== '/auth/login') {
                    window.location.href = '/auth/login'
                }
            }
        }

        return Promise.reject(error)
    }
)

export default request