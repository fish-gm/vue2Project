<template>
  <div class="shopcart">
    <div class="nav">
      <van-nav-bar title="购物车" :right-text="!isEdit && isLogin ? '完成' : isLogin && productsMsg.length > 0 ? '编辑' : ''"
        left-arrow @click-left="clickReturn" @click-right="clickEdit" />
    </div>

    <!-- 未登录 -->
    <div class="not-login" v-if="!isLogin">
      <span>登录后享受更多优惠</span>
      <span class="toLogin" @click="toLogin">去登录 ></span>
    </div>

    <div class="login" v-else>
      <div class="content-box" v-if="isHasData && filterProducts.length > 0">
        <div class="all-select">
          <van-checkbox v-model="allSelect" checked-color="#ff5934" @click="allSelectClick">全选</van-checkbox>
        </div>

        <div class="item-box" v-for="(ite, index) in filterProducts">
          <div class="check">
            <van-checkbox v-model="ite.isChecked" checked-color="#ff5934"></van-checkbox>
          </div>
          <div class="img-box">
            <img :src="ite.imgUrl">
          </div>
          <div class="text-box">
            <div class="name">
              <div class="first-name">{{ ite.firstName }}</div>
              <div class="second-name">{{ ite.secondName }}</div>
            </div>
            <div class="price-box">
              <span class="price">￥{{ ite.originalPrice * ite.count }}</span>
              <van-stepper v-model="ite.count" max="5" @change="changeCount(ite.count, ite.productId)" />
            </div>
          </div>
        </div>


        <!-- 提交订单 -->
        <div class="sub">
          <van-submit-bar :price="curTotalPrice * 100" button-text="提交订单" @submit="onSubmit" v-if="isEdit"
            button-color="#ff6621" />
          <div v-else class="delete">
            <div class="d" @click="deletePros">
              删除
            </div>
          </div>
        </div>
      </div>

      <div class="none-contenr" v-else="isHasData">
        <van-empty class="custom-image" :image="no_result_mi_cart" description="购物车还是空的" />
        <div class="look" @click="look">随便看看</div>
      </div>
    </div>

  </div>
</template>

