import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload,{
  loading:require('./assets/loading.gif')
})

import { 
  Button,
  Tabbar, 
  TabbarItem,
  Search,
  Tab, 
  Tabs,
  Swipe, 
  SwipeItem,
  Lazyload, 
  Sidebar, 
  SidebarItem,
  IndexBar, 
  IndexAnchor,
  Cell,
  Icon,
  NavBar,
  Popup,
  Stepper,
  AddressEdit,
  Empty,
  Toast,
  Form,
  Field,
  RadioGroup, 
  Radio,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  Sku,
  Card,
  Tag,
  Checkbox, 
  CheckboxGroup,
  SubmitBar,
  CellGroup,
  AddressList,
  Collapse, 
  CollapseItem,
  PasswordInput, 
  NumberKeyboard,
  Step, 
  Steps
} from 'vant';

Vue
  .use(Button)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Tab)
  .use(Tabs)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Sidebar)
  .use(SidebarItem)
  .use(IndexBar)
  .use(IndexAnchor)
  .use(Cell)
  .use(Icon)
  .use(NavBar)
  .use(Popup)
  .use(Stepper)
  .use(AddressEdit)
  .use(Empty)
  .use(Toast)
  .use(Form)
  .use(Field)
  .use(RadioGroup)
  .use(Radio)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Sku)
  .use(Card)
  .use(Tag)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(CellGroup)
  .use(AddressList)
  .use(Collapse)
  .use(CollapseItem)
  .use(PasswordInput)
  .use(NumberKeyboard)
  .use(Step)
  .use(Steps)
  

Vue.use(VueAxios, axios)
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
