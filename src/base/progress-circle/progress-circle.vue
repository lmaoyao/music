/* mini播放器小圆圈 */
<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 描边  stroke-dasharray：描边的偏移-->
      <!-- 内层的圆 -->
      <!-- <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" /> -->
      <!-- 外层的圆 -->
      <!-- <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/> -->
      <!-- storke-dashoffset  描边的偏移 -->
    </svg>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent:{//半径
      type:Number,
      default:0
    }
  },
  data(){
    return{
      dashArray:Math.PI *100
    }
  },
  computed:{
    dashOffset(){//圆圈的偏移量
      return  (1-this.percent) * this.dashArray
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.progress-circle {
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: $color-theme-d;/* 浅黄色 */
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }
}
</style>
