<template>
  <div class="hello">
    <h1>this.$route.params.id: {{id}}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id
    }
  }
}
</script>

<style scoped>
  .hello {
    height: 200px;
    background-color: dodgerblue;
    line-height: 200px;
  }
</style>
