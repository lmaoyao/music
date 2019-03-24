/* import { commonParams} from "./config";
import axios from "axios"
export function getLyric(mid) {
    const url = '/api/lyric';
    const data = Object.assign({},commonParams,{
        songmid:mid,
        pcachetime:+new Data(),//当前的时间戳
        platfrom:'yqq',
        hostUin:0,
        needNewCode:0,
        g_tk:67232076,
        format:'json'
    })
    return axios.get("https://api.bzqll.com/music/tencent/lrc",{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
} */
import axios from "./index";
//获取歌手详情页
export const getLyric = id => {
  return axios.get("https://api.bzqll.com/music/tencent/lrc", {
    params: {
      id,
      key: 579621905
    }
  });
};
