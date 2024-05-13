// Set config defaults when creating the instance
//自定义实例默认值
import axios from "axios";

const isDev = process.env.NODE_ENV === 'development'

const myAxios = axios.create({
    baseURL: isDev ? 'http://localhost:8080/api' : '线上地址',
    headers: { 'Content-type': 'application/x-www-form-urlencoded'}
});

// 添加凭证
myAxios.defaults.withCredentials = true;

//拦截器
// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log("请求发送了",config)
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
// myAxios.interceptors.response.use(function (response) {
//     // 对响应数据做点什么
//     console.log("请求收到了了",response)
//     return response.data;
// }, function (error) {
//     // 对响应错误做点什么
//     return Promise.reject(error);
// });

// 添加响应拦截器
myAxios.interceptors.response.use(function (response){

    if (response?.data?.code === 40100){
        const redirectUrl = window.location.href;
        console.log('redirectUrl', redirectUrl)
        window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    return response.data;
}, function (error){
    return Promise.reject(error)
})
export default myAxios;
