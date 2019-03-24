import * as types from "./mutations-type";

const matutaions = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list;
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequencelist = list;
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode;
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },
  [types.SET_DISC](state,obj){
    state.disc = obj
  },
  [types.SET_TOP_LIST](state,toplist){
    state.toplist = toplist
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  }
};
export default matutaions;
