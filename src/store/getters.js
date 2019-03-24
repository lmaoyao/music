export const singer = state => state.singer;
export const playing = state => state.playing;
export const fullScreen = state => state.fullScreen;
export const playlist = state => state.playlist;
export const sequenceList = state => state.sequenceList;
export const currentIndex = state => state.currentIndex;
export const mode = state => state.mode;
export const currentSong = state => {
  return state.playlist[state.currentIndex] || {};
};
export const disc = state => state.disc;
// rank排行榜
export const toplist = state => state.toplist
// 搜索历史
export const searchHistory = state => state.searchHistory
