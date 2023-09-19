<template>
  <div class="pay">
    <div class="nav">
      <van-nav-bar title="用户结算" left-arrow @click-left="clickReturn" />
    </div>

    <!-- 未登录 -->
    <div class="not-login" v-if="!isLogin">
      <span>您还未登录</span>
      <span class="toLogin" @click="toLogin">去登录 ></span>
    </div>

    <div class="login" v-else>
      <div class="content-box" v-if="filterPro.length > 0">
        <div class="address-box">
          <Address></Address>
        </div>

        <div class="procucts-content">
          <div class="item" v-for="value in filterPro">
            <div class="pros">
              <div class="left">
                <div class="img-box">
                  <img :src="value.imgUrl">
                </div>
                <div class="name">{{ value.totalName }}</div>
              </div>
              <div class="price">
                <div class="count">{{ value.count }}&nbsp;X&nbsp;</div>
                <div class="original-price">{{ value.originalPrice }}</div>
              </div>
            </div>
            <div class="popup-delete">
              <van-collapse v-model="activeNames">
                <van-collapse-item title="" value="" :name="value.productId">
                  <div class="del" @click="deleteOne(value.productId)">删除订单</div>
                </van-collapse-item>
              </van-collapse>
            </div>

          </div>
        </div>

        <div class="other">
          <div class="freight">
            <span>运费</span>
            <span>包邮</span>
          </div>
          <div class="coupon">
            <van-collapse v-model="activeNames">
              <van-collapse-item title="优惠券" name="1" value="无可用">
                没有可用的优惠券

              </van-collapse-item>
            </van-collapse>
          </div>

          <div class="price-box">
            <div class="pro-price">商品总数：<span>{{ paidCount }}</span></div>
            <div class="pro-price">配送费用：<span>0.00</span></div>
          </div>
        </div>
        <div class="to-pay">
          <van-submit-bar button-text="去付款" @submit="toPay" button-color="#ff5722" :price="totalPrice * 100" />
        </div>
        <!-- 付款密码弹窗 -->
        <van-popup v-model="showPassword" position="bottom" closeable>
          <div class="password-box">

            <div class="text">输入支付密码</div>
            <van-password-input :value="value" />
            <van-number-keyboard v-model="value" :show="showKeyboard" />
          </div>
        </van-popup>

      </div>

      <div class="no-wait-pay" v-else>
        <div class="img-box">
          <img src="../assets/empty.png">
        </div>
        <div class="text">您还没有待付款订单</div>
      </div>
    </div>



  </div>
</template>

<script>
import Address from '../components/Address.vue'
import { getLocalArr, loginPhone, setLocalData } from '../api/my.js'
// 地址api
import { getArrWithPhone, setWithPhone, getWithPhone } from '../api/my.js'

