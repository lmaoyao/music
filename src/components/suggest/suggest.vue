<template>
<!-- 搜索框列表 -->
<!--pullup 是否实现上拉刷新   scrollToEnd 滚动到底部的时候  -->
  <scroll class='suggest' 
    :data='result' 
    :pullup="pullup" 
    @scrollToEnd="searchMore"
    reg="scroll"
    :beforeScroll='beforeScroll'
    @beforeScroll='listScroll'

    >
    <ul class="suggest-list">
      <!-- 搜索列表 -->
      <li @click='selectItem(e)' class="suggest-item" v-for="(e,i) in result" :key='i'>
        <div class="icon">
          <i class="icon-music"></i>
          <!-- <i :class="getIconClass(e)"></i> -->
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(e)"></p>
        </div>
      </li>
      <loading  title="" v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title='抱歉，暂无搜索结果'></no-result>
    </div>
  </scroll>
</template>
<script>
import { search} from "../../api/serach.js";
import scroll from "../../base/scroll/22";
import loading from "../../base/loading/loading"
import { createDiscSong } from "../../common/js/song.js";
import Singer from "../../common/js/singer.js"
import { mapMutations, mapActions } from 'vuex';
import noResult from "../../base/no-result/no-result"
const TYPE_SINGER = "singer"
 // 每页搜索多少条数据
  const limit = 20
export default {
    data(){
        return{
        // 第几页
        page: 1,
        // 搜索的数据
        result: [],
        // 上拉刷新
        pullup: true,
        // 是否有更多
        hasMore: true,
        beforeScroll:true,
        }
    },
    components:{
        scroll,
        loading,
        noResult
    },
    props:{
        query:{
            type:String,
            default:"",
        },
        showSinger:{
            type:Boolean,
            default:true,
        }
    },
    watch:{
         // 搜索变化执行search方法
      query(newValue, oldValue) {
        if(!newValue) return
        this.search()
      }
    },
    methods:{
    async search() {
        this.hasMore = true
        this.page = 1;//获取数据的时候让其从第一页开始展示
        let res = await search(this.query, this.page, limit)//page显示的第几页  limit要不要显示歌曲
        if(res.code === 200) {
          this.result = this._normalizeSongs(res.data)//数据
          this._checkMore(res.data)
        }
      },
         // 请求的结果序列化
      _normalizeSongs(list) {
        let ret = []
        list.map(e=>{
          ret.push(createDiscSong(e))
        })
        return ret
      },
       getDisplayName(e) {
        return `${e.name}-${e.singer}`
      },
      //实现上拉刷新
     async searchMore(){
          if (!this.hasMore) {
              return
          }
          this.page++;
          //重新加载数据
         let res = await search(this.query,this.page,limit)
         if(res.code === 200) {
          this.result = [...this.result, ...this._normalizeSongs(res.data)]
          // console.log(this.result)
          this._checkMore(res.data)
        }
      },
      _checkMore(data){
          const song = data.song;
          /* if (!song.list.length || (song.curnum+song.curpage*20)>song.totalnum) {
            this.hasMore = false;
          } */
          if (data.length>limit) {
              this.hasMore = false
             
          }
      },
      listScroll(){
        this.$emit("listScroll")
      },
      selectItem(item){
         /*  if (item.type === TYPE_SINGER) {
              const singer = new Singer({
                  id:item.singermid,
                  name:item.singername
              })
              this.$router.push({
                  path:`/search/${singer.id}`
              })
              this.setSinger(singer)
          } */
      // selectItem 点击列表
           this.insertSong(item);
           this.$emit("select")
      },
      ...mapMutations({
          setSinger : "SET_SINGER"
      }),
      ...mapActions([
           "insertSong"
      ])
    }
}
</script>

<style scoped lang='stylus'>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>