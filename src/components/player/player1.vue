<template>
  <!-- 播放器组件,在任何路由都可以播放,要放在app.vue -->
  <div class='player' v-show='playlist.length>0'>

    <transition name='normal'>
      <!-- 全屏播放器 -->
      <div class="normal-player" v-show='fullScreen'>
        <!-- 背景 -->
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%" alt="">
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back" @click='back'>
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>

        <!-- 中间 -->
        <div class="middle" 
            @touchstart.prevent='touchstart'
            @touchmove.prevent='touchmove'
            @touchend.prevent='touchend'
        >
          <!-- cd -->
          <div class="middle-l" ref='cd'>
            <div class="cd-wrapper" ref='cdWrapper'>
              <div class="cd" :class='cdRotate'>
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>

          <!-- 歌词 -->
          <scroll :data='currentLyric&&currentLyric.lines' class="middle-r" ref='lyricList'>
            <div class="lyric-wrapper">
              <div v-if='currentLyric'>
                <p :class='{"current":i===currentLineNum}' class="text" ref="lyricLine" :key='i' v-for="(line,i) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>

        <!-- 音量 -->
        <input type="range" class="range" ref="range" max="100" min="0" v-model="volume">

        <!-- 下面 -->
        <div class="bottom">
          <!-- 当前展示的页面 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @percentChange='percentChange' :percent='percent'></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>

          <div class="operators">
            <!-- 播放模式 -->
            <div class="icon i-left">
              <i :class="modeIcon" @click='changeMode'></i>
            </div>
            <!-- 上一曲 -->
            <div class="icon i-left" :class="disable">
              <i class="icon-prev" @click='prev'></i>
            </div>
            <!-- 暂停/播放 -->
            <div class="icon i-center" :class="disable">
              <i :class="iconPlay" @click='togglePlay'></i>
            </div>
            <!-- 下一曲 -->
            <div class="icon i-right" :class="disable">
              <i class="icon-next" @click='next'></i>
            </div>
            <!-- 喜欢 -->
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name=mini>
      <!-- mini播放器 -->
      <div class="mini-player" v-show="!fullScreen" @click='open'>
        <div class="icon">
          <img :class="cdRotate" width="40" height="40" :src="currentSong.image" alt="">
        </div>
        <div class="text">
          <h2 class="name" v-html='currentSong.name'></h2>
          <p class="desc" v-html="currentSong.signer"></p>
        </div>
        <div class="control">
          <i @click.stop='togglePlay' :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

    <!-- audio -->
    <audio @ended='ended'
           @timeupdate='updateTime'
           @canplay="ready" @error='error'
           ref='audio' :src="currentSong.url"
    ></audio>
  </div>
</template>

