import App from './App'
// 导入 store 的实例对象
import store from './store/store.js'
// 导入自己封装的 mixin 模块
import badgeMix from '@/mixins/tabbar-badge.js'
// #ifndef VUE3
import Vue from 'vue'
//导入网络请求的包
import {
    $http
} from '@escook/request-miniprogram'
//在uniapp中将导入的包挂载在uniapp的顶级对象上
uni.$http = $http
//请求的根路径
$http.baseUrl = "https://api-hmugo-web.itheima.net"
//请求拦截器
$http.beforeRequest = function(options) {
    uni.showLoading({
        "title": "数据加载中..."
    })
    // 判断请求的是否为有权限的 API 接口
    if (options.url.indexOf('/my/') !== -1) {
        // 为请求头添加身份认证字段
        options.header = {
            // 字段的值可以直接从 vuex 中进行获取
            Authorization: store.state.m_user.token,
        }
    }
}
//响应拦截器
$http.afterRequest = function() {
    uni.hideLoading()
}
//封装自定义弹窗方法
uni.$showMsg = function(title = "数据请求失败", duractions = 1500) {
    uni.showToast({
        title,
        icon: "none",
        duractions,
        mask: true
    })
}

Vue.config.productionTip = false
App.mpType = 'app'
Vue.mixin(badgeMix)
const app = new Vue({
    ...App,
    // 将 store 挂载到 Vue 实例上
    store
})

app.$mount()
// #endif
// app.mixin(Mixin);
// #ifdef VUE3
import {
    createSSRApp
} from 'vue'
export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}
// #endif
