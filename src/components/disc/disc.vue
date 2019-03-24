<template>
<transition name='slide'>
   <music-list :title='title' :bgImage='bgImage' :songs="songs"></music-list>
</transition>   
</template>
<script>
import MusicList from "../music-list/music-list";
import {mapGetters} from "vuex"
import { getSongList } from "../../api/recommend.js";
import { createDiscSong } from "../../common/js/song.js"
export default {
  data(){
    return{
      songs:[],
    }
  },
  components:{
    MusicList,
  },
  created(){
    this._getSongList()
  },
  computed:{
       title() {
        return this.disc.name
      },
      bgImage() {
        return this.disc.pic
      },
      
      ...mapGetters([
        "disc"
      ])
    },
    methods:{
     async _getSongList() {
        if(!this.disc.id) {
          this.$router.push('/recommend')
          return 
        }
        let res = await getSongList(this.disc.id)
        console.log(res)
        this.songs = this._normalizeSongs(res.data.songs)
        // console.log(this.songs)
      },
      _normalizeSongs(list){
        let ret = []
        list.map(e=>{
          ret.push(createDiscSong(e))
        })
        return ret
      },
    }
}
</script>
<style scoped lang='stylus'>
   .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>