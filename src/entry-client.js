import {
  createApp
} from './app'



// 客户端特定引导逻辑
const {
  app,
  router,
  store
} = createApp()

import './styles/global.css'

// import 'bootstrap/dist/css/bootstrap.css'

// import 'jquery'
// import 'bootstrap/dist/css/bootstrap.js'


if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
router.onReady(() => {
  app.$mount('#app')
})
