<template>
  <!-- 播放器组件,在任何路由都可以播放,要放在app.vue -->
  <div class="player" v-show="playlist.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <!-- 全屏播放器 -->
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景 -->
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%" alt>
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>

        <!-- 中间 -->
        <div
          class="middle"
          @touchstart.prevent="touchstart"
          @touchmove.prevent="touchmove"
          @touchend.prevent="touchend"
        >
          <!-- cd -->
       <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdRotate">
                <img :src="currentSong.image" alt class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>

          <!-- 歌词 -->
          <scroll :data='currentLyric &&currentLyric.lines' class="middle-r" ref='lyricList'>
            <div class="lyric-wrapper">
              <div v-if='currentLyric'>
                <p :class='{"current":i===currentLineNum}' class="text" ref="lyricLine" :key='i' v-for="(line,i) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>

        <!-- 音量 -->
       <!--  <input type="range" class="range" ref="range" max="100" min="0" v-model="volume"> -->

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
              <progress-bar @percentChange="percentChange" :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>

          <div class="operators">
            <!-- 播放模式 -->
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <!-- 上一曲 -->
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <!-- 暂停/播放 -->
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <!-- 下一曲 -->
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <!-- 喜欢 -->
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <!-- mini播放器 -->
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdRotate" width="40" height="40" :src="currentSong.image" alt>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.signer"></p>
        </div>
        <!-- 播放按钮 -->
        <div class="control">
          <!-- radius  是传给组件的半径 -->
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlay" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-lists ref="playlists"></play-lists>
    <!-- audio -->
    <audio
      @ended="ended"
      @timeupdate="updateTime"
      @canplay="ready"
      @error="error"
      ref="audio"
      :src="currentSong.url"
    ></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "../../common/js/dom.js";
const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration")
import ProgressBar from "../../base/progress-bar/progress-bar"; //进度条组件
import ProgressCircle from "../../base/progress-circle/progress-circle";//圆圈
import {playMode} from "../../common/js/config.js"
import { shuffle } from "../../common/js/util.js";
import Lyric from 'lyric-parser'//用来处理歌词的
import scroll from "../../base/scroll/22";
import playLists from "../../components/playlist/playlist"

