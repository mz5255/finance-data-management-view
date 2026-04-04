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
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['satoken'] = token
        }
        config.maxRedirects = 0
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        if (response.config.responseType === 'blob') {
            return response.data
        }

        const res = response.data

        if (res && (res.code == 400 || res.code == '400')) {
            ElMessage.error(res.message || '请求失败')
            return Promise.reject(new Error(res.message || '请求失败'))
        }

        return res
    },
    error => {
        if (error.response && error.response.status === 400) {
            const res = error.response.data
            if (res && res.message) {
                ElMessage.error(res.message)
            }
        }

        if (error.response && error.response.status === 401) {
            if (window.location.pathname !== '/dashboard/password') {
                ElMessage.error('登录已过期，请重新登录')
            }

            localStorage.removeItem('token')

            if (window.location.pathname !== '/auth/login' && window.location.pathname !== '/dashboard/password') {
                window.location.href = '/auth/login'
            }
        }

        if (error.response && error.response.status === 302) {
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