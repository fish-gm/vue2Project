<template>
  <div>
    <!-- 底部导航栏 -->
    <van-tabbar v-model="active" active-color="#ff5e2b" inactive-color="#a7a7a7" route>
      <van-tabbar-item :to="{name:item.name}" v-for="(item, index) in icon" :key="index">
        <span>{{ item.title }}</span>
        <template #icon="props">
          <img class="tabbar-img" :src="props.active ? item.activeIcon : item.inactiveIcon" />
        </template>
      </van-tabbar-item>
    </van-tabbar>

    <!-- 二级路由插座 -->
    <keep-alive include="Classify">
      <router-view></router-view>

    </keep-alive>


  </div>
</template>

<script>
export default {
  name: 'Main',
  data() {
    return {
      // 高亮下标
      active: 0,

      icon: [
        {
          title: '首页',
          activeIcon: require('../assets/icon-home-selected.png'),
          inactiveIcon: require('../assets/icon-home.png'),
          name:'Home'
        },
        {
          title: '分类',
          activeIcon: require('../assets/icon-category-selected.252b82a2d7.png'),
          inactiveIcon: require('../assets/icon-category.be93273636.png'),
          name:'Classify'
        },
        {
          title: '购物车',
          activeIcon: require('../assets/icon-cart-selected.585c3aa4d3.png'),
          inactiveIcon: require('../assets/icon-cart.585c3aa4d3.png'),
          name:'Shopcart'
        },
        {
          title: '我的',
          activeIcon: require('../assets/icon-user-selected.fceea5d907.png'),
          inactiveIcon: require('../assets/icon-user.23496a0116.png'),
          name:'My'
        },
      ]

    }
  },
}
</script>

<style lang="scss" scoped>
// .tabbar {
//   // margin-bottom: 
//   height: 50px;

//   .tabbar-img {
//     width: 30px;
//     height: 30px;
//     display: block;
//   }

// }
::v-deep .van-tabbar{
  z-index: 9998888;
}
</style>