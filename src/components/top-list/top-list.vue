<template>
<!-- 排行榜详情页 -->
  <transition name='slide'>
    <music-list :rank='rank' :songs='songs' :title='title' :bgImage='bgImage'></music-list>
  </transition>
</template>
<script>
import MusicList from "../music-list/music-list"
import { mapGetters } from "vuex"
import { getMusicList } from "../../api/rank.js";
import { ERR_OK } from "../../api/config.js";
import { createSong } from "../../common/js/song.js";
export default {
  data(){
    return{
      songs:[],
      rank:true,
    }
  },
  created(){
    this._getMusicList()
  },
    components:{
        MusicList
    },

    computed:{
      title() {
        return this.toplist.topTitle
      },
      bgImage() { 
        if(this.songs.length) {
          return this.songs[0].image
        }
        return ''
        // return this.topList.picUrl
      },
      ...mapGetters([
        "toplist"
      ])
    },
    methods:{
    async  _getMusicList(){
      if(!this.toplist.id) {
          this.$router.push('/rank')
          return
        }
        let res = await getMusicList(this.toplist.id)
        if(res.code === ERR_OK) {
          this.songs = this._normalizeList(res.songlist)
        }
      },
      _normalizeList(list){
        let ret = [];
         list.map(e=>{
          let {data} = e
          if(data.songid && data.albumid) {
            ret.push(createSong(data))
          }
        })
        return ret
      }
    } 
}
</script>

<style scoped lang='stylus'>
  .slide-enter-active,.slide-leave-active
    transition .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%,0,0)
</style>