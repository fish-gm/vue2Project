<template>
  <div>
    <!-- <h1>Home页面</h1> -->
    <!-- 搜索 -->
    <div class="sea">
      <div class="img-box header">
        <img src="../assets/icon-header-logo3.ddf2a1c313.png">
      </div>
      <van-search v-model="value" placeholder="搜索商品名称" @click="getInputFocus" />
      <div class="img-box my">
        <img src="../assets/icon-user.23496a0116.png">
      </div>
    </div>

    <!-- 导航分类 -->
    <van-tabs v-model="navActive" animated title-active-color="#ed5b00" title-inactive-color="#747474">
      <van-tab title="推荐">
        <Recommend></Recommend>
      </van-tab>
      <van-tab title="智能">
        <Intelligence></Intelligence>
      </van-tab>
      <van-tab title="电视">
        <Television></Television>
      </van-tab>
      <van-tab title="家电">
        <Appliances></Appliances>
      </van-tab>
      <van-tab title="笔记本">
        <Notebook></Notebook>
      </van-tab>
    </van-tabs>


  </div>
</template>

<script>
import 'animate.css'
import { getRecSlideshow } from '../api/api.js'
import Appliances from '../components/Appliances.vue'
import Intelligence from '../components/Intelligence.vue'
import Notebook from '../components/Notebook.vue'
import Recommend from '../components/Recommend.vue'
import Television from '../components/Television.vue'
import { Search } from 'vant'

export default {
  name: 'Home',
  components: {
    Appliances,
    Intelligence,
    Notebook,
    Recommend,
    Television
  },
  data() {
    return {
      value: '',
      fixed: false,
      // 导航条默认下标
      navActive: 0,
      navData: [
        {
          title: '推荐',
          name: 'Recommend',
          pageId: 0,
        },
        {
          title: "智能",
          name: 'Intelligence',
          pageId: 10288
        },
        {
          title: '电视',
          name: 'Television',
          pageId: 19071
        },
        {
          title: '家电',
          name: 'Appliances',
          pageId: 18642
        },
        {
          title: '笔记本',
          name: 'Notebook',
          pageId: 13176
        }
      ],

    }
  },

  created() {
    // console.log(this.navActive);

    // // 获取整个首页数据
    // getRecSlideshow().then(res => {
    //   console.log('res => ', res);
    //   let sections = res.data.data.data.sections;
    //   console.log('sections => ', sections);
    // }).catch(err => {
    //   console.log('err => ', err);
    // })



  },

  methods: {
    clickNav(pageId) {
      console.log('点击了');
      console.log(pageId);
    },

    // 切换内容盒子
    toggleContent(index) {
      console.log(index);
      console.log(this.navActive);
    },

    getInputFocus() {
      this.$router.push({ name: 'Search' });
    }

  }


}
</script>

<style lang="scss" scoped>
.sea {
  width: 100vw;
  display: flex;
  justify-content: space-around;
  background: #f2f2f2;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;

  .img-box {
    width: 30px;
    height: 30px;
    padding: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }

}

// 搜索
.van-search {
  background: transparent;
}

// 导航栏
::v-deep .van-tabs--line .van-tabs__wrap {
  height: 1.17333rem;
  position: fixed;
  top: 50px;
  width: 100%;
  z-index: 100;
}

::v-deep .van-tabs {
  width: 100%;

  .van-tabs__nav {
    background: #f2f2f2;
  }
}

::v-deep .van-tabs__line {
  background: #ff6900;
}

// 组件
::v-deep .van-tabs__content--animated {
  margin-top: 90px;
  margin-bottom: 50px;
}
</style>