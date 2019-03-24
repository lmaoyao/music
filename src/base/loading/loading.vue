<template>
  <!-- loading加载中...组件 -->
  <div class="loading">
    <img width="24" height="24" src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '加载中...'
      },
    },
  }
</script>

<style scoped lang='stylus'>
  @import '~common/stylus/variable';
  .loading
    width 100%
    text-align center
    .desc
      line-height 20px
      font-size $font-size-medium
      color $color-text-l
</style>