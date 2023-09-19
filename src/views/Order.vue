<template>
  <div>
    <div class="nav">
      <van-nav-bar title="待收货" left-arrow @click-left="clickReturn" />
    </div>
    <!-- 未登录 -->
    <div class="not-login" v-if="!isLogin">
      <span>登录后才能查看您的收货订单状态</span>
      <span class="toLogin" @click="toLogin">去登录 ></span>
    </div>

    <div class="login" v-else>
      <div class="products" v-if="paidProducts.length > 0">
        <div class="pros" v-for="value in paidProducts">
          <div class="left">
            <div class="img-box">
              <img :src="value.imgUrl">
            </div>
            <div class="total-name">
              <div class="firstName">{{ value.firstName }}</div>
              <div class="secondName">{{ value.secondName }}</div>
              <div class="tip-box">
                <div class="tip">
                  <span>假一赔4</span>
                  <span>7天无理由退换</span>
                </div>
              </div>
            </div>
          </div>

          <div class="price">
            <div class="original-price">&yen;{{ value.originalPrice }}</div>
            <div class="count">&nbsp;X&nbsp;{{ value.count }}</div>
          </div>

          <div class="bottom">
            <div class="more">更多</div>
            <div class="right">
              <div class="look" @click="lookLogistics(value.productId)">查看物流</div>
              <div class="receive">确认收货</div>
            </div>
          </div>
        </div>
      </div>

      <div class="no-products" v-else>
        <div class="img-box">
          <img src="../assets/empty.png">
        </div>
        <div class="text">您还没有收货订单</div>
      </div>
    </div>


  </div>
</template>

<script>
import { getLocalArr, loginPhone } from '../api/my.js'

export default {
  name: 'Order',
  data() {
    return {
      paidProducts: [],
      isLogin: true,
    }
  },
  created() {
    let paid = getLocalArr('paidProducts').filter(value => {
      return value.phone === loginPhone();
    })

    // 获取当前用户的订单
    // this.paidProducts = [...getLocalArr('paidProducts')];
    this.paidProducts = [...paid];
    // console.log(this.paidProducts);

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

  },
  methods: {
    clickReturn() {
      this.$router.push({ name: 'My' });
    },
    toLogin() {
      this.$router.push({ name: 'Login' });
    },
    // 查看物流
    lookLogistics(productId) {
      this.$router.push({ name: 'Logistics', params: { product_id: productId } });
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: #929292;
}

::v-deep .van-nav-bar {
  width: 100%;
  background: transparent;
  background: #f2f2f2;
  position: fixed;
  left: 0;
  top: 0;
}

::v-deep .van-nav-bar__title {
  color: #929292;
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

.products {
  margin-top: 50px;

  .pros {
    position: relative;
    padding-right: 20px;
    margin-bottom: 20px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    height: 160px;

    div {
      white-space: nowrap;
    }

    .left {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      height: 120px;

      .img-box {
        width: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        // margin-right: 20px;

        img {
          width: 90%;
          display: block;
        }
      }

      .total-name {
        text-align: left;

        .firstName {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
          max-width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .secondName {
          max-width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tip-box {
          color: #ff6900;
          height: 30px;
          line-height: 30px;
          margin-top: 10px;

          span {
            padding: 5px;
            border: 1px solid #ff6900;
            box-sizing: border-box;

            &:nth-child(1) {
              margin-right: 10px;
            }
          }
        }
      }
    }

    .price {
      // display: flex;
      height: 120px;
      padding-top: 20px;

      .original-price {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .count {
        text-align: right;
      }
    }

    .bottom {
      height: 40px;
      line-height: 40px;
      width: 94%;
      position: absolute;
      left: 3%;
      bottom: 0;
      display: flex;
      justify-content: space-between;

      .more {
        color: grey;
      }

      .right {
        display: flex;
        font-size: 14px;

        div {
          width: 80px;
          height: 36px;
          line-height: 36px;
          background: pink;
          border-radius: 18px;
        }

        .look {
          margin-right: 10px;
          border: 1px solid rgb(158, 156, 156);
          background: #fff;
        }

        .receive {
          border: 1px solid #ff6900;
          color: #ff6900;
          background: #fff;
        }
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