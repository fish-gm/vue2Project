<template>
  <div class="detail" v-if="isGet">
    <div class="nav">
      <van-nav-bar left-arrow @click-left="onClickNavLeft" />
    </div>

    <!-- 轮播图 -->
    <van-swipe :autoplay="3000" indicator-color="#bfbfbf" height="413">
      <van-swipe-item v-for="(image, index) in swipeImages" :key="index">
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>

    <div class="show-price-box">
      <span class="show-price">
        &yen;{{ originalPrice }}
      </span>
    </div>

    <div class="product-info">
      <div class="name">{{ productInfo.name }}</div>
      <div class="desc" v-for="(val, index) in productInfo.sell_point_desc">
        <div class="point"><span>{{ index == 0 ? '①' : index == 1 ? '②' : '③' }}</span>{{ val }}</div>
      </div>
    </div>

    <div class="big-box">
      <div class="parameters-box" style="z-index: 3;">

        <div class="params" v-for="(val, index) in goodsInfo[0].class_parameters.list" v-if="val">
          <div class="show" v-if="Boolean(val.icon)">
            <div class="img-box">
              <img v-lazy="val.icon">
            </div>
            <div class="top-name">{{ val.top_title }}</div>
            <div class="bottom-name">{{ val.bottom_title }}</div>
          </div>
        </div>
      </div>

    </div>
    <!-- 规格选择 -->
    <div class="popup">
      <van-cell is-link @click="show = true">
        <div class="already-select">
          <span>已选</span>
          <div class="already">
            <span>{{ selectedRule.totalName }}</span>
            <span>&nbsp;X{{ shopcartCount == '' ? 1 : shopcartCount }}</span>
          </div>
        </div>
      </van-cell>
      <!-- 弹出框内容 -->
      <van-sku v-model="show" :sku="sku" :quota="quota" :goods-id="goodsId" :goods="goods" ref="getSkuData"
        :initial-sku="initialSku" @buy-clicked="onBuyClicked" @sku-selected="skuSelected" @stepper-change="stepperChange">
        <!-- 自定义头部价格显示 -->
        <template #sku-header-price="props">
          <div class="van-sku__goods-price">
            <span class="van-sku__price-symbol">￥</span>
            <span class="van-sku__price-num">{{ totalPrice }}</span>
          </div>
        </template>

        <!-- 自定义 sku actions -->
        <template #sku-actions="props">
          <div class="van-sku-actions">
            <!-- 直接触发 sku 内部事件，通过内部事件执行 onBuyClicked 回调 -->
            <van-button square size="large" type="warning" @click="props.skuEventBus.$emit('sku:buy')">
              确定
            </van-button>
          </div>
        </template>
      </van-sku>

    </div>

    <!-- 地址选择 -->
    <!-- <div class="address-box">
      <Address></Address>
    </div> -->

    <div class="action-box">
      <van-goods-action>
        <van-goods-action-icon icon="wap-home-o" text="首页" @click="homeIcon" />
        <van-goods-action-icon icon="shopping-cart-o" text="购物车" @click="shopcartIcon" :badge="totalCount" />
        <van-goods-action-icon :icon="isStar === true ? 'star' : 'star-o'"
          :color="isStar === true ? '#ff5000' : '#595c5a'" text="收藏" @click="collectIcon" />
        <van-goods-action-button type="warning" text="加入购物车" @click="addShopcart" />
        <van-goods-action-button color="#ff6620" type="danger" text="立即购买" @click="clickBuy" />
      </van-goods-action>
    </div>

  </div>
</template>

