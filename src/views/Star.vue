<template>
  <div>
    <div class="nav">
      <van-nav-bar title="我的收藏" left-arrow @click-left="clickReturn" />
    </div>

    <!-- 未登录 -->
    <div class="not-login" v-if="!isLogin">
      <span>登录后才能查看您的收藏产品</span>
      <span class="toLogin" @click="toLogin">去登录 > </span>
    </div>

    <div class="big-box" v-else>
      <div class="content-box" v-if="filterPro.length > 0">
        <div class="item" v-for="(item, index) in filterPro">
          <div class="img-box">
            <img :src="item.imgUrl">
          </div>
          <div class="text">
            <div class="name">{{ item.firstName }}</div>
            <div class="name">{{ item.secondName }}</div>
            <div class="price">&yen;{{ item.originalPrice }}&nbsp;&nbsp;&nbsp;X{{ item.count }}</div>
            <div class="del" @click="delPro(item.productId)">删除</div>
          </div>
        </div>
      </div>

      <div class="no-products" v-else>
        <div class="img-box">
          <img src="../assets/empty.png">
        </div>
        <div class="text">您还没有收藏商品</div>
      </div>
    </div>



  </div>
</template>

<script>
import { loginPhone, getLocalArrData, setLocalData } from '@/api/my.js'
export default {
  name: 'Star',
  data() {
    return {
      filterPro: [],
      isLogin: true,

    }

  },
  created() {
    // 判断是否登录
    // 获取本地登录
    let curLogin = localStorage.getItem('curLogin');
    let token = null;
    if (curLogin !== null) {
      curLogin = JSON.parse(curLogin);
      token = curLogin.token;
    }
    // 如果未登录
    if (!token) {
      this.isLogin = false;
      return;
    }

    // console.log(' this.isLogin', this.isLogin);

    let psg = getLocalArrData('productsMsg');
    // console.log(psg);

    this.filterPro = psg.filter(value => {
      return value.phone === loginPhone() && value.isStar;
    })

    // console.log('this.filterPro', this.filterPro);
  },

  methods: {
    clickReturn() {
      this.$router.push({ name: 'My' });
    },
    toLogin() {
      this.$router.push({ name: 'Login' });
    },

    delPro(productId) {
      console.log(productId);
      let psg1 = getLocalArrData('productsMsg');
      console.log(psg1);
      for (let i = 0; i < psg1.length; i++) {
        if (psg1[i].phone === loginPhone() && psg1[i].productId === productId) {
          psg1.splice(i, 1);
          i--;
        }
      }

      this.filterPro = psg1.filter(value => {
        return value.phone === loginPhone() && value.isStar;
      })

      setLocalData('productsMsg', JSON.stringify(psg1));

      // console.log('psg1', psg1);

    }

  }


}
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: #929292;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}


.not-login {
  background: #fff;
  width: 90vw;
  margin: 80px auto 0;
  height: 40px;
  line-height: 40px;
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 20px;
  justify-content: space-between;
}


.content-box {
  margin-top: 50px;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;

  .item {
    margin-left: 3%;
    width: 46%;
    height: 260px;
    background: #fff;

    .img-box {
      width: 96%;
      height: 180px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%;
        display: block;
      }
    }

    .text {
      padding-left: 10px;
      font-size: 12px;
      text-align: left;

      .name {
        /* 溢出隐藏 */
        overflow: hidden;
        /* 纯英文换行 */
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        /* 这里是超出几行省略 */
        -webkit-line-clamp: 2;

      }

      .price {
        margin-top: 10px;
        font-weight: bold;
        color: #f52f32;
        text-align: center;
      }

      .del {
        text-align: right;
        padding-right: 10px;
        color: #999;
      }
    }
  }
}

.no-products {
  margin-top: 80px;

  .img-box {
    width: 160px;
    margin: 0 auto;

    img {
      width: 100%;
      display: block;
    }
  }

  .text {
    margin-top: 30px;
    font-size: 16px;
    color: grey;
  }
}
</style>