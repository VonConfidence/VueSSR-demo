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
// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例

// 返回挂载路由之后的实例对象
export function createApp() {
  const router = createRouter()
  const app = new Vue({
    router,
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  return { app, router }
}
