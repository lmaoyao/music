<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "../../api/singer.js";
import { ERR_OK } from "../../api/config.js";
import { createSong } from "../../common/js/song.js";
import MusicList from "../music-list/music-list";
export default {
  data() {
    return {
      songs: []
    };
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters([
      "singer" //getter.js中的singer函数
    ]),
    title() {
      //获取的是歌手的名字
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    }
  },
  created() {
    // console.log(this.singer);
    this._getSingerDetail();
  },
  methods: {
    async _getSingerDetail() {
      if (!this.singer.id) {
        //当获取不到这个ID的时候
        this.$router.push("/singer");
        return;
      }
      let res = await getSingerDetail(this.singer.id);
      if (res.code === ERR_OK) {
        // console.log(res.data.list)
        this.songs = this._normalizeSongs(res.data.list);
        // console.log(this.songs);
      }
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