<script>
import { getDetail } from "../api/api.js";
import { isLogin, loginPhone, getWithPhone, setWithPhone, setLocalData, getLocalArrData } from "../api/my.js";
import Address from '../components/Address.vue'
export default {
  name: 'Detail',
  components: {
    Address,
  },
  data() {
    return {
      swipeImages: [],
      productInfo: {},
      // 弹出框
      buyOption: {},
      goodsInfo: {},
      selectedRule: {
        totalName: '',
        firstName: '',
        secondName: '',
        productId: '',
        count: 1,
        originalPrice: '',
        imgUrl: '',
        multi_buy_limit: '',
        // ischecked: false,
        isStar: false
      },

      isGet: false,
      showSelectAddress: false,

      // 购物车的数量
      shopcartCount: '',

      // 收藏
      isStar: false,

      // 弹出框变量
      show: false,

      // 商品数据
      sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [
          // {
          //   k: '颜色', // skuKeyName：规格类目名称
          //   k_s: 's1', // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
          //   v: [
          //     {
          //       id: '2', // skuValueId：规格值 id
          //       name: '红色', // skuValueName：规格值名称
          //       // imgUrl: 'https://img01.yzcdn.cn/1.jpg', // 规格类目图片，只有第一个规格类目可以定义图片
          //     },
          //     {
          //       id: '1',
          //       name: '蓝色',
          //       // imgUrl: 'https://img01.yzcdn.cn/2.jpg', // 规格类目图片，只有第一个规格类目可以定义图片
          //     }
          //   ],
          //   largeImageMode: false, //  是否展示大图模式
          // }
        ],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [
          // {
          //   id: 2259, // skuId
          //   s1: '1', // 规格类目 k_s 为 s1 的对应规格值 id
          //   // s2: '1', // 规格类目 k_s 为 s2 的对应规格值 id
          //   price: 100, // 价格（单位分）
          //   stock_num: 110 // 当前 sku 组合对应的库存
          // },
          // {
          //   id: 2259, // skuId
          //   s1: '2', // 规格类目 k_s 为 s1 的对应规格值 id
          //   // s2: '1', // 规格类目 k_s 为 s2 的对应规格值 id
          //   price: 100, // 价格（单位分）
          //   stock_num: 110 // 当前 sku 组合对应的库存
          // }
        ],
      },

      initialSku: {},

      // 商品信息
      goods: {
        // 默认商品 sku 缩略图
        picture: ''
      },

      goodsId: '',
      // 限定购买数量
      quota: 5,
      // 总金额
      totalPrice: '',
      originalPrice: '',

      // ======================本地存储=======================
      // 加入购物车的产品信息
      addProductsMsg: [],
      // 购物车总的数量
      totalCount: 0,

      // 点击加入购物车再购买
      isClickAdd: false,

    }
  },

  created() {
    // console.log('本地存储的产品信息', localStorage.getItem('productsMsg'));

    // 获取本地存储 产品
    let getLocal = localStorage.getItem('productsMsg');
    if (getLocal == null) {
      this.addProductsMsg = [];
    } else {
      getLocal = JSON.parse(getLocal);
      this.addProductsMsg = getLocal;
    }

    let productId = this.$route.params.product_id;

    // 是否收藏本产品
    if (getLocal != null) {
      if (getLocal.length == 0) return;
      for (let k = 0; k < getLocal.length; k++) {
        if (getLocal[k].productId == productId && getLocal[k].phone == loginPhone()) {
          console.log('getLocal[k]', getLocal[k]);
          this.isStar = getLocal[k].isStar;
        }
      }
    }

    // 获取本地存储 购物车总数量
    // let getCount = localStorage.getItem('totalCount');
    let getCount = getWithPhone('totalCount');

    if (getCount == null) {
      this.totalCount = 0;
    } else {
      this.totalCount = Number(getCount);
    }


    // 商品详情页面
    getDetail(productId).then(res => {

      res = res.data.data;
      // console.log('res', res);
      this.buyOption = res.buy_option;
      this.goodsInfo = res.goods_info;
      this.productInfo = res.product_info;

      // console.log('this.productInfo', this.productInfo);
      // console.log('this.buyOption', this.buyOption);
      // console.log('this.goodsInfo', this.goodsInfo);
      // console.log(this.sku);

      // 处理规格数据 Tree
      for (let i = 0; i < this.buyOption.length; i++) {
        let curTree = {};
        curTree.k = this.buyOption[i].name;
        curTree.k_s = 's' + this.buyOption[i].prop_cfg_id;
        curTree.v = [];
        for (let j = 0; j < this.buyOption[i].list.length; j++) {
          let curV = {};
          curV.id = this.buyOption[i].list[j].prop_value_id;
          curV.name = this.buyOption[i].list[j].name;
          curTree.v.push(curV);
        }
        this.sku.tree.push(curTree);
      }

      // 处理规格数据 List
      for (let m = 0; m < this.goodsInfo.length; m++) {

        // console.log('m', m);
        // 是否存在降低价格
        let price = '';
        if (this.goodsInfo[m].reduce_price) {
          price = this.goodsInfo[m].market_price - this.goodsInfo[m].reduce_price.match(/\d+/)[0];
        } else {
          price = this.goodsInfo[m].market_price;
        }
        // console.log('this.goodsInfo[m]', this.goodsInfo[m]);
        let listItem = {};
        if (this.goodsInfo[m].prop_list.length != 0) {
          for (let n = 0; n < this.goodsInfo[m].prop_list.length; n++) {
            let key = 's' + this.goodsInfo[m].prop_list[n].prop_cfg_id;
            listItem[key] = this.goodsInfo[m].prop_list[n].prop_value_id;
            listItem.multi_buy_limit = this.goodsInfo[m].multi_buy_limit.first;
            listItem.price = price;
            // 产品id
            listItem.id = this.goodsInfo[m].goods_id;
            listItem.stock_num = this.goodsInfo[m].sku;
            listItem.imgUrl = this.goodsInfo[m].img_url;
          }
        }
        else {
          listItem.price = price;
          // 产品id
          listItem.id = this.goodsInfo[m].goods_id;
          listItem.stock_num = this.goodsInfo[m].sku;
          listItem.imgUrl = this.goodsInfo[m].img_url;
        }
        // console.log('this.sku', this.sku);
        // console.log('111 listItem', listItem);

        // 判断库存情况
        this.quota = listItem.stock_num > this.quota ? this.quota : listItem.stock_num;

        // 默认规格
        if (m === 0) {
          for (let val in listItem) {
            // console.log(val);
            this.initialSku[val] = listItem[val];
            this.initialSku.selectedNum = 1;
          }
          // 初始化图片
          this.goods.picture = listItem.imgUrl;
          // 初始化产品id
          this.goodsId = listItem.id;

          // console.log('listItem', listItem);

          // 总金额 价格计算
          this.originalPrice = listItem.price;
          this.totalPrice = this.shopcartCount == '' ? this.originalPrice : this.originalPrice * this.shopcartCount;

        }
        this.sku.list.push(listItem);

      }

      // console.log('this.sku', this.sku);
      this.goodsInfo.forEach(ite => {
        if (this.goodsId === ite.goods_id) {
          this.selectedRule.totalName = ite.name;
        }
      })

      // 轮播图图片
      this.goodsInfo[0].gallery_v3.forEach(ite => {
        this.swipeImages.push(ite.img_url);
      });

      this.isGet = true;

    }).catch(err => {
      console.log('classify err', err);
    });
  },

  methods: {
    trimLastChar(value) {
      if (typeof value === 'string') {
        return value.slice(0, -1);
      }
      return value;
    },
    // 返回上一级
    onClickNavLeft() {
      this.$router.back();
    },

    showPopupAdd() {
      this.showSelectAddress = true;
    },


    // 添加新地址
    addNewAddress() {
      this.$router.push({ name: 'NewAddress' });
    },

    // 点击首页 
    homeIcon() {
      this.$router.push({ name: 'Home' });
    },

    // 点击购物车
    shopcartIcon() {
      if (!isLogin()) {
        this.$toast('请先登录');
        setTimeout(() => {
          this.$router.push({ name: 'Login' });
        });
        return;
      }
      this.$router.push({ name: 'Shopcart' });
    },

    // 收藏
    collectIcon() {
      // 判断是否登录
      if (!isLogin()) {
        this.$toast('请先登录');
        setTimeout(() => {
          this.$router.push({ name: 'Login' });
        });
        return;
      }

      if (!this.isClickAdd) {
        this.$toast('请选择规格');
        return;
      }

      let star = !this.isStar;
      this.isStar = star;
      this.selectedRule.isStar = star;

      let p = getLocalArrData('productsMsg');
      for (let i = 0; i < p.length; i++) {
        if (p[i].phone === this.selectedRule.phone && p[i].productId === this.selectedRule.productId) {
          // 替换
          p[i] = { ...this.selectedRule };
        }
      }
      setLocalData('productsMsg', JSON.stringify(p))
    },

    // 加入购物车
    addShopcart() {
      this.show = true;
    },

    // 立即购买
    clickBuy() {
      // 判断是否登录
      if (!isLogin()) {
        this.$toast('请先登录');
        setTimeout(() => {
          this.$router.push({ name: 'Login' });
        });
        return;
      }

      let selectedProducts = localStorage.getItem('selectedProducts');
      if (selectedProducts === null || selectedProducts == '[]') {
        if (!this.isClickAdd) {
          this.$toast('请选择规格');
          return;
        }

        if (selectedProducts === null) {
          selectedProducts = [];
        } else {
          selectedProducts = JSON.parse(selectedProducts);
        }
        console.log('selectedProducts', selectedProducts);

        this.selectedRule.phone = loginPhone();
        selectedProducts.push(this.selectedRule);
        // console.log(selectedProducts);

        // 放进本地存储
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));

        // console.log(selectedProducts);

        // 删除本地关于该产品的存储信息
        let getP = JSON.parse(localStorage.getItem('productsMsg'));
        // let co = Number(localStorage.getItem('totalCount'));
        let co = Number(getWithPhone('totalCount'));
        getP.splice(getP.length - 1, 1);
        co -= this.selectedRule.count;

        // 放进本地存储
        localStorage.setItem('productsMsg', JSON.stringify(getP));
        // localStorage.setItem('totalCount', co);
        setWithPhone('totalCount', co);

        this.$router.push({ name: 'Pay', params: { product_id: this.$route.params.product_id } });

      } else {

        let isExist = false;
        // 可能存在其他用户的未付款产品
        selectedProducts = JSON.parse(selectedProducts);
        for (let i = 0; i < selectedProducts.length; i++) {
          if (selectedProducts[i].phone === loginPhone()) {
            isExist = true;
            this.$toast('您有待付款的产品，请先付款！');
            setTimeout(() => {
              this.$router.push({ name: 'Pay' });
            }, 300);
          }
        }

      }

    },

    // selectedRule: {
    //   firstName: '',
    //   secondName: '',
    //   productId: '',
    //   count: 1,
    //   originalPrice: '',
    //   imgUrl:'',
    //   ischecked: false
    //   phone: 
    //   isStar: false 
    // },

    // 点击弹出框的确定
    onBuyClicked(skuData) {
      // 点击加入购物车再立即购买 获取规格
      this.isClickAdd = true;

      // 判断是否登录
      if (!isLogin()) {
        this.$toast('请先登录');
        setTimeout(() => {
          this.$router.push({ name: 'Login' });
        });
        return;
      }

      this.show = false;
      this.selectedRule = {};
      // 判断本地存储是否存在当前产品信息
      let isExist = false;

      // 获取当前产品信息
      // this.selectedRule.ischecked = false;
      this.selectedRule.firstName = this.productInfo.name;
      this.selectedRule.secondName = '';
      this.selectedRule.imgUrl = skuData.selectedSkuComb.imgUrl;
      this.selectedRule.productId = this.$route.params.product_id;
      // 当前产品对应的用户电话号码
      this.selectedRule.phone = loginPhone()
      this.selectedRule.isStar = false
      this.selectedRule.isChecked = false

      // 通过产品规格id找到对应的规格名字
      for (let key in skuData.selectedSkuComb) {
        if (key.match(/^s\d+$/)) {
          let prop_cfg_id = key.substring(1);
          for (let i = 0; i < this.buyOption.length; i++) {
            if (prop_cfg_id == this.buyOption[i].prop_cfg_id) {
              let prop_value_id = skuData.selectedSkuComb[key];

              for (let j = 0; j < this.buyOption[i].list.length; j++) {
                if (prop_value_id == this.buyOption[i].list[j].prop_value_id) {
                  this.selectedRule.secondName += this.buyOption[i].list[j].name + ' ';
                  // console.log(this.selectedRule.secondName);
                }
              }
            }
          }
        }
      }

      this.goodsInfo.forEach(item => {
        if (skuData.goodsId == item.goods_id) {
          // console.log(item);
          this.selectedRule.count = skuData.selectedNum;
          this.selectedRule.originalPrice = skuData.selectedSkuComb.price;
        }
      });

      this.selectedRule.totalName = this.selectedRule.firstName + this.selectedRule.secondName;


      this.totalCount += Number(this.selectedRule.count);

      for (let i = 0; i < this.addProductsMsg.length; i++) {
        let sIsStar = this.selectedRule.isStar;
        let aIsStar = this.addProductsMsg[i].isStar;

        let sIsChecked = this.selectedRule.isChecked;
        let aIsChecked = this.addProductsMsg[i].isChecked;
        // && (sIsStar == aIsStar || sIsStar != aIsStar) && (sIsChecked == aIsChecked || sIsChecked != aIsChecked)
        // 只要产品id和所属用户一样就替换
        if (this.selectedRule.productId == this.addProductsMsg[i].productId && this.selectedRule.phone == this.addProductsMsg[i].phone) {

          console.log('成功替换');
          // console.log('this.addProductsMsg[i]',this.addProductsMsg[i]);
          this.totalCount -= Number(this.addProductsMsg[i].count);
          this.addProductsMsg[i] = this.selectedRule;
          isExist = true;
          break;
        }
      }

      if (!isExist) {
        this.addProductsMsg.push(this.selectedRule);
      }

      // 放进本地存储
      localStorage.setItem('productsMsg', JSON.stringify(this.addProductsMsg));
      // localStorage.setItem('totalCount', this.totalCount);
      setWithPhone('totalCount', this.totalCount);

      this.$toast('成功加入购物车');

      console.log('this.addProductsMsg', this.addProductsMsg);
      console.log('this.totalCount', this.totalCount);
    },

    // 切换规格时触发
    skuSelected(rule) {
      if (rule.selectedSkuComb) {
        this.goods.picture = rule.selectedSkuComb.imgUrl;
        this.goodsId = rule.selectedSkuComb.id;
        // 价格计算
        this.originalPrice = rule.selectedSkuComb.price;
        this.totalPrice = this.shopcartCount == '' ? this.originalPrice : this.originalPrice * this.shopcartCount;
      }
    },

    // 购买数量发生变化
    stepperChange(num) {
      this.shopcartCount = num;
      this.totalPrice = this.originalPrice * this.shopcartCount;
    },

  },
}
</script>

