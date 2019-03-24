import { getLyric } from "../../api/song";
// 定义一个歌曲的属性
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
  //获取歌手详情页数据
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }
    return new Promise(async (resolve, reject) => {
      let res = await getLyric(this.mid);
      this.lyric = res;
      resolve(this.lyric);
    });
  }
}
export const createSong = musicData => {
  // Song实例 :{
  //   album: "周杰伦的床边故事",
  //   duration: 215,
  //   id: 107192078,
  //   image: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003RMaRI1iFoYd.jpg?max_age=2592000",
  //   mid: "003OUlho2HcRHC",
  //   name: "告白气球",
  //   singer: "周杰伦",
  //   url: "https://api.bzqll.com/music/tencent/url?key=579621905&id=003OUlho2HcRHC"
  // }
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval, //时间
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
    }.jpg?max_age=2592000`,
    url: `https://api.bzqll.com/music/tencent/url?key=579621905&id=${
      musicData.songmid
    }`
    // https://api.bzqll.com/music/tencent/url?key=579621905&id=003OUlho2HcRHC&br=320
  });
};
export const createDiscSong = item => {
  return new Song({
    album: item.name,
    duration: item.time,
    id: item.id,
    image: item.pic,
    mid: item.id,
    name: item.name,
    singer: item.singer,
    url: item.url
  });
};

export function filterSinger(singer) {
  let ret = [];
  if (!singer) return "";
  singer.map(s => {
    ret.push(s.name);
  });
  return ret.join("/");
}
