import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from '@/router'
//三级联动组件----全局组件
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'

//第一个参数：全局组件名字， 第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)
//引入仓库Vuex
import store from './store'
//引入mock
import '@/mock/mocjServe'
//引入swiper
import "swiper/css/swiper.css"
//引入API文件的全部接口可以在全局组件中直接使用，无需{}引入
import * as API from '@/api/index'
//引入ui组件库
import { Button, MessageBox } from 'element-ui'
Vue.component(Button.name, Button)
//饿了吗Ui注册组件还有一种方法就是挂在原型上
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert

//引入懒加载插件
import VueLazyload from 'vue-lazyload'
import myGif from '@/assets/1.gif'
Vue.use(VueLazyload, {
  //懒加载默认图片
  loading:myGif
})

//引入自定义插件
import myPlugins from '@/plugins/myPlugins.js'
Vue.use(myPlugins, {
  name:'upper'
})

//引入表单校验插件
import '@/plugins/validate'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  //注册仓库
  store,
  //注册全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this;
      Vue.prototype.$API = API 
  }
}).$mount('#app')