export default {
  data() {
    return {
      songReady: false, //歌曲就绪
      currentTime: 0, //当前时间
      radius:32,
      currentLyric:null,//歌词
      currentLineNum:0,//当前歌词所在的行
      currentShow:'cd',
      playingLyric:null,//cd下面的歌词

    };
  },
  components:{
    ProgressBar,
    ProgressCircle,
    scroll,
    playLists,
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
      
    ]),
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    //图片旋转
    cdRotate() {
      return this.playing ? "play" : "play pause";
    },
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    percent() {
      //歌曲播放的比例
      return this.currentTime / this.currentSong.duration; //当前播放的时间/歌曲的总时长
    }, 
    //播放模式
    modeIcon() {
        return this.mode == playMode.sequence ? 'icon-sequence':this.mode == playMode.loop ? 'icon-loop' : 'icon-random'
      },
  },
  created(){
    this.touch = {};
  },
  methods: {
    //播放列表的实现
    showPlaylist(){
      this.$refs.playlists.showFlag = true
    },
    //缩小屏幕
    back() {
      this.setFullScreen(false);
    },
    //放大播放器
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper,"move",done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend",done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    updateTime(e){//audio  当前播放的时间
     //e.target.currentTime  表示当前播放的时间
      this.currentTime = e.target.currentTime
    },
    _getPosAndScale() {
      const targetWridth = 40; //mini图片的宽度
      const paddingLeft = 40; //偏移量
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWridth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    //音乐暂停 
    togglePlay() {//先获取音乐播放的状态  然后点用mutations更改
      // this.setPlayingState(!this.playing);
       if(!this.songReady) return
        this.setPlayingState(!this.playing)
        if(this.currentLyric) {
          this.currentLyric.togglePlay()
        }
    },
    next() {
      if (!this.songReady) {
        //当处于songReady的时候才可以被点击，否则不能点击
        return;
      }
      if (this.playlist.length === 1) {//当只有一首歌的时候
        this.loop();
      }else{
      let index = this.currentIndex + 1; //下一首歌曲  currentIndex
      if (index === this.playlist.length) {
        //当到达最后一首歌曲的时候
        index = 0; //回到第一首歌
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        //当处于暂停的时候切换下一首歌曲
        this.togglePlay(); //让歌曲继续播放
      }
      }
      this.songReady = false;
    },
    prev() {
      if (!this.songReady) {
        //
        return;
      }
      if (this.playlist.length === 1) {//当只有一首歌的时候
        this.loop();
      }else{
      let index = this.currentIndex - 1; //上一首歌曲
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        //当处于暂停的时候切换下一首歌曲
        this.togglePlay(); //让歌曲继续播放
      }
      }
      this.songReady = false;
    },

    ready() {
      this.songReady = true;
    },
    error() {
      //当下一首歌曲地址发生错误不存在或者网络链接错误的时候
      this.songReady = true;
    },
    //处理播放时间的时间戳
     format(t) {
        let min = t / 60 | 0
        let sec = t % 60 | 0
        sec = sec < 10 ? '0' + sec : sec
        return min + ':' + sec
      },
       // 播放完了
      ended() {
        if(this.mode === playMode.loop) {//当是单独播放的时候
          this.loop()
        }else {  
          this.next()
        }
      },
      loop(){
        this.$refs.audio.currentTime=0;//回到歌曲开始的位置
        this.$refs.audio.play()//开始播放
        if (this.currentLyric) {
          this.currentLyric.seek()
        }
        },
      //播放列表的模式
    changeMode(){
      let mode = (this.mode + 1)%3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {//当处于随机播放的时候
       list.sort(()=>Math.random() - .5)
      // list = shuffle(this.sequenceList)//随机模式
      }
      this.setPlaylist(list)//更改state的数据 切换列表 
      this.resetCurrentIndex(list)
    },
    resetCurrentIndex(list){//当前歌曲的索引
      let index = list.findIndex((item)=>{// es6语法 可以拿到每个list的元素
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)//播放的索引
    },
    //时间的补位 补0
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    percentChange(percent) {//拖块移动的比例和时间的切换
      const currentTime = this.currentSong.duration * percent;
      this.$refs.audio.currentTime = currentTime //当滑块放下时，时间跟着滑块变化   当前播放的时间=当前歌曲总共的时间*百分比
      if (!this.playing) {
        //当不在播放状态的时候
        this.togglePlay(); 
      }
      if (this.currentLyric) {//设置歌词跟着时间的移动高亮
        this.currentLyric.seek(currentTime*1000)
      }
    },
    // 获取歌词
      async getLyric() {
        try {
          let lyric = await this.currentSong.getLyric()//获取的全部歌词
          // console.log(lyric);
          this.currentLyric = new Lyric(lyric, this.handleLyric) 
          if(this.playing && this.songReady) {
            this.currentLyric.play()
          }
          // console.log(this.currentLyric)
        } catch (error) {//当获取不到歌词的时候
          this.currentLyric = null
          this.playingLyric = ''  //cd下面的歌词
          this.currentLineNum = 0 //高亮的歌词
        }  
      },
      /* 
      $lyricLine   是歌词内容的p标签
      $lyricList 是scroll标签
      div  currentLyric
    视频
      lyricList 是scroll
      p上面的div currentLyric
      p lyricLine
      */
            // 当歌词行数改变的时候触发
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum        
        if(lineNum > 5) {//当小于5行的时候不需要滚动的效果
          let lineEl = this.$refs.lyricLine[lineNum - 5]//滚动的当前元素
          this.$refs.lyricList.scrollToElement(lineEl,1000)//滚动到p标签 
        }else {
          this.$refs.lyricList.scrollTo(0,0,1000)
        }
        this.playingLyric = txt
      },
      //cd切换歌词
      touchstart(e){
        this.touch.initiated = true;
        const touch = e.touches[0];
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      touchmove(e){
        if (!this.touch.initiated) {
          return
        }
         const touch = e.touches[0];//获取的属性
         const deltaX = touch.pageX - this.touch.startX;
         const deltaY = touch.pageY - this.touch.startY;
         if (Math.abs(deltaY)>Math.abs(deltaX)) {//纵轴方向偏移的一个距离大于横轴方向偏移的距离  是个纵向滚动
          return
        }
        const left = this.currentShow==="cd" ? 0 :-window.innerWidth
        const offsetwidth = Math.min(0,Math.max(-window.innerWidth,left+deltaX)) //列表向左滚动的一个宽度 
        this.touch.percent = Math.abs(offsetwidth/window.innerWidth);
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px,0,0)`
          this.$refs.lyricList.$el.style[transitionDuration] = 0
          this.$refs.middleL.style.opacity = 1 -this.touch.percent;
          this.$refs.middleL.style[transitionDuration] = 0


      },
      touchend(){//参照污物超过10%
        let offsetwidth
        let opacity
        if (this.currentShow === "cd") {//相当于从右向左滑动
          if (this.touch.percent>0.1) {//切换到歌词页面的时候
            offsetwidth = -window.innerWidth;//最终停的位置
            this.currentShow = "lyric"//歌词页面
            opacity =0;//更改cd 的透明度
          }else{//cd页面
            offsetwidth = 0;
            opacity = 1;
          }
        }else{
          if (this.touch.percent<0.8) {
            offsetwidth = 0;
            this.currentShow = "cd";
            opacity = 1
          }else{
            offsetwidth = -window.innerWidth
            opacity = 0
          }
        }
        const time =300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity;
          this.$refs.middleL.style[transitionDuration] = `${time}ms`
      },
      
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode:"SET_PLAY_MODE",
      setPlaylist:"SET_PLAYLIST",//播放模式
    })
  },
  watch: {
    currentSong(newSong,oldSong) {
      if (newSong.id === oldSong.id) {//当id不变的时候，什么也不做
        return
         // 避免歌词定时器累积,播放之前把之前的歌词停掉
        if(this.currentLyric) {
          this.currentLyric.stop()
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
      }
      //播放音乐
      setTimeout(() => {
        this.$refs.audio.play();
        this.getLyric();
      },1000);
    },
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  }
};
</script>

<style scoped lang='stylus'>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    // 音量
    .range {
      -webkit-appearance: none;
      width: 300px;
      position: absolute;
      left: 50%;
      top: 9%;
      transform: translateX(-50%);
      background-color: transparent;

      &::-webkit-slider-runnable-track {
        height: 4px;
        border-radius: 5px;
        background-color: $color-background-d;
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 11px;
        width: 11px;
        border-radius: 50%;
        background: $color-theme;
        cursor: pointer;
        transform: translateY(-25%);
      }
    }

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
           color:#d93f30;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;
      transform: translate3d(100%, 0, 0);

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
      transform: translate3d(0, 60px, 0);
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top:1px;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>