import jsonp from "../common/js/jsonp"
import {commonParams,options} from "./config"
import axios from './index'
// 热门关键词
export const getHotKey = ()=>{
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  
    const data = Object.assign({}, commonParams, {
      uin: 0,
      needNewCode: 1,
      platform: 'h5'
    })
  
    return jsonp(url, data, options)
  }
  // 搜索歌曲
export function search(query, page, limit) {
    return axios.get('https://api.bzqll.com/music/tencent/search?key=579621905&type=song', {
      params: {
        s:query,
        limit,
        offset: page
      }
    })
  }