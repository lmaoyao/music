<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">音乐播放器 </h1>
  </div>
</template>

<script>
    export default {
        name: "m-header"
    }
</script>

<style scoped lang='stylus'>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'
  .m-header
    position relative
    height 44px
    text-align center
    color $color-theme
    font-size 0
    .icon
      display inline-block
      vertical-align top
      margin-right 9px
      width 44px
      height 44px
      background: url('./logo@3x.png') no-repeat center
      background-size 44px 44px
    .text
      display inline-block
      font-size $font-size-large
      line-height 44px
</style>
