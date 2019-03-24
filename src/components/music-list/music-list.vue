<template>
  <!-- 音乐详情组件,包含100个歌手的歌曲 -->
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- layer层,控制滚动  遮罩层-->
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      class="list"
      ref="list"
      :probeType="probeType"
      :listenScroll="listenScroll"
      @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <!-- 歌曲列表 -->
        <songlist :songs="songs" @select="selectItem" :rank="rank"></songlist>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import scroll from "../../base/scroll/22";
import songlist from "../../base/song-list/song-list";
import { prefixStyle } from "../../common/js/dom.js";
import loading from "../../base/loading/loading";
import { mapActions } from "vuex";
import { playlistMixin } from "../../common/js/mixin.js";
//设置style的兼容问题
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-tilter");
const RESERVED_HEIGHT = 40; //预留的到顶端的距离

export default {
  mixins:[playlistMixin],
  data() {
    return {
      scrollY: 0
    };
  },
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {//歌手的歌曲列表
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    rank:{
      type:Boolean,
      default:false,
    }
  },
 
  
  //更改scroll组件的数据
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    //图片背景的高度
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  components: {
    scroll,
    songlist,
    loading
  },
  computed: {
    bgStyle() {
      //获取的头像
      return `background-image:url(${this.bgImage})`;
    }
  },
  methods: {
    handlePlaylist(playlist){
      const bottom = playlist.length>0?"60px":"";
      this.$refs.list.$el.style.bottom=bottom;
      this.$refs.list.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
      //   this.$router.go(-1);
    },
    selectItem(item, index) {//item 代表这首歌
      this.selectPlay({
        list: this.songs,//歌手的所有的歌单
        index,//每首歌的索引
      });
    },
    random(){
      this.randomPlay({
        list:this.songs
      })
    },
    ...mapActions(["selectPlay","randomPlay"])
  },
  watch: {
    scrollY(newY) {
      //newY获取的新的高度
      let tranlateY = Math.max(this.minTranslateY, newY); //最大的滚动量
      let zIndex = 0;
      let scale = 1;
      let blur = 0; //设置模糊的参数
      this.$refs.layer.style[transform] = `translate3d(0,${tranlateY}px,0)`;
      this.$refs.layer.style[
        "webkitTransform"
      ] = `translate3d(0,${tranlateY}px,0)`;
      const percent = Math.abs(newY / this.imageHeight); //比例
      if (newY > 0) {
        //当往下拉的时候
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20 * percent, 20);
      }
      //设置图片模糊的样式
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
      //   this.$refs.filter.style["webkitBackdrop-filter"] = `blur(${blur}px)`;
      if (newY < this.minTranslateY) {
        //当滚动到顶部的时候
        zIndex = 10;
        //设置图片的样式
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = `70%`;
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "block";
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      //   this.$refs.bgImage.style["webkitTransform"] = `scale(${scale})`;
    }
  }
};
</script>
<style scoped lang='stylus'>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    color: $color-text;
    font-size: $font-size-large;
    line-height: 40px;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0px;
        margin: 0 auto;
        text-align: center;
        border-radius: 100px;
        border: 1px solid $color-theme;
        font-size: 0;
        color: $color-theme;

        .icon-play {
          display: inline-block;
          margin-right: 6px;
          font-size: $font-size-medium-x;
          vertical-align: middle;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-medium;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background-color: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    // overflow hidden
    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }
  }
}
</style>