//对axios进行二次封装
import axios from 'axios'
//引入进度条
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
import store from '@/store'

//1、利用axios对象的方法create，创造一个axios实例
//2、request就是axios，但是我们要加上一些项目业务需求
const requests = axios.create({
    //基础路径，每次发送请求的时候，路径中会自动出现api
    baseURL: "/api",
    //超过规定的时间，停止请求
    timeout: 5000,
})

//请求拦截器：发送请求之前，该拦截器可以检测到请求，并在请求发送之前进行操作
requests.interceptors.request.use((config) => {
    //进度条开始
    nprogress.start()
    // 和后台提前沟通过，在请求头上挂上ID这样就能告诉服务器，是哪个用户在请求数据
    if (store.state.detail.uuid_token) {
        config.headers.userTempId = store.state.detail.uuid_token
    }
    if (store.state.users.token) {
        config.headers.token = store.state.users.token
    }
    return config
})

//响应拦截器
requests.interceptors.response.use((res) => {
    //进度条结束
    nprogress.done()
    //响应成功：拦截器可以检测到其数据
    return res.data
}, (error) => {
    //响应失败
    return Promise.reject(new Error('failed'))
})

//配置完了对外暴露、
export default requests