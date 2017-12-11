// router.js
import Vue from 'vue'
import Router from 'vue-router'

import Hello from '@/components/Hello'
// import Home from '@/components/Home'

// const HomeVue = () => import('./components/Home.vue')
Vue.use(Router)
export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [{
        path: '/hello/:id',
        name: 'hello',
        component: Hello
      },
      {
        path: '/home/:id',
        component: () =>
          import ('@/components/Home.vue')
      },
      {
        path: '/home_test',
        component: (resolve) => require(['./components/Home.vue'], resolve)
      }
    ]
  })
}
