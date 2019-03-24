<template>
  <!-- 轮播组件 -->
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <!-- <div class="swiper-slide">Slide 1</div> -->
      <slot></slot>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
  // 引入swiper插件
  import Swiper from 'swiper';
  export default {
    // 需要mounted而不是created
    mounted() {
      // // dom挂载完毕初始化
      setTimeout(()=>{
        this.init()
      }, 20)
    },
    methods: {
      init() {
        new Swiper('.swiper-container', {
          loop : true,
          autoplay: {
            autoplay: true,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination'
          },
        })
      }
    }
  }
</script>

<style scoped lang='stylus'>
  .swiper-container
    img
      display block
      width 100%
</style>
