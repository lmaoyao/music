<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from "better-scroll"
  export default {
    name: "scroll",
    props:{
      // 有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件
      probeType:{
        type:Number,
        default:1,
      },
      // better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件
      click:{
        type:Boolean,
        default:true,
      },
      // 是否监听滚动事件
      data:{
        type:Array,
        default:null
      },
      listenScroll:{
        type:Boolean,
        default:false,
      },
      //是否实现上拉刷新的功能
      pullup:{
        type:Boolean,
        default:false,
      },
      beforeScroll:{
        type:Boolean,
        default:false,
      }
    },
    mounted(){
      //确保组建渲染成功
      setTimeout(()=>{
        this._initScroll()
      },20)
    },
    methods:{
      _initScroll(){
        if(!this.$refs.wrapper){
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper,{
          probeType:this.probeType,
          click:this.click,
        })
        if (this.listenScroll) {
          let me = this;
          this.scroll.on("scroll",(pos)=>{
            me.$emit("scroll",pos)
          })
        }
        if (this.pullup) {//先判断pullup属否为true  当为true的时候实现上拉刷新
          //当滚动结束的时候，让他执行一个事件
          this.scroll.on("scrollEnd",()=>{
            //当快滚动到底部的时候
            if (this.scroll.y <= this.scroll.maxScrollY + 50) {
              this.$emit('scrollToEnd')
            }
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart',()=>{
            this.$emit('beforeScroll')
          })
        }
      },
      // 启用 better-scroll, 默认 开启。
      enable() {
        this.scroll && this.scroll.enable()
      },
      // 禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应
      disable() {
        this.scroll && this.scroll.disable()
      },
      // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      // 滚动到指定的位置
      scrollTo(){
        this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
      },
      // 滚动到指定的目标元素
      scrollToElement(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
      },
      
    },
    watch:{
      data(){
        setTimeout(()=>{
          this.refresh()
        },20)
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
