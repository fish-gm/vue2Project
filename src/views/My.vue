<template>
  <div class="my">
    <!-- <h1>我的</h1> -->
    <div class="login-box">
      <div class="img-box">
        <div>
          <img src="../assets/avatar.76a75b8f17.png" class="auto-box">
        </div>
      </div>
      <div class="login" @click="toLogin">{{ nickName }}</div>
    </div>

    <div class="own">
      <div class="one-order">我的订单</div>
      <div class="all-orders">全部订单&nbsp;&gt;</div>
    </div>

    <div>
      <van-tabbar :fixed="fixed" inactive-color="#2e2e2e" active-color="#2e2e2e">
        <van-tabbar-item icon="peer-pay" @click="waitPay">待付款</van-tabbar-item>
        <van-tabbar-item icon="logistics" @click="waitReceive">待收货</van-tabbar-item>
        <van-tabbar-item icon="brush-o" @click="clickStar">收藏</van-tabbar-item>
      </van-tabbar>
    </div>

    <div class="oth">
      <div class="item" v-for="(value, index) in datas" @click="logOut(value.title)">
        <div class="fill" v-if="index % 2 === 0"></div>
        <div class="item-img-box">
          <img :src="value.img">
          <div class="text">{{ value.title }}</div>
        </div>
        <div class="arrow"><van-icon color="#c2c2c2" name="arrow" /></div>
      </div>
    </div>



  </div>
</template>

<script>
export default {
  name: 'My',
  data() {
    return {
      // nickName: '登录/注册',
      fixed: false,
      active: 0,
      datas: [
        {
          img: require('../assets/会员中心.png'),
          title: '会员中心'
        },
        {
          img: require('../assets/优惠券.png'),
          title: '我的优惠'
        },
        {
          img: require('../assets/服务中心.png'),
          title: '服务中心'
        },
        {
          img: require('../assets/家.png'),
          title: '小米之家'
        },
        {
          img: require('../assets/F码.png'),
          title: '我的F码'
        },
        {
          img: require('../assets/礼物.png'),
          title: '礼物码兑换'
        },
        {
          img: require('../assets/设置.png'),
          title: '退出登录'
        },
      ]
    }
  },
  created() {

    let curLogin = localStorage.getItem('curLogin');
    // 如果用户已经登录
    if (curLogin !== null) {
      curLogin = JSON.parse(curLogin);
      // 用户名
      this.nickName = curLogin.nickName;
    }
  },
  methods: {
    toLogin() {
      this.$router.push({ name: 'Login' });
    },

    waitPay() {
      this.$router.push({ name: 'Pay' });
    },

    waitReceive() {
      this.$router.push({ name: 'Order' });
    },

    clickStar(){
      this.$router.push({ name: 'Star' });
    },

    // 退出登录
    logOut(title) {
      if (title === '退出登录') {
        let curLogin = localStorage.getItem('curLogin');
        if (curLogin === null) {
          this.$toast('您还未登录');
        } else {
          this.$toast('退出登录');
          localStorage.removeItem('curLogin');
          setTimeout(() => {
            this.nickName = '登录/注册';
          }, 300)
          // localStorage.clear();
        }

      }
    }
  },

  computed: {
    nickName: {
      get() {
        return this.$store.state.nickName;
      },
      set(val) {
        // console.log(val);
        this.$store.commit('changeNickName', val);
        return this.$store.state.nickName;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 待付款
.van-tabbar {
  height: 80px;

}

.login-box {
  background: #f37d0f;
  height: 80px;
  display: flex;
  line-height: 80px;
  color: #fff;

  .img-box {
    height: 100%;
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      width: 63%;
      height: 63%;
      border-radius: 100%;
      background: pink;
      box-shadow: 0px 0px 2px 3px rgba(255, 255, 255, 0.5);

      img {
        height: 100%;
      }

    }
  }
}

.own {
  display: flex;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  padding-left: 10px;
  padding-right: 10px;
  background: #fff;
  margin-bottom: 5px;
}

.oth {
  .item {
    // display: flex;
    // justify-content: space-between;
    height: 55px;
    line-height: 55px;
    background: #fff;
    border-bottom: 2px solid #f5f5f5;

    .fill {
      height: 10px;
      background: #f2f2f2;
    }

    .item-img-box {
      position: absolute;
      left: 15px;
      display: flex;
      align-items: center;
      line-height: 55px;

      img {
        margin-right: 10px;
        width: 26px;
        height: 26px;
      }
    }

    .arrow {
      right: 15px;
      position: absolute;
    }
  }
}
</style>