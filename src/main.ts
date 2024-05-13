import { createApp } from 'vue'
import App from './App.vue'

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import { Toast, Dialog } from 'vant'

import '../global.css'

import * as VueRouter from "vue-router"
import routes from "./config/route.ts";


// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式(将hash模式修改为无#模式)。
    history: VueRouter.createWebHistory(),
    routes, // `routes: routes` 的缩写
})

const app = createApp(App);

// 确保 _use_ 路由实例使
// 整个应用支持路由。
app.use(router)

// toast样式丢失，单独引入
app.use(Toast)
app.use(Dialog)

app.mount('#app')