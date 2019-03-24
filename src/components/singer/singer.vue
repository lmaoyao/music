<template>
  <div class="singer" ref="singer">
    <list-view :data="singer
" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "../../api/singer";
import { ERR_OK } from "../../api/config";
import Singer from "../../common/js/singer";
import ListView from "../../base/listview/listview";
import { mapMutations } from "vuex";
import { playlistMixin } from "../../common/js/mixin.js";

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;

export default {
  mixins:[playlistMixin],
  name: "singer",
  data() {
    return {
      singer: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
     // mixin里面的方法
    handlePlaylist(playlist){
      const bottom = playlist.length> 0 ? "60px" :" ";
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    //二级路由跳转
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}` //id获取的是
      });
      //提交mutations
      this.setSinger(singer);
    },
    async _getSingerList() {
      let res = await getSingerList();
      if (res.code === ERR_OK) {
        this.singer = this._normalizeSinger(res.data.list);
        // console.log(res.data.list);
      }
    },
    // 将res.data.list包装成需要的数据结构
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });
      //为了得到有序列表 我们需要处理 map
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    //提交mutations
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  components: {
    ListView
  }
};
</script>

<style scoped lang="stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
