//设置style兼容性
let elementStyle = document.createElement("div").style;
let vendor = (() => {
  let transfromNames = {
    webkit: "webkitTransfrom",
    Moz: "MozTransfrom",
    O: "OTransfrom",
    ms: "msTransfrom",
    standard: "transform"
  };
  for (let key in transfromNames) {
    if (elementStyle[transfromNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();
export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }
  if (vendor === "standard") {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
