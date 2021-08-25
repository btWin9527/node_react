import axios from 'axios'
import {Toast} from 'zarm'

const MODE = import.meta.env.MODE // 环境变量

axios.default.baseURL = MODE === 'development' ? '/api' : 'http://127.0.0.1/7001'
axios.default.withCredentials = true
axios.default.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.default.headers['Authorization'] = `${localStorage.getItem('token') || null}`
axios.default.headers.post['Content-Type'] = 'application/json'

// 拦截设置
axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object') {
        Toast.show('服务器异常')
        return Promise.reject(res)
    }
    if (res.data.code !== 200) {
        if (res.data.msg) Toast.show(res.data.msg)
        if (res.data.code === 401) {
            window.location.href = '/login'
        }
        return Promise.reject(res.data)
    }
    return res.data
})

export default axios