<template>
  <div v-if="isGet">
    <div class="nav">
      <van-nav-bar :title="data.page_title" right-text="搜索" left-arrow @click-left="navReturn" @click-right="navSearch" />
    </div>

    <div class="tab-box">
      <div class="items">
        <div class="pro" v-for="(val, index) in topTab" @click="getCategoryId(val.category_id)"
          :class="{ active: activeId == val.category_id }">
          <div class="img-box">
            <img :src="val.img_url" class="auto-img">
          </div>
          <div class="text">{{ val.name }}</div>
        </div>
      </div>
    </div>

    <div class="products" v-if="isGetPro">
      <div class="pro-item" v-for="(val, index) in product" @click="toDetail(val.product_id)">
        <div class="pros">
          <div class="img-box">
            <img :src="val.puzzle_url" class="auto-img">
          </div>
          <div class="text-box">
            <div class="name">{{ val.name }}</div>
            <div class="desc">{{ val.product_desc }}</div>
            <div class="price-box">
              <div class="price"><span class="now-price">&yen;{{ val.price }}{{ val.is_multi_price == true ? '&nbsp;起' :
                '' }}</span><span class="ori-price"><del>{{ val.market_price }}</del></span></div>
              <div class="s-new" v-if="val.is_multi_price">上新</div>
            </div>
            <div class="last">
              <div class="com">
                <span>{{ val.comments_total }}条评价</span>
                <span>{{ val.satisfy_per }}满意</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getAllProduct } from "../api/api.js";
import Expandfalse from '../components/Expandfalse.vue'
import Expandtrue from '../components/Expandtrue.vue'

export default {
  name: 'ProCategory',
  components: {
    Expandfalse,
    Expandtrue,
  },
  data() {
    return {
      isGet: false,
      isGetPro: false,
      data: {},
      topTab: [],
      product: [],
      activeId: '',
    }
  },
  created() {
    // console.log(this);
    let path = this.$route.params.path;
    getAllProduct(path).then(res => {
      // console.log('path', path);
      // console.log('res', res);

      if (res.data.description == "请求参数错误哦") {
        this.$toast('该产品已下架');
        setTimeout(() => {
          this.$router.back();
        }, 1000);
        console.log('该产品已下架');
        return;
      }


      this.isGet = true;
      this.data = res.data.data;
      this.topTab = this.data.top_tab;
      this.product = this.data.product;
      console.log(this.data);

      // 根据分类id获取商品 默认第一个
      this.getCategoryId(this.topTab[0].category_id);
      this.activeId = this.topTab[0].category_id;
      // console.log('id',this.activeId);

    }).catch(err => {
      console.log('ProCategory err =>', err);
    })
  },

  methods: {
    navReturn() {
      this.$router.back();
    },
    navSearch() {
      this.$router.push({ name: 'Search' });
    },

    // 点击导航栏获取分类产品
    getCategoryId(categoryId) {
      // 高亮导航下标
      this.activeId = categoryId;

      getAllProduct(categoryId).then(res => {
        this.isGetPro = true;
        this.product = res.data.data.product;
        // console.log(this.product);

      }).catch(err => {
        console.log('ProCategory err =>', err);
      })
    },

    toDetail(productId) {
      // console.log(productId);
      this.$router.push({ name: 'Detail', params: { product_id: productId } })
    }
  }
}
</script>

<style lang="scss" scoped>
// 导航栏
::v-deep .van-nav-bar .van-icon {
  color: grey;
}

::v-deep .van-nav-bar__text {
  color: grey;
}

.nav {
  width: 100vw;
  position: fixed;
  left: 0;
  top: 0;
}

.tab-box {
  width: 100vw;
  overflow-x: auto;
  background: #fff;
  margin-top: 40px;

  .items {
    max-width: 33vw;
    // width: 2000px;
    background: #fff;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 110px;

    .pro {
      min-width: 70px;
      height: 100px;
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      position: relative;

      &.active {
        color: #000;
        font-weight: bold;
        border-bottom: 2px solid #ff7442;
      }

      .img-box {
        width: 90%;
        height: 90%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        // margin-bottom: 10px;
        img {
          width: 100%;
          display: block;
        }
      }

      .text {
        color: grey;
        // margin-bottom: 10px;
        position: absolute;
        top: 80px;
      }

    }
  }

}

// 产品区
.products {
  margin-top: 10px;

  .pro-item {
    margin-bottom: 10px;

    .pros {
      height: 130px;
      background: #fff;
      display: flex;
      align-items: center;

      .img-box {
        margin: 5px;
        width: 100px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          display: block;
        }
      }

      .text-box {
        // margin-left: 5px;
        text-align: left;
        color: #414141;
        width: calc(100% - 100px);

        .name {
          padding: 5px;
          font-size: 18px;
        }

        .desc {
          color: gray;
          margin-bottom: 10px;
          /* 溢出隐藏 */
          overflow: hidden;
          /* 纯英文换行 */
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /* 这里是超出几行省略 */
          -webkit-line-clamp: 2;
        }

        .price-box {
          padding: 5px;
          display: flex;

          .price {
            span {
              &:nth-child(1) {
                color: #ff7442;
                font-size: 16px;
                font-weight: bold;
                margin-right: 10px;
              }
            }
          }

          .s-new {
            font-size: 12px;
            color: #ecad6f;
            border: 1px solid #ecad6f;
            padding: 1px 2px;
            margin-left: 10px;
            margin-top: -5px;
          }
        }

        .last {
          .com {
            color: gray;

            span:nth-child(1) {
              margin-right: 10px;
            }
          }
        }

      }
    }
  }
}
</style>