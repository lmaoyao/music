import { playMode } from "../common/js/config";
import { loadSearch } from '../common/js/cache'
const state = {
  singer: {}, //歌手
  playing: false, //播放器 暂停false 播放 true
  fullScreen: false, //全屏
  playlist: [], //播放列表
  sequenceList: [], //顺序列表
  mode: playMode.sequence,
  currentIndex: -1 ,//当前播放的索引
  disc : {},//recommend歌单
  // rank排行榜歌单
  toplist: {},
  // 搜索历史，
  searchHistory:loadSearch(),

};

export default state;
