<template>
  <div class="search" v-if="isGet">
    <div class="sea-box">
      <div class="arrow" @click="clickReturn">
        <van-icon name="arrow-left" />
      </div>
      <div class="sea-val">
        <!-- <input type="search" v-model="seaVal" placeholder="搜索商品名称"> -->
        <van-search v-model="keyword" placeholder="搜索商品名称" @search="onSearch" @focus="getInputFocus" />
      </div>
      <div class="sea-icon">
        <van-icon name="search" @click="onSearch" />
      </div>
    </div>

    <div class="sea-name" v-if="!isShowPro">
      <!-- 历史记录 -->
      <div class="sea-history">
        <van-cell-group v-if="historyList.length > 0">
          <div class="top">
            <div class="text">搜索历史</div>

            <div class="clear">
              <van-cell value="" @click="clearHistory">
                <van-icon name="delete-o" />
              </van-cell>
            </div>

          </div>
          <div class="item-box">
            <!-- <div class="item"> -->
            <van-cell v-for="(item, index) in historyList" :key="index" @click="onHistoryItemClick(item)">
              <div class="item" @click="onSearch(item)">
                {{ item }}
              </div>
            </van-cell>
            <!-- </div> -->
          </div>

        </van-cell-group>
      </div>

      <!-- 搜索发现 -->
      <div class="discover">
        <div class="dis-text">搜索发现</div>
        <div class="list">
          <div class="list-item" v-for="(val, index) in discover_list" @click="onSearch(val.desc)">{{ val.desc }}</div>
        </div>

      </div>
    </div>

    <!-- 搜索出来的产品 -->
    <div class="show-pro" v-else>
      <div class="pro-item" v-for="(val, index) in product" @click="toPage(val.body.product_id)">
        <div class="pros">
          <div class="img-box">
            <img :src="val.body.image" class="auto-img">
          </div>
          <div class="text-box">
            <div class="name">{{ val.body.name }}</div>
            <div class="desc">{{ val.body.desc }}</div>
            <div class="price-box">
              <div class="price"><span class="now-price">&yen;{{ val.body.price }}{{ val.body.is_multi_price == true ?
                '&nbsp;起' :
                '' }}</span><span class="ori-price"><del>{{ val.body.market_price }}</del></span></div>
              <div class="s-new" v-if="val.body.is_multi_price">上新</div>
            </div>
            <div class="last">
              <div class="com">
                <span>{{ val.body.comments_total }}条评价</span>
                <span>{{ val.body.satisfy_per }}满意</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { hotSearch, searchPro, getDetail } from '../api/api.js'

export default {
  name: 'Search',
  data() {
    return {
      isGet: false,
      keyword: '',
      showHistory: false,
      historyList: [],

      discover_list: [],

      isShowPro: false,

      product: [],
    }
  },
  created() {
    // 获取本地存储 历史记录
    let his = localStorage.getItem('seaHistoryList');
    if (his == null) {
      this.historyList = [];
    } else {
      his = JSON.parse(his);
      this.historyList = his;
    }

    // 搜索发现
    hotSearch().then(res => {
      this.isGet = true;
      this.discover_list = res.data.data.discover_list;
    }).catch(err => {
      console.log('err => ', err);
    })


  },

  methods: {
    clickReturn() {
      this.$router.back();
    },

    onSearch(val) {
      this.keyword = val;
      // 搜索产品
      this.isShowPro = true;
      searchPro(this.keyword).then(res => {
        this.product = res.data.data.list_v2;
      }).catch(err => {
        console.log('err => ', err);
      })
      // 处理搜索逻辑
      this.saveToHistory(this.keyword);
      this.keyword = '';
      // this.isShowPro = true;

    },

    getInputFocus() {
      this.isShowPro = false;
    },

    saveToHistory(keyword) {
      const index = this.historyList.indexOf(keyword);
      if (index !== -1) {
        // 如果已存在该历史记录，则先删除再添加到数组最前面
        this.historyList.splice(index, 1);
      }
      this.historyList.unshift(keyword);
      if (this.historyList.length > 10) {
        // 限制历史记录最多为10条
        this.historyList.pop();
      }

      // localStorage.setItem(JSON.stringify('seaHistoryList'));
      localStorage.setItem('seaHistoryList', JSON.stringify(this.historyList));
    },
    onHistoryItemClick(keyword) {
      // 点击历史记录项，执行相应的操作
      // ...
    },
    clearHistory() {
      this.historyList = [];

      // 清空历史记录
      localStorage.setItem('seaHistoryList', JSON.stringify(this.historyList));

    },

    toPage(id) {
      // 商品详情页面
      getDetail(id).then(res => {
        // console.log('id', id);
        // console.log('res', res.data.data);
        // 跳转到详情页面
        if (res.data.data) {
          // console.log('详情');
          this.$router.push({ name: 'Detail', params: { product_id: id } });
        }
        // 跳转到分类页面
        else {
          // console.log('分类');
          this.$router.push({ name: 'ProCategory', params: { path: id } });
        }

      }).catch(err => {
        console.log('toPage err', err);
      });
    }
  }

}
</script>

<style lang="scss" scoped>
// 搜索
::v-deep .van-icon {
  font-size: 20px;
}

::v-deep .van-icon {
  font-size: 20px;
}

::v-deep .van-search {
  background: transparent;
  width: 100%
}

::v-deep .van-search .van-cell .van-field__left-icon {
  display: none;
}

::v-deep .van-cell {
  width: unset !important;
}

.search {
  // background: #fff;
  height: 100vh;
  text-align: left;

  .sea-box {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 100;
    background: #f2f2f2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;

    .arrow,
    .sea-icon {
      width: 50px;
      text-align: center;
    }

    .sea-val {
      width: calc(100% - 100px);
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      input {
        width: 100%;
        height: 70%;
        border-radius: 16px;
        padding-left: 16px;
        outline: none;
        border: 1px solid transparent;
        box-sizing: border-box;
      }
    }

  }

  .sea-name {
    margin-top: 45px;
    .sea-history {
      .top {
        display: flex;
        justify-content: space-between;

        .text {
          width: 80px;
          height: 40px;
          line-height: 40px;
          font-weight: bold;
          padding-left: 10px;
        }
      }

      .item-box {
        width: 100vw;
        display: flex;
        flex-wrap: wrap;

        .item {
          background: #f5f5f5;
          padding-left: 10px;
          padding-right: 10px;
          border-radius: 30px;
          color: grey;
        }
      }
    }

    .discover {
      .dis-text {
        font-weight: bold;
        padding-left: 10px;
        margin-top: 20px;
        margin-bottom: 10px;
      }

      .list {
        width: 95%;
        margin-left: 5%;
        display: flex;
        flex-wrap: wrap;

        .list-item {
          width: 50%;
          height: 30px;
          line-height: 30px;
        }
      }
    }

  }

}

// 产品区
.show-pro {
  margin-top: 60px;

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
          /* 溢出隐藏 */
          overflow: hidden;
          /* 纯英文换行 */
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /* 这里是超出几行省略 */
          -webkit-line-clamp: 2;
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