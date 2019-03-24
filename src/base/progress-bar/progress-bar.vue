<template>
  <!-- 进度条组件 -->
  <div class="progress-bar" ref="progressBar" @click="ProgressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressBtnTouchStart"
        @touchmove.prevent="progressBtnTouchMove"
        @touchend.prevent="progressBtnTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
const progressBtnWidth = 16; //小球的宽度
import { prefixStyle } from "../../common/js/dom.js";
const transform = prefixStyle("transform");
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent > 0 && !this.touch.initiated) {
        const batWidth = this.$refs.progressBar.clientWidth - progressBtnWidth; //进度条总的宽度    总的宽度-小球的宽度
        const offsetWidth = newPercent * batWidth; //偏移的宽度
        this._offset(offsetWidth);
      }
    }
  },
  created() {
    this.touch = {};//目的是用于共享数据
  },
  methods: {
    progressBtnTouchStart(e) {//当在屏幕上按下手指时触发
      this.touch.initiated = true;//表示已经初始化了
      this.touch.startX = e.touches[0].pageX; //第一次触摸时的位置
      this.touch.left = this.$refs.progress.clientWidth; //点击之后偏移的距离
    },
    progressBtnTouchMove(e) {//当在屏幕上移动手指时触发
      if (!this.touch.initiated) {
        return;
      }
      //touches[0].pageX  触点相对于HTML文档左边沿的X坐标。当存在水平滚动的偏移时，这个值包含了水平滚动的偏移
      const deltaX = e.touches[0].pageX - this.touch.startX;//纵向x的偏移量
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
    },
    progressBtnTouchEnd() {//当在屏幕上抬起手指时触发
      this.touch.initiated = false;
      this._triggerPercent();
    },
    _triggerPercent() {
      const batWidth = this.$refs.progressBar.clientWidth - progressBtnWidth; //总的距离
      const percent = this.$refs.progress.clientWidth / batWidth;//移动的百分比
      this.$emit("percentChange", percent);//获取父级的数据  把移动的百分比传派发父级
    },
    ProgressClick(e) {//点击实现滑块的移动
      // this._offset(e.offsetX);
      //当我们点击progressBtn的时候，e.offsetX获取不对
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercent();
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;//小球的偏移
    }
  }
};
</script>

<style scoped lang='stylus'>
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: absolute;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background-color: $color-theme;
      }
    }
  }
}
</style>