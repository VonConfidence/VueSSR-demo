// router.js
import Vue from 'vue'
import Router from 'vue-router'

import Hello from '@/components/Hello'
import Home from '@/components/Home'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [{
        path: '/hello',
        component: Hello
      },
      {
        path: '/home',
        component: () =>
          import ('@/components/Home')
      },
      {
        path: '/home_test',
        component: (resolve) => require(['./service-search.vue'], resolve)
      }
    ]
  })
}
