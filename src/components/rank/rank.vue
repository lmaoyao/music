<template>
<!-- 排行榜页面 -->
<div class="rank" ref='rank'>
    <scroll :data='topList' class="toplist" ref='scroll'>
      <ul>
        <li class="item" v-for="(e,i) in topList" :key='i' @click='selectItem(e)'>
          <div class="icon">
            <img v-lazy="e.picUrl" width="100" height="100" alt="">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(item,j) in e.songList" :key='j'> 
              <span>{{j+1}}</span>
              <span>{{item.songname}}-{{item.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show='!topList.length'>
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {  getTopList} from "../../api/rank.js";
import { ERR_OK } from "../../api/config.js";
import scroll from "../../base/scroll/22"
import loading from "../../base/loading/loading"
import { playlistMixin} from "../../common/js/mixin.js"
import { mapMutations } from "vuex";
    export default {
        mixins:[playlistMixin],
        name: "rank",
        components:{
            scroll,
            loading,
        },
        data(){
            return{
                topList:[]
            }
        },
        created(){
            this._getTopList()
        },
        methods:{
           // 获取列表
      async _getTopList() {
        let res = await getTopList()
        // console.log(res)
        if(res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      },
       selectItem(item){
        //  console.log(item);
          this.$router.push({
          path:`/rank/${item.id}`
        })
          this.setTopList(item)
      },
     handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.rank.style.bottom = bottom
        this.$refs.scroll.refresh()
        // this.$refs.top
      },
      ...mapMutations({
          setTopList:'SET_TOP_LIST'
      })
        }
    }
</script>

<style scoped lang='stylus'>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>