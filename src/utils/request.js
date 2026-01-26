import axios from 'axios'

// 创建axios实例
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API || 'http://localhost:8080',
    timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 添加token
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
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
        const res = response.data

        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        if (response.status === 200) {
            return res
        } else {
            console.error('接口错误:', res.message || '请求失败')
            return Promise.reject(new Error(res.message || '请求失败'))
        }
    },
    error => {
        console.error('响应错误:', error)

        // 处理401未授权
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/auth/login'
        }

        return Promise.reject(error)
    }
)

export default request