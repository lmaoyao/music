<template>
  <!-- 歌手列表   这是一个类似通讯录组件 -->
  <scroll class="listview" :data='data' ref='listview'>

    <ul>
      <li ref="listGroup" class="list-group" v-for="(item,i) in data" :key='i'>
        <h2 class="list-group-title">{{item.title}}</h2>
        <ul>
          <li v-for="(each, j) in item.items" :key='j' class="list-group-item" @click='selectItem(each)'>
            <img width='50' height='50' class="pic" v-lazy="each.avatar" alt="">
            <span class="name">{{each.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 右侧字母(A-Z)导航 -->
    <div class="list-shortcut" @touchstart='onShortcutTouchStart' @touchmove.stop.prevent='onShortcutTouchMove'>
      <ul>
        <li :data-index='i' v-for="(item,i) in shortcutList" :key='i' class="item">
          {{item}}
        </li>
      </ul>
    </div>

    <!-- loading加载中... -->
    <div class="loading-container" v-show='!data.length'>
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from "../scroll/scroll"
  import Loading from "../loading/loading"
  const ANCHOR_HEIGHT = 20
  export default {
    props: {
      // data: [{…}, {…}, {…}, {…}, {…}, {…}]
      // {items: (3) [Singer, Singer, Singer],title: "A"}
      // singer: {id: "xxx",name: "xxx",pic: "xxx"}
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((e,i)=>{
          return e.title.substring(0,1)
        })
      }
    },
    created() {
      // this.touch为何不写在data或者时props中? 是因为data主要时负责页面的数据绑定在dom中,会有set和get,会有一些监听事件,此时并不需要观测touch的变化,只是为了获取touch中的数据
      this.touch = {}
    },
    methods: {
      //
      refresh() {
        this.$refs.listview.refresh()
      },
      // touchstart 当点击时触发
      onShortcutTouchStart(e) {
        let anchorIndex = e.target.dataset['index']/1
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      // touchmove当滚动时触发
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
        let anchorIndex = this.touch.anchorIndex + delta
        // console.log(anchorIndex)
        this._scrollTo(anchorIndex)
      },
      // 定义公共方法,滚动到哪里
      _scrollTo(anchorIndex) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
      },
      // 数据传递,子传父,自定义事件借助$emit
      selectItem(item) {
        this.$emit('select', item)
      }
    },
    components: {
      Scroll,Loading
    }
  }
</script>

<style scoped lang='stylus'>
  @import '~common/stylus/variable';
  .listview
    position relative
    height 100%
    width 100%
    overflow hidden
    background-color $color-background
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        background-color $color-highlight-background
        padding-left 15px
        font-size $font-size-small
        color $color-text-l
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        img
          border-radius 50%
        span
          flex 1
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium
    .list-shortcut
      position absolute
      z-index 30
      top 50%
      right 0
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background-color $color-background-d
      font-family Helvetica
      .item
        line-height 1
        padding 3px
        color $color-text-l
        font-size $font-size-medium
        height 14px
        &.current
          color $color-theme
    .loading-container
      position fixed
      top 50%
      width 100%
      transform translateY(-50%)
</style>
