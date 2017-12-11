<!-- Item.vue -->
<template>
  <div>
    <h1>ItemText: {{ item.text }}</h1>
    <h2>FooCount: {{fooCount}}</h2>
  </div>
</template>
<script>
import fooStoreModule from '@/store/modules/foo'

import titleMixin from '@/title-mixin.js'

export default {
  mixins: [titleMixin],
  title() {
    return this.item.text
  },
  // 该方法是在服务器端运行的方法
  asyncData({ store, route }) {
    // 注册foo模块
    store.registerModule('foo', fooStoreModule)
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("fetchItem", route.params.id),
      store.dispatch('foo/inc')
    ])
  },
  computed: {
    // 从 store 的 state 对象中的获取 item。
    item() {
      return this.$store.state.items[this.$route.params.id];
    },
    fooCount() {
      return this.$store.state.foo.count;
    }
  },
  destroyed() {
    this.$store.unregisterModule('foo')
  }
};
</script>