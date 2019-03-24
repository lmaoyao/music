/* export function shuffle(arr){//洗盘函数  把列表打乱
  return [...arr].sort(()=>Math.random()-.5)
};
export const debounce = (fun, delay)=> {
  let timer
  return function (...args) {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun.apply(this, args)      
    }, delay);
  }
} */
/* function getRandomInt(max,min) {
  return Math.floor(Math.random()*(max - min + 1)+min)
} */
/* export function shuffle(arr){
let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0,i)  
    let t= _arr[i]
    _arr[i] = _arr[j];
    _arr[j] = t
  }
  return _arr
} */
export const shuffle = (arr) => {
  return [...arr].sort(()=>Math.random()-.5)
};
//函数的节流
export const debounce = (fun, delay)=> {
  let timer
  return function (...args) {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun.apply(this, args)      
    }, delay);
  }
}