export default {
  name: 'Pay',
  components: {
    Address,
  },
  data() {
    return {
      // 已选的商品，不确定是否付款
      selectedProducts: [],
      // 已付款的商品
      paidProducts: [],
      // 未付款的商品
      productsMsg: [],
      totalCount: 0,

      activeNames: ['0'],
      totalPrice: 0,
      paidCount: 0,
      showPassword: false,
      showKeyboard: true,
      value: '',

      payPassword: 123456,

      // 判断是否登录
      isLogin: true,

      logPhone: loginPhone(),

      filterPro: [],

    }
  },
  created() {
    // console.log(this);
    // console.log(this.$route);
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
      // console.log(this.isLogin);
      return;
    }

    // 获取本地已付款的商品
    this.paidProducts = getLocalArr('paidProducts')
    // console.log(this.paidProducts);
    // this.totalCount = Number(localStorage.getItem('totalCount'));
    this.totalCount = Number(getWithPhone('totalCount'));
    // console.log(this.totalCount);

    let productsMsg = localStorage.getItem('productsMsg');
    if (productsMsg !== null) {
      productsMsg = JSON.parse(productsMsg)
    }
    this.productsMsg = productsMsg;

    // 获取本地待付款的商品
    let getSelected = localStorage.getItem('selectedProducts');
    // console.log(JSON.parse(getSelected));
    if (getSelected === null || getSelected == '[]') {
      // console.log(1);
      productsMsg.forEach(item => {
        if (item.isChecked && item.phone === loginPhone()) {
          // console.log('item',item);

          // 当前用户的待付款的产品
          this.selectedProducts.push(item);
          this.totalPrice += item.originalPrice * item.count;
          this.paidCount += item.count;
        }
      });

      // 从未付款的商品清除已经付款的商品
      for (let i = 0; i < this.productsMsg.length; i++) {
        for (let j = 0; j < this.selectedProducts.length; j++) {
          if (this.productsMsg[i]['productId'] === this.selectedProducts[j]['productId']) {
            this.productsMsg.splice(i, 1);
            this.totalCount -= this.selectedProducts[j]['count'];
          }
        }
      }

      // console.log('this.totalCount', this.totalCount);
      // console.log('this.productsMsg', this.productsMsg);
      // console.log('this.selectedProducts', this.selectedProducts);

      // 放进本地存储
      // localStorage.setItem('productsMsg', JSON.stringify(this.productsMsg));
      // localStorage.setItem('totalCount', JSON.stringify(this.totalCount));
      // localStorage.setItem('selectedProducts', JSON.stringify(this.selectedProducts));
      setLocalData('productsMsg', JSON.stringify(this.productsMsg));
      setWithPhone('totalCount', JSON.stringify(this.totalCount));
      setLocalData('selectedProducts', JSON.stringify(this.selectedProducts));

    } else {
      // 在详情页面直接付款的产品
      getSelected = JSON.parse(getSelected);
      let curPro = [];
      // console.log(this);
      // console.log(this.$route.params.isSelected);
      // this.aid = this.$route.params.aid;
      for (let i = 0; i < this.productsMsg.length; i++) {
        if (this.productsMsg[i].isChecked && this.productsMsg[i].phone === loginPhone()) {

          // 从购物车页面跳转过来的，添加购物车已勾选的产品
          // if (this.$route.params.isSelected === 1110) {

          // 如果存在相同的产品，则不添加 
          let isExist = false;
          for (let j = 0; j < getSelected.length; j++) {
            if (getSelected[j].phone === loginPhone() && getSelected[j].productId === this.productsMsg[i].productId) {
              isExist = true;
            }
          }
          if (isExist) {
            console.log(1);
            continue;
          }

          console.log(111);
          curPro.push(this.productsMsg[i]);
          // return;
          // console.log(1111);
          // }
        }
      }

      console.log('curPro', curPro);
      // 存放所有用户未付款的产品
      this.selectedProducts = [...getSelected, ...curPro];

      // 初始化
      this.paidCount = 0;
      this.totalPrice = 0;
      this.selectedProducts.forEach(value => {
        if (value.phone === this.logPhone) {
          // console.log(value);
          this.paidCount += value.count;
          this.totalPrice += value.originalPrice * value.count;
        }
      });

      // this.paidCount += getSelected[0].count;
      // this.totalPrice += getSelected[0].originalPrice * getSelected[0].count;
      // console.log(getSelected);
    }

    // 过滤当前用户未付款的产品
    this.filterPro = this.selectedProducts.filter(value => {
      return value.phone === this.logPhone;
    })

    // 清掉购物车的数据
    let pr = [...this.productsMsg];
    for (let i = 0; i < pr.length; i++) {
      for (let j = 0; j < this.filterPro.length; j++) {
        if (JSON.stringify(pr[i]) === JSON.stringify(this.filterPro[j])) {
          // console.log(111);
          pr.splice(i, 1); // 从数组 pr 中删除相同的对象
          i--; // 更新索引，使得下一次循环继续检查当前位置
          break; // 跳出内层循环，继续检查下一个对象
        }
      }
    }

    // console.log('pr',pr);
    // this.productsMsg=[...pr];
    // let count = getWithPhone('totalCount');
    let count = 0;
    pr.forEach(value => {
      if (value.phone === loginPhone()) {
        // console.log(value);
        count += value.count;
      }
    })
    // console.log(count);
    setWithPhone('totalCount', count);
    setLocalData('productsMsg', JSON.stringify(pr));
    // console.log('this.productsMsg', this.productsMsg);
    // return;

    localStorage.setItem('selectedProducts', JSON.stringify(this.selectedProducts));
    return;
    // console.log(this.filterPro);
  },
  methods: {
    toLogin() {
      this.$router.push({ name: 'Login' });
    },

    clickReturn() {
      // this.$router.back();
      this.$router.push({ name: 'My' });
    },

    // 去付款
    toPay() {
      // 获取本地地址
      // let getAdd = getLocalArr('addressMsg')
      let getAdd = getArrWithPhone('addressMsg');
      if (getAdd.length <= 0) {
        this.$toast('请选择地址');
        return;
      }
      this.showPassword = true;
    },

    // 删除当个订单
    deleteOne(productId) {
      // console.log(productId);
      // console.log(this.selectedProducts);
      for (let i = 0; i < this.selectedProducts.length; i++) {
        if (productId === this.selectedProducts[i].productId) {
          this.totalPrice -= (this.selectedProducts[i].originalPrice * this.selectedProducts[i].count);
          console.log('this.totalCount', this.totalCount);
          console.log('this.selectedProducts[i].count', this.selectedProducts[i].count);
          this.paidCount -= this.selectedProducts[i].count;
          console.log('this.paidCount', this.paidCount);
          // return
          this.selectedProducts.splice(i, 1);
          this.$toast('删除成功');
        }
      }

      // 过滤当前用户未付款的产品
      this.filterPro = this.selectedProducts.filter(value => {
        return value.phone === this.logPhone;
      })

      // localStorage.setItem('selectedProducts', JSON.stringify(this.selectedProducts));
      setLocalData('selectedProducts', JSON.stringify(this.selectedProducts));

    }

  },

  watch: {
    value(value) {

      if (value.length === 6) {
        value = Number(value);
        this.$toast({
          type: 'loading',
          forbidClick: true,
          duration: 2000,
          message: '支付中...'
        })

        setTimeout(() => {
          if (value !== this.payPassword) {
            this.$toast('密码错误');
          } else {
            // 获取付款时间
            function getBeijingTime() {
              // 获取本地时间
              const localTime = new Date();
              // 获取本地时间与 UTC 时间差（单位：分钟）
              const utcOffset = localTime.getTimezoneOffset();
              // 计算北京时间
              const beijingTime = new Date(localTime.getTime() + (utcOffset + 480) * 60000);
              return beijingTime;
            }
            let payTime = getBeijingTime().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
            
            for (let m = 0; m < this.selectedProducts.length; m++) {
              this.selectedProducts[m].payTime = payTime;
            }
            
            // 存储已付款的商品
            this.paidProducts = [...this.paidProducts, ...this.selectedProducts];
            setLocalData('paidProducts', JSON.stringify(this.paidProducts));


            console.log('this.selectedProducts', this.selectedProducts);

            let curPayPro = [...this.selectedProducts];
            let pros = JSON.parse(localStorage.getItem('selectedProducts'));
            pros = pros.filter(val => {
              return val.phone != loginPhone();
            })

            console.log(pros);

            setLocalData('selectedProducts', JSON.stringify(pros));

            if (pros.length == 0) {
              localStorage.removeItem('selectedProducts');
            }

            console.log(this.selectedProducts);

            this.$toast('支付成功');

            setTimeout(() => {
              this.$router.push({ name: 'Order' });
            }, 300);
          }

        }, 2000)


      }
    },
  },
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

