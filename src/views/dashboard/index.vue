<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎: {{ type }} {{ name }}</div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import jsCookie from 'js-cookie'

export default {
  name: 'Dashboard',
  data() {
    return {
      type: jsCookie.get('type'),
      name: jsCookie.get('username')
    }
  },
  computed: {
    // ...mapGetters([
    //   'name'
    // ])
  },
  mounted() {
    console.log('store:')
    console.log(jsCookie.get('userId'))
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
