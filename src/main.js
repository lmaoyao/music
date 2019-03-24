import "babel-polyfill";
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";

/*决绝点击延迟的*/
import fastclick from "fastclick";
/*公共样式*/
import "common/stylus/index.styl";
/*swiper样式*/
import "swiper/dist/css/swiper.min.css";
//图片懒加载
import VueLazyLoad from "vue-lazyload";
// Vue.config.productionTip = false;
fastclick.attach(document.body);
Vue.use(VueLazyLoad, {
  loading: require("./common/image/default.png")
});

new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