<script>
  import { mapGetters,mapMutations } from 'vuex';
  import * as types from '../../store/mutation-types';
  import ProgressBar from '../../components/progress-bar/progress-bar';
  import { playMode } from '../../common/js/config';
  import Lyric from 'lyric-parser'
  import Scroll from '../../components/scroll/scroll';
  export default {
    data() {
      return {
        // 音量
        volume: 30,
        // 歌曲就绪
        songReady: false,
        // 当前时间
        currentTime: 0,
        // 歌词
        currentLyric: null,
        // 当前歌词行数
        currentLineNum: 0,
        // 当前显示的页面(cd/歌词)
        currentShow: 'cd',
        // cd页一行歌词
        playingLyric: ''
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      // 播放模式的样式
      modeIcon() {
        return this.mode == playMode.sequence ? 'icon-sequence' : this.mode == playMode.loop ? 'icon-loop' : 'icon-random'
      },
      // 播放或暂停元素的样式
      iconPlay() {
        return !this.playing ? 'icon-play' : 'icon-pause'
      },
      // mini播放或暂停元素的样式
      miniIcon() {
        return this.playing ? 'icon-pause-mini': 'icon-play-mini'
      },
      // cd旋转
      cdRotate() {
        return this.playing ? 'play' : 'play pause'
      },
      // 上一曲/下一曲不能点击时,增加一个样式
      disable() {
        return this.songReady ? '' : 'disable'
      },
      // 播放的百分比
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      // Song实例 :{
      //   album: "周杰伦的床边故事",
      //   duration: 215,
      //   id: 107192078,
      //   image: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003RMaRI1iFoYd.jpg?max_age=2592000",
      //   mid: "003OUlho2HcRHC",
      //   name: "告白气球",
      //   singer: "周杰伦",
      //   url: "https://api.bzqll.com/music/tencent/url?key=579621905&id=003OUlho2HcRHC"
      // }
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        // 原始列表
        'sequenceList'
        ])
    },
    methods: {
      touchstart(e) {
        this.touch.init = true//初始化
        let touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      touchmove(e) {
        if(!this.touch.init) return
        let touch = e.touches[0]
        let deltaX = touch.pageX - this.touch.startX
        let deltaY = touch.pageY - this.touch.startY
        if(Math.abs(deltaY)>Math.abs(deltaX)) {
          return
        }
        // 歌词原始的translateX位置
        let left = this.currentShow === 'cd' ? 0 :-innerWidth
        let offsetWidth = Math.min(0,Math.max(-innerWidth,deltaX + left))
        this.touch.percent = Math.abs(offsetWidth / innerWidth)

        // 歌词的位置
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = 0

        // cd的透明度
        this.$refs.cd.style.transitionDuration = 0
        this.$refs.cd.style.opacity = 1 - this.touch.percent
      },
      touchend() {
        let offsetLeft,opacity
        if(this.currentShow === 'cd') {
          if(this.touch.percent > .1) {
            offsetLeft = -innerWidth
            this.currentShow = 'lyric'
            opacity = 0
          }else {
            offsetLeft = 0
            opacity = 1
          }
        }else {
          if(this.touch.percent < .9) {
            offsetLeft = 0
            this.currentShow = 'cd'
            opacity = 1
          }else {
            offsetLeft = -innerWidth
            opacity = 0
          }
        }
        // 歌词的位置
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetLeft}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = `.3s`
        // cd的透明度
        this.$refs.cd.style.transitionDuration = `.3s`
        this.$refs.cd.style.opacity = opacity
        this.touch.init = false
      },
      loop() {
        // 单曲循环时
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if(this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      // 播放完了
      ended() {
        if(this.mode === playMode.loop) {
          this.loop()
        }else {  
          this.next()
        }
      },
      // 改变播放模式
      changeMode() {
        let mode = (this.mode + 1)%3
        this[types.SET_PLAY_MODE](mode)
        let list = [...this.sequenceList]
        if(mode === playMode.random) {
          // 定义列表
          list.sort(()=>Math.random() - .5)
        }
        // 改变索引,保证当前播放歌曲不变
        let index = list.findIndex(e=>e.id===this.currentSong.id)
        this[types.SET_CURRENT_INDEX](index)
        this[types.SET_PLAYLIST](list)
      },
      // 子组件传递的百分比
      percentChange(percent) {
        this.$refs.audio.currentTime = percent * this.currentSong.duration
        if(!this.playing) {
          this.togglePlay()
        }
        if(this.currentLyric) {
          this.currentLyric.seek(percent * this.currentSong.duration * 1000)
        }
      },
      // 播放时执行
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      // 当文件就绪可以开始播放
      ready() {
        this.songReady = true
      },
      // 当在文件加载期间发生错误时运行
      error() {
        this.songReady = true
      },
      // 收起全屏播放器
      back() {
        this[types.SET_FULL_SCREEN](false)
      },
      // 打开全屏
      open() {
        this[types.SET_FULL_SCREEN](true)
      },
      // 播放或暂停
      togglePlay() {
        if(!this.songReady) return
        this[types.SET_PLAYING_STATE](!this.playing)
        if(this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      // 上一曲
      prev() {
        if(!this.songReady) return
        if(this.playlist.length === 1) {
          this.loop()
        }else {
          let index = this.currentIndex - 1
          if(index < 0) {
            index = this.playlist.length - 1
          }
          this[types.SET_CURRENT_INDEX](index)
          if(!this.playing){
            this.togglePlay()
          }
        }
        this.songReady = false
      },
      // 上一曲
      next() {
        if(!this.songReady) return
        if(this.playlist.length === 1) {
          this.loop()
        }else {
          let index = this.currentIndex + 1
          if(index > this.playlist.length - 1) {
            index = 0
          }
          this[types.SET_CURRENT_INDEX](index)
          if(!this.playing){
            this.togglePlay()
          }
        }
        this.songReady = false
      },
      // 获取歌词
      async getLyric() {
        try {
          let lyric = await this.currentSong.getLyric()
          this.currentLyric = new Lyric(lyric, this.handleLyric) 
          if(this.playing && this.songReady) {
            this.currentLyric.play()
          }
          // console.log(this.currentLyric)
        } catch (error) {
          console.log(error)
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        
      },
      // 当歌词行数改变的时候触发
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if(lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        }else {
          this.$refs.lyricList.scrollTo(0,0, 1000)
        }
        this.playingLyric = txt
      },
      // 格式化时间
      format(t) {
        let min = t / 60 | 0
        let sec = t % 60 | 0
        sec = sec < 10 ? '0' + sec : sec
        return min + ':' + sec
      },
      ...mapMutations([
        types.SET_FULL_SCREEN,
        types.SET_PLAYING_STATE,
        types.SET_CURRENT_INDEX,
        types.SET_PLAY_MODE,
        types.SET_PLAYLIST,
        types.SET_CURRENT_INDEX
        ])
    },
    watch: {
      currentSong(newSong,oldSong) {
        // 避免随机播放模式下,暂停播放时继续播放
        if(newSong.id === oldSong.id) return

        // 避免歌词定时器累积,播放之前把之前的歌词停掉
        if(this.currentLyric) {
          this.currentLyric.stop()
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        // 改成定时器可以兼容
        this.$nextTick(()=>{
          this.$refs.audio.play()
          this.$refs.audio.volume = .1
          this.getLyric()
        })
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(()=>{
          newPlaying ? audio.play() : audio.pause()
        })
      },
      volume(newV) {
        this.$refs.audio.volume = newV / 100
      },
    },
    components: {
      ProgressBar,
      Scroll
    }
  }
</script>

<style scoped lang='stylus'>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      // 音量
      .range
        -webkit-appearance: none;
        width: 300px;
        position absolute
        left 50%
        top 9%
        transform translateX(-50%)
        background-color transparent
        &::-webkit-slider-runnable-track
          height: 4px;
          border-radius 5px
          background-color $color-background-d
        &::-webkit-slider-thumb
          -webkit-appearance: none;
          height: 11px;
          width: 11px;
          border-radius: 50%;
          background: $color-theme;
          cursor: pointer;
          transform translateY(-25%)
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        transform translate3d(100%,0,0)
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
        transform translate3d(0,60px,0)
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>