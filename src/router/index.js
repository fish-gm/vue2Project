import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    // meta: {
    //   keepAlive: true
    // },
    component: () => import('@/views/Main.vue'),
    // 二级home路由以及home的三级路由
    children: [
      {
        path: '/home',
        alias: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/classify',
        // alias: '',
        name: 'Classify',
        component: () => import('@/views/Classify.vue'),
      },
      {
        path: '/miquan',
        // alias: '',
        name: 'Miquan',
        component: () => import('@/views/Miquan.vue'),
      },
      {
        path: '/my',
        name: 'My',
        component: () => import('@/views/My.vue'),
      },
      // {
      //   path: '/detail/:product_id',
      //   name: 'Detail',
      //   component: () => import('@/views/Detail.vue'),
      //   meta:{
      //     isShow:false
      //   }
      // },
    ],
  },
  {
    path: '/shopcart',
    name: 'Shopcart',
    component: () => import('@/views/Shopcart.vue'),
  },
  {
    path: '/detail/:product_id',
    name: 'Detail',
    component: () => import('@/views/Detail.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    // aid 判断是否存在地址，存在则编辑，否则新增
    path: '/newAddress/:aid?',
    name: 'NewAddress',
    component: () => import('@/views/NewAddress.vue'),
  },
  {
    path: '/proCategory/:path',
    name: 'ProCategory',
    component: () => import('@/views/ProCategory.vue'),
  },
  // 待收货
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/Order.vue'),
  },
  // 查看物流
  {
    path: '/logistics/:product_id',
    name: 'Logistics',
    component: () => import('@/views/Logistics.vue'),
  },
  // 收藏
  {
    path: '/star',
    name: 'Star',
    component: () => import('@/views/Star.vue'),
  },
  {
    path: '/pay/:isSelected?',
    name: 'Pay',
    component: () => import('@/views/Pay.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
  },

]

const originaPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originaPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes
})

export default router
