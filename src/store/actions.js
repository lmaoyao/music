import * as types from "./mutations-type";
import {playMode} from "../common/js/config"
import {shuffle} from "../common/js/util"
import { saveSearch,deleteSearch,clearSearch } from "../common/js/cache";

//查找列表中有没有这种歌
/* function findIndex(list,song) {
  return list.findIndex((item)=>{
      return item.id === song.id
  })
} */
//提交mutations
export const selectPlay = function({ commit,state}, { list, index }) {
  //选择播放
  commit(types.SET_SEQUENCE_LIST, list); //顺序bofang
  if(state.mode === playMode.random){//如果是随机播放
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList); //歌曲列表
    // index = findIndex(randomList,list[index])
    index = randomList.findIndex(e=>e.id===list[index].id)
  }else{
    commit(types.SET_PLAYLIST, list); //播放列表就是顺序歌曲列表
  }
  commit(types.SET_CURRENT_INDEX, index); //当前播放的索引
  commit(types.SET_FULL_SCREEN, true); //全屏
  commit(types.SET_PLAYING_STATE, true);
};

//当点击歌曲列表的随机播放按钮时
export const randomPlay = function ({commit},{list}) {
  commit(types.SET_PLAY_MODE,playMode.random)
  commit(types.SET_SEQUENCE_LIST, list); //歌曲列表
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList); //歌曲列表
  commit(types.SET_CURRENT_INDEX, 0); //当前播放的索引
  commit(types.SET_FULL_SCREEN, true); //全屏
  commit(types.SET_PLAYING_STATE, true);
}
/* export const insertSong = function ({commit,state},song) {//song是插入进来的歌曲
  let palylist = state.palylist;
  let sequenceList = state.sequenceList;
  let currentIndex = state.currentIndex;
  //先记录当前歌曲;
  let currentSong = palylist[currentIndex];
  //查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(palylist,song)
  //因为是插入歌曲 所以要加一
  currentIndex++;
  //插入这首歌到当前的位置
  palylist.splice(currentIndex,0,song)
  //如果包含了这首歌
  if (currentIndex>-1) {
    //如果当前插曲的序号大于列表的序号
    if (currentIndex>fpIndex) {
      palylist.splice(fpIndex,1)
      currentIndex --;
    }else{
      palylist.splice(fpIndex+1,1)
    }
  }
  let currentSIndex = findIndex(sequenceList,currentSong)+1;
  let fsIndex = findIndex(sequenceList,song)
  sequenceList.splice(currentSIndex,0,song)
  if (fsIndex > -1) {
    sequenceList.splice(fsIndex,1)
  }else{
    sequenceList.splice(fsIndex+1,1)
  }
  commit(types.SET_PLAYLIST,palylist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
} */
// 插入播放
export const insertSong = ({commit, state}, song) => {
  let playlist = [...state.playlist];//播放列表
  let sequenceList = [...state.sequenceList]//顺序列表
  let currentIndex = state.currentIndex//当前播放的索引
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = playlist.findIndex(e=>e.id===song.id)
  // 因为是插入歌曲,所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这个歌
  if(fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if(currentIndex > fpIndex) {
      playlist.splice(fpIndex,1)
      currentIndex--
    }else {
      playlist.splice(fpIndex + 1,1)
    }
  }
  let currentSIndex = sequenceList.findIndex(e=>e.id===currentSong.id) + 1
  let fsIndex = sequenceList.findIndex(e=>e.id===song.id)
  sequenceList.splice(currentSIndex, 0, song) 
  if(fsIndex > -1) {
    if(currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    }else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}
// 保存历史到本地中
export const saveSearchHistory = ({commit, state}, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
};
// 删除一个历史纪录
export const deleteSearchHistory = ({commit, state}, query)=> {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
// 删除全部历史记录
export const clearSearchHistory = ({commit})=>{
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}
export const deleteSong = function ({commit,state},song) {
  let playlist = [...state.playlist];//播放列表
  let sequenceList = [...state.sequenceList]//顺序列表
  let currentIndex = state.currentIndex//当前播放的索引
  let pIndex = playlist.findIndex(e=>e.id===song.id);//在当前播放列表中查找这首歌
  playlist.splice(pIndex,1)
  let sIndex = sequenceList.findIndex(e=>e.id===song.id);//在顺序列表中查找这首这
  sequenceList.splice(sIndex,1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  } 
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false) 
  }
}