<style lang="scss" scoped>
// 导航栏
::v-deep .van-nav-bar {
  background: transparent;
  position: fixed;
  left: 0;
  top: 0;

  .van-icon {
    color: #fff;
    font-size: 20px;
    padding: 5px;
    border-radius: 50%;
    background: rgba(0, 0, 0, .3);
  }
}

::v-deep .van-popup--bottom {
  height: 70% !important;
}

// 弹出框的X
::v-deep .van-popup__close-icon--top-right {
  font-size: 12px;
  top: 10px;
}

// 地址
::v-deep .van-tag--danger {
  border: 1px solid #ff6620;
  background: #ff6620;
}

::v-deep .van-button--danger {
  border: 1px solid #ff6620;
  background: #ff6620;
}

::v-deep .van-address-item .van-radio__icon--checked .van-icon {
  border: 1px solid #ff6620;
  background: #ff6620;
}

// 轮播图
.van-swipe-item {
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.detail {
  text-align: left;
  height: calc(100vh - 40px);
  background: #fff;
  overflow-y: auto;


  .nav {
    position: fixed;
    z-index: 100;
  }

  .show-price {
    color: #ff6700;
    font-weight: bold;
    padding-left: 15px;
    font-size: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .product-info {
    // height: 2000px;
    // background: pink;
    text-align: left;
    padding-left: 10px;

    .name {
      font-weight: bold;
      font-size: 18px;
      padding: 5px 0;
    }

    .desc {
      line-height: 20px;

      .point {
        /* 第一步：强制代码一行显示 */
        white-space: nowrap;
        /* 第二步：溢出部分内容隐藏 */
        overflow: hidden;
        /* 第三步：溢出部分内容使用省略号代码 */
        text-overflow: ellipsis;
      }
    }

  }

  .big-box {
    // height: 100px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .parameters-box {
      position: relative;
      z-index: 999;
      overflow-x: auto !important;
      display: flex;
      white-space: nowrap;
      align-items: center;

      .params {
        margin-top: 10px;
        height: 70px;
        // border: 1px solid red;

        .show {
          width: 80px;
          font-size: 12px;
          padding: 0 5px;

          .img-box {
            width: 20px;
            margin: 0 auto;

            img {
              width: 100%;
              display: block;
            }
          }

          .top-name,
          .bottom-name {
            /* 第一步：强制代码一行显示 */
            white-space: nowrap;
            /* 第二步：溢出部分内容隐藏 */
            overflow: hidden;
            /* 第三步：溢出部分内容使用省略号代码 */
            text-overflow: ellipsis;
          }
        }
      }
    }
  }


  // 选择规格/地址
  .popup-add,
  .popup {
    .already-select {
      // margin-top: 30px;
      display: flex;
      font-size: 12px;

      >span {
        font-weight: bold;
      }

      span {
        margin-right: 5px;
      }
    }

    .address-content {
      .van-empty {
        margin-top: 60px;
      }

      .a-text {
        text-align: center;
        width: 90vw;
        position: fixed;
        bottom: 10px;
        left: 5vw;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        color: #fff;
        background: #0c34ba;
      }

    }
  }

  // 弹出框内容
  .option-content {
    margin-top: 18px;
    width: 100%;

    .last-title {
      padding-left: 10px;
      // background: pink;
      display: flex;
      align-items: center;

      .img-box {
        width: 90px;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f5f5f5;

        img {
          width: 90%;
          display: block;
        }
      }

      .right {
        margin-left: 10px;
        text-align: left;

        .price {
          color: #ff784b;
          font-weight: bold;
          font-size: 18px;
        }

        .name {
          span {
            margin-right: 5px;
          }
        }
      }
    }

    .d-box {
      padding-left: 10px;
      margin-top: 30px;
      text-align: left;
      width: calc(100% - 10px);
      overflow-x: auto;

      .text {
        font-weight: bold;
      }

      .item {
        margin-top: 20px;
        display: flex;
        overflow-x: auto;
        width: 100%;
        flex-wrap: wrap;

        .p-detail {
          padding: 5px 10px;
          border-radius: 16px;
          margin-right: 10px;
          background: #f2f3f5;
          white-space: nowrap;
          margin-bottom: 10px;

          &:last-child {
            margin-right: 0px;
          }

          &.active {
            border: 1px solid #ff5e2c;
            box-sizing: border-box;
            background: #fff2ef;
            color: #ff5e2c;
          }
        }
      }
    }

    .step-box {
      margin-top: 30px;
      font-weight: bold;
      padding-left: 10px;
      padding-right: 10px;
      display: flex;
      justify-content: space-between;
    }

    .buy {
      position: fixed;
      bottom: 10px;
      left: 5vw;
      background-image: linear-gradient(to right, #ff7d00, #ff5934);
      width: 90vw;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      color: #fff;
      font-size: 18px;
    }
  }

}
</style>

<!-- sku: {
  所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
  可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
  tree: [
    {
      k: '颜色', skuKeyName：规格类目名称
      k_s: 's1', skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
      v: [
        {
          id: '2', skuValueId：规格值 id
          name: '红色', skuValueName：规格值名称
          imgUrl: 'https://img01.yzcdn.cn/1.jpg', 规格类目图片，只有第一个规格类目可以定义图片
        },
        {
          id: '1',
          name: '蓝色',
          imgUrl: 'https://img01.yzcdn.cn/2.jpg', 规格类目图片，只有第一个规格类目可以定义图片
        }
      ],
      largeImageMode: false,  是否展示大图模式
    }
  ],
  所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
  list: [
    {
      id: 2259, skuId
      s1: '1', 规格类目 k_s 为 s1 的对应规格值 id
      s2: '1', 规格类目 k_s 为 s2 的对应规格值 id
      price: 100, 价格（单位分）
      stock_num: 110 当前 sku 组合对应的库存
    },
    {
      id: 2259, skuId
      s1: '2', 规格类目 k_s 为 s1 的对应规格值 id
      s2: '1', 规格类目 k_s 为 s2 的对应规格值 id
      price: 100, 价格（单位分）
      stock_num: 110 当前 sku 组合对应的库存
    }
  ],
}, -->
<!-- initialSku: {
  键：skuKeyStr（sku 组合列表中当前类目对应的 key 值）
  值：skuValueId（规格值 id）
  s1: '1',
  s2: '1',
  <!-- 初始选中数量 -->
  selectedNum: 3,
  <!-- 初始选中的商品属性 -->
  <!-- 键：属性id -->
  <!-- 值：属性值id列表 -->
  selectedProp: {
    123: [1222]
  }
}, -->