// 折叠面板
::v-deep .van-cell__title,
.van-cell__value {
  text-align: left;
  font-weight: bold;
  font-size: 14px;
}

::v-deep .van-button--round {
  border-radius: 0;
}

::v-deep .van-cell {
  padding: 0 0.42667rem;
}

.content-box {
  margin-top: 46px;

  .address-box {
    background: #fff;
    margin-bottom: 0.26667rem;
    padding-top: 6px;
  }

  .procucts-content {
    .item {
      border-bottom: 1px solid rgb(165, 164, 164);

      .pros {
        position: relative;
        z-index: 10;
        // padding-left: 20px;
        padding-right: 20px;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;

        div {
          white-space: nowrap;
        }

        .left {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;

          .img-box {
            width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            // margin-right: 20px;

            img {
              width: 80%;
              display: block;
            }
          }

          .name {
            max-width: 230px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .price {
          display: flex;

          .original-price {
            font-weight: bold;
          }
        }

      }

      .popup-delete {
        position: relative;
        width: 100vw;
        z-index: 5;
        margin-top: -10px;
        text-align: center;

        .del {
          background: pink;
          width: 100px;
          height: 30px;
          line-height: 30px;
          color: #000;
          background: rgb(213, 211, 211);
          border-radius: 15px;
          margin-left: calc(50% - 50px);
        }
      }
    }
  }

  .other {
    margin-bottom: 20px;
    margin-top: 20px;
    background: #fff;

    .freight {
      border-bottom: 1px solid rgb(165, 164, 164);
      display: flex;
      height: 44px;
      line-height: 44px;
      justify-content: space-between;
      margin-left: 20px;
      margin-right: 20px;

      span {
        &:nth-child(1) {
          font-weight: bold;
          font-size: 15px;
        }

        &:nth-child(2) {
          color: #929292;
        }
      }
    }

    // 优惠卷
    .coupon {
      padding-top: 12px;
      padding-bottom: 6px;
    }

    .price-box {

      .pro-price {
        font-weight: bold;
        display: flex;
        margin-left: 20px;
        margin-right: 20px;
        font-size: 15px;
        height: 34px;
        line-height: 34px;

        span {
          color: grey;
          font-weight: normal;

        }
      }
    }
  }
}

.password-box {
  padding: 50px 10px 264px;
}

// 未登录
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

.no-wait-pay {
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