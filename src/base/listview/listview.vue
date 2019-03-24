<template>
  <!-- 歌手列表   这是一个类似通讯录组件 -->
  <scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul>
      <li ref="listGroup" class="list-group" v-for="(item,i) in data" :key="i">
        <h2 class="list-group-title">{{item.title}}</h2>
        <ul>
          <li
            v-for="(each, j) in item.items"
            :key="j"
            class="list-group-item"
            @click="selectItem(each)"
          >
            <img width="50" height="50" class="pic" v-lazy="each.avatar" alt>
            <span class="name">{{each.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 右侧字母(A-Z)导航 -->
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          :data-index="i"
          v-for="(item,i) in shortcutList"
          :key="i"
          class="item"
          :class="{'current' : currentIndex === i}"
        >{{item}}</li>
      </ul>
    </div>

    <!-- loading加载中... -->
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>

<script>
import Scroll from "../scroll/22";
import loading from "../loading/loading";
const ANCHOR_HEIGHT = 20; //每一个锚点的高度
const TITLE_HEIGHT = 30;
export default {
  name: "listview",
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  data() {
    return {
      scrollY: -1, //检测实时滚动的位置
      currentIndex: 0 //加颜色 当前应该显示的第几个
    };
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    Scroll,
    loading
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    //顶部显示栏
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  methods: {
    // touchstart 当手指点击时触发
    onShortcutTouchStart(e) {
      let anchorIndex = e.target.dataset["index"] / 1; //
      let firstTouch = e.touches[0]; //获取的手指的位置
      this.touch.y1 = firstTouch.pageY; //获取的偏移量
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    // touchmove 当手指滚动时触发
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY; //获取的偏移量
      let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT); //向下取整Y轴上的要偏移的距离
      let anchorIndex = this.touch.anchorIndex + delta;
      // console.log(anchorIndex)
      this._scrollTo(anchorIndex);
    },
    refresh() {
      this.$refs.listview.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup; //获取的23个字母
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i]; //每一个字母的距离顶端的高度
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    // 定义公共方法,滚动的位置
    _scrollTo(anchorIndex) {
      //anchorIndex  每个字母的索引
      if (anchorIndex !== 0 && !anchorIndex) {
        //当点击不是那几个字母的时候
        return;
      }
      //设置边界调理
      if (anchorIndex < 0) {
        anchorIndex = 0;
      } else if (anchorIndex > this.listHeight.length - 2) {
        //当点击的达到上限的时候
        anchorIndex = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[anchorIndex];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0);
    },
    // 数据传递,子传父,自定义事件借助$emit,将
    selectItem(item) {
      //item  每个li的信息
      this.$emit("select", item);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    //设置边栏颜色的滚动
    scrollY(newY) {
      const listHeight = this.listHeight;
      //当n滚动到顶部的时候 newY是>0的
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      //在中间部分滚动的时候
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1]; //最后的一个元素
        if (-newY >= height1 && -newY < height2) {
          //设置颜色的滚动的距离
          this.currentIndex = i; //每一个字母
          // console.log(this.currentIndex);
          this.diff = height2 + newY;
          return;
        }
      }
      //当滚动到底部的时候,且newY大于最后一个元素的上线
      this.currentIndex = listHeight.length - 2;
    },

    //顶部属性的设置
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      background-color: $color-highlight-background;
      padding-left: 15px;
      font-size: $font-size-small;
      color: $color-text-l;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      img {
        border-radius: 50%;
        width: 80px;
        height: 80px;
      }

      span {
        flex: 1;
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background-color: $color-background-d;
    font-family: Helvetica;

    .item {
      line-height: 1;
      padding: 3px;
      color: $color-text-l;
      font-size: $font-size-medium;
      height: 14px;

      &.current {
        color: orangered;
      }
    }
  }

  .loading-container {
    position: fixed;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
  }

  .list-fixed {
    background-color: $color-highlight-background;
    padding-left: 15px;
    width: 100%;
    font-size: $font-size-small;
    color: $color-text-l;
    height: 30px;
    position: fixed;
    top: 87px;
    line-height: 30px;
  }
}
</style>
