<template>
<div class="search">
  <!-- 搜索框 -->
  <div class="search-box-weapper">
  <search-box ref="searchBox" @query='onQueryChange'></search-box>
  </div>
   <!-- 热门搜索 -->
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show='!query'>
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="(e,i) in hotKey" :key='i' @click='addQuery(e.k)'>
              {{e.k}}
            </li> 
          </ul>
        </div>
        <!-- 搜索历史 -->
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click='clearSearchHistory'>
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list @select='addQuery' :searches="searchHistory" @delete='deleteSearchHistory'></search-list>
        </div>
      </div>
    </div>
     <!-- 搜索结果 -->
    <div  ref="searchResult" class="search-result" v-show="query">
      <suggest :query='query' @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <router-view></router-view>
</div>
</template>

<script>
import SearchBox from "../../base/search-box/search-box";
import { getHotKey } from "../../api/serach.js";
import { ERR_OK } from "../../api/config.js";
import Suggest from "../../components/suggest/suggest"
import { mapActions ,mapGetters} from "vuex";
import SearchList from "./search-list/search-list"
import {playlistMixin} from "../../common/js/mixin.js"
    export default {
      mixins:["playlistMixin"],
        name: "search",
        data(){
          return{
            hotKey:[],
            query:'',
          }
        },
        components:{
          SearchBox,
          Suggest,
          SearchList,
        },
        computed:{
          ...mapGetters([
            "searchHistory"
          ])
        },
        created(){
          this._getHotKey()
        },
        methods:{
          //获取数据
           async _getHotKey() {
        let res = await getHotKey()
        if(res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0,10)//截取前十个数据
          // console.log(this.hotKey)
        }
      },
      onQueryChange(query){
        this.query = query
      },
      //点击关键词  searchBox组件
      addQuery(query){
        this.$refs.searchBox.setQuery(query)
      },
      blurInput(){
        this.$refs.searchBox.blur()
      },
      //保存搜索结果
      saveSearch(){
        this.saveSearchHistory(this.query)
      },
      handlePlaylist(playlist){
        const bottom = playlist.length>0?"60px":""
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.searchResult.style.bottom = bottom
        
        
      },
      ...mapActions([
        "saveSearchHistory",
        "deleteSearchHistory",
        "clearSearchHistory"
      ])
        },
        watch:{
          quert(){
            this.search()
          }
        }
        
    }
</script>

<style scoped lang='stylus'>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
