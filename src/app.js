// app.js
/*
const Vue = require('vue')
module.exports = function createApp(context) {
  return new Vue({
    data: {
      url: context.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })
}
*/

import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

import { createStore } from './store'
import { sync } from 'vuex-router-sync'
// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例

// 返回挂载路由之后的实例对象
export function createApp() {
  const router = createRouter()

  const store = createStore()

  // 同步路由状态(route state)到 store
  sync(store, router)

  const app = new Vue({
    router,

    store,

    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  return { app, router, store }
}