<script>
import { loginPhone, getLocalData, getLocalArrData, setLocalData, getWithPhone, setWithPhone } from '../api/my.js'
export default {
  name: 'Shopcart',
  data() {
    return {
      no_result_mi_cart: require('../assets/no_result_mi_cart.png'),
      allActiveColor: '#ff5934',
      allInactiveColor: 'grey',
      oneActiveColor: '#ff5934',
      oneInactiveColor: 'grey',

      // allSelect: false,
      // oneselect: false,

      // 是否有购物车数据
      isHasData: false,
      // 购物车数据
      productsMsg: [],
      filterProducts: [],
      curTotalPrice: 0,
      totalCount: '',

      isEdit: true,
      isLogin: true,

      loginPhone: loginPhone()

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

    let getMsg = localStorage.getItem('productsMsg');
    if (getMsg != null) {
      this.isHasData = true;
    }

    // this.totalCount = Number(localStorage.getItem('totalCount'));
    this.totalCount = Number(getWithPhone('totalCount'));

    getMsg = JSON.parse(getMsg);
    getMsg.forEach(ite => {
      if (ite.isChecked == undefined) {
        ite.isChecked = false;
      }
    });

    this.productsMsg = getMsg;

    // 过滤出当前用户匹配的购物车
    this.filterProducts = this.productsMsg.filter(value => {
      // 订单价格的初始化
      if (value.isChecked) {
        this.curTotalPrice += value.originalPrice * value.count;
      }
      return value.phone === loginPhone()
    });

  },
  methods: {
    clickReturn() {
      this.$router.back();
    },
    clickEdit() {
      console.log('编辑');
      this.isEdit = !this.isEdit;
    },
    // 随便看看
    look() {
      this.$router.push({ name: 'Classify' });
    },
    toLogin() {
      this.$router.push({ name: 'Login' });
    },
    // 提交订单
    onSubmit() {
      console.log('提交订单');
      // 判断是否有待付款的订单
      let selectedProducts = localStorage.getItem('selectedProducts');
      if (selectedProducts === null || selectedProducts == '[]') {
        this.$router.push({ name: 'Pay' });
      } else {
        let isExist = false;
        // 可能存在其他用户的未付款产品
        selectedProducts = JSON.parse(selectedProducts);
        for (let i = 0; i < selectedProducts.length; i++) {
          console.log(selectedProducts[i]);
          if (selectedProducts[i].phone === loginPhone()) {
            isExist = true;
            this.$toast('提交订单中');

            console.log('111 this.totalCount', this.totalCount);
            // 不能这里存储，得到pay页面存储
            // setLocalData('productsMsg', JSON.stringify(this.productsMsg))

            setTimeout(() => {
              // let c = 1110;
              // this.$router.push({ name: 'Pay', params: { isSelected: c } });
              this.$router.push({ name: 'Pay' });
            }, 300);
          }
        }
        // console.log('selectedProducts', selectedProducts);

        if (!isExist) {
          this.$router.push({ name: 'Pay' });
        }

      }
    },

    LoginPhone() {
      let curLogin = localStorage.getItem('curLogin');
      if (curLogin !== null) {
        curLogin = JSON.parse(curLogin);
        return curLogin.phone;
      }
      return '未登录';
    },

    // 全选
    allSelectClick() {
      this.productsMsg.forEach(ite => {
        if (ite.phone === this.LoginPhone()) {
          console.log('this.allSelect', this.allSelect);
          ite.isChecked = this.allSelect;
        }
      });
    },
    // 删除订单
    deletePros() {

      console.log(this.productsMsg);
      for (let i = this.productsMsg.length - 1; i >= 0; i--) {
        const item = this.productsMsg[i];
        if (item.isChecked && item.phone === this.LoginPhone()) {
          console.log('item', item);
          this.productsMsg.splice(i, 1);
          this.totalCount -= item.count;
        }
      }

      // 过滤出当前用户匹配的购物车
      this.filterProducts = this.productsMsg.filter(value => {
        return value.phone === loginPhone();
      });


      console.log('this.totalCount', this.totalCount);
      console.log('this.productsMsg', this.productsMsg);

      // 放进本地存储
      // localStorage.setItem('productsMsg', JSON.stringify(this.productsMsg));
      // localStorage.setItem('totalCount', this.totalCount);
      setLocalData('productsMsg', JSON.stringify(this.productsMsg));
      setWithPhone('totalCount', this.totalCount);

    },

    // 改变数量
    changeCount(count, id) {
      this.curTotalPrice = 0;
      this.totalCount = 0;
      for (let i = 0; i < this.productsMsg.length; i++) {
        if (this.productsMsg[i].isChecked && this.productsMsg[i].phone == loginPhone()) {
          this.curTotalPrice += this.productsMsg[i].originalPrice * this.productsMsg[i].count;
        }
        this.totalCount += this.productsMsg[i].count;
      }

      // console.log(this.productsMsg);
      // console.log(this.totalCount);

      // 放进本地存储
      // localStorage.setItem('productsMsg', JSON.stringify(this.productsMsg));
      // localStorage.setItem('totalCount', this.totalCount);
      setLocalData('productsMsg', JSON.stringify(this.productsMsg));
      setWithPhone('totalCount', this.totalCount);


    }
  },

  computed: {
    // 全选
    allSelect: {
      get() {
        return this.$store.state.allSelect
      },
      set(val) {
        this.$store.commit('changeAllSelect', val);
        return this.$store.state.allSelect;
      }
    }

  },

  watch: {
    // 单选
    productsMsg: {
      handler(val) {
        console.log('handler', val);
        let flag = true;
        // 初始化价格
        this.curTotalPrice = 0;

        this.productsMsg.forEach(ite => {
          if (ite.phone === this.LoginPhone()) {
            // console.log(ite);
            if (!ite.isChecked) {
              flag = false;
            } else {
              this.curTotalPrice += ite.originalPrice * ite.count;
            }
          }
        });

        // 放进本地存储
        setLocalData('productsMsg', JSON.stringify(this.productsMsg));
        this.$store.commit('changeAllSelect', flag)

      },
      deep: true
    }
  }

}
</script>

<style lang="scss" scoped>
// 导航栏
::v-deep .van-nav-bar {
  width: 100%;
  background: transparent;
  position: fixed;
  left: 0;
  top: 0;
  background: #fff;

  .van-icon {
    color: #000;
    font-size: 20px;
  }

  .van-nav-bar__title {
    font-weight: bold;
  }

  .van-nav-bar__text {
    color: #000;
  }
}

// 空购物车图片
.none-contenr {
  margin-top: 100px;
  text-align: center;

  .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }

  .look {
    color: grey;
    margin: 0 auto;
    width: 80px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    border: 1px solid grey;
  }
}

.shopcart {
  text-align: left;

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

  .oneCheck {
    width: 20px;
    height: 20px;
    background-color: #fff;
  }


  .content-box {
    width: 90%;
    margin: 60px auto 60px;
    background: #fff;
    padding: 10px;
    border-radius: 20px;

    .sub {
      background: #fff;

      .delete {
        width: 100%;
        height: 50px;
        background: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        margin-right: 15px;

        .d {
          margin-right: 10px;
          width: 110px;
          border-radius: 20px;
          text-align: center;
          line-height: 40px;
          // overflow: hidden;
          background: #ff6621;
          height: 40px;
          color: #fff;
          font-size: 17px;
          font-weight: 500;
        }
      }
    }

    .all-select {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 10px;

      span {
        margin-left: 5px;
      }
    }

    .item-box {
      display: flex;
      height: 150px;
      background: #fff;

      .check {
        margin-right: 10px;
        font-size: 18px;
        display: flex;
        align-items: center;
      }

      .img-box {
        width: 100px;
        height: 120px;
        margin: auto 0;
        display: flex;
        background: #f7f7f7;
        justify-content: center;
        align-items: center;

        img {
          width: 90%;
          display: block;
        }
      }

      .text-box {
        height: 120px;
        margin: auto 0 auto 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 200px;

        .name {
          .first-name {
            color: #898989;
            font-size: 18px;
            margin-top: 10px;
            margin-bottom: 10px;
          }

          .second-name {
            color: #898989;
          }
        }

        .price-box {
          display: flex;
          justify-content: space-between;

          .price {
            color: #ff6746;
            font-weight: bold;
            font-size: 20px;
          }
        }
      }

    }

  }
}
</style>