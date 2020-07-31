import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

import {
  NavBar,
  Form,
  field,
  Button,
  Swipe, 
  SwipeItem,
  Search,
  Tabbar,
  TabbarItem,
  Grid,
  GridItem,
  Toast,
  Sticky,
  Col,
  Row,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Stepper,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List, 
  AddressEdit,
  AddressList,
  Popup,
  Tabs,
  Tab,
  Icon,
  Cell,
  Uploader,
  CellGroup
  
} from 'vant'

import 'lib-flexible'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(VueAxios, axios)
//配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
//配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'
//添加appkey属性保存appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';
//发起请求之前处理
axios.interceptors.request.use(config => {
  if(config.method == 'post'){
    let paramsString = '';
    for(let key in config.data){
      paramsString += key + '=' + config.data[key] + '&'
    }
    config.data = paramsString.slice(0,-1);
  }
  return config;
})



Vue
  .use(NavBar)
  .use(Form)
  .use(field)
  .use(Button)
  .use(Swipe)
  .use(SwipeItem)
  .use(Search)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Grid)
  .use(GridItem)
  .use(Toast)
  .use(Sticky)
  .use(Col)
  .use(Row)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Stepper)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Popup)
  .use(Tabs)
  .use(Tab)
  .use(Icon)
  .use(Cell)
  .use(Uploader)
  .use(CellGroup)

Vue.config.productionTip = false

//全局过滤器
Vue.filter('dateRule',(value,format) => {
  let current = new Date(value);

  //获取年份
  let year = current.getFullYear();
  if(/(y+)/.test(format)){
    let yearInfo = RegExp.$1;
    format = format.replace(yearInfo,year);
  }

  //日月时分秒
  let dateObj = {
    M:current.getMonth()+1,
    d:current.getDate(),
    h:current.getHours(),
    m:current.getMinutes(),
    s:current.getSeconds()
  };
  for(let key in dateObj){
    let reg = new RegExp(`(${key}+)`)
    if(reg.test(format)){
      let content = RegExp.$1;

      //控制补零
      let value = dateObj[key] >= 10 ? dateObj[key] : content.length == 2 ? '0' + dateObj[key] : dateObj[key];
      format = format.replace(content, value);
 
    }
  }

  return format;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
