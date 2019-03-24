<template>
  <!-- 导航组件,管理router(路由)跳转 -->
  <div class="tab">
    <router-link tag='div' class="tab-item" to="/recommend">
      <span>推荐</span>
    </router-link>
    <router-link tag='div' class="tab-item" to="/singer">
      <span>歌手</span>
    </router-link>
    <router-link tag='div' class="tab-item" to="/rank">
      <span>排行</span>
    </router-link>
    <router-link tag='div' class="tab-item" to="/search">
      <span>搜索</span>
    </router-link>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped lang='stylus'>
  @import '~common/stylus/variable'
  .tab
    display flex
    height 44px
    line-height 44px
    font-size $font-size-medium-x
    .tab-item
      flex 1
      text-align center
      span
        padding-bottom 5px
        color $color-text-l
      &.router-link-active
        span
          color $color-theme
          border-bottom 2px solid $color-theme
</style>
