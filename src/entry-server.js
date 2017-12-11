import { createApp } from './app'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()

    router.push(context.url)
    router.onReady(() => {
      // 获取匹配搭配的路由组件
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents) {
        return reject({code: 404})
      }
      resolve(app)
    }, reject)

    // return app
  })

}
