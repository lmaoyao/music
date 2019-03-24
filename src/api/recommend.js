import jsonp from "../common/js/jsonp"
import {commonParams,options} from "./config"
import axios from "./index"
//获取轮播图的数据
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
//获取歌单的数据
export const getDiscList = () => {
  return axios.get('https://api.bzqll.com/music/tencent/hotSongList?key=579621905&categoryId=10000000&sortId=3&limit=60')
};

export function getSongList(id) {
  return axios.get('https://api.bzqll.com/music/tencent/songList',{
    params: {
      id,
      key:579621905
    }
  })
}
