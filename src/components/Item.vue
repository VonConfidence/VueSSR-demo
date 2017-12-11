<!-- Item.vue -->
<template>
  <div>{{ item.text }}</div>
</template>
<script>
export default {
  // 该方法是在服务器端运行的方法
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch("fetchItem", route.params.id);
  },
  computed: {
    // 从 store 的 state 对象中的获取 item。
    item() {
      return this.$store.state.items[this.$route.params.id];
    }
  }
};
</script>