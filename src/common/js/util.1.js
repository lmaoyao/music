export const shuffle = (arr) => {
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
}

