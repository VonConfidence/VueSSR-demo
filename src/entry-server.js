import {
  createApp
} from './app'

export default context => {
  return new Promise((resolve, reject) => {
    const {
      app,
      router,
      store
    } = createApp()
    // 设置服务器端的 router的位置
    router.push(context.url)

    // 等到router将可能得异步组件和钩子函数解析完成
    router.onReady(() => {
      // 获取匹配搭配的路由组件
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents) {
        return reject({
          code: 404
        })
      }
      // Promise应该resolve应用程序实例 以便它可以渲染
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          // 对所有匹配的路由组件调用 `asyncData()`
          Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        // 并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state
        resolve(app)
      })

    }, reject) //router.onReady

    // return app
  })

}
