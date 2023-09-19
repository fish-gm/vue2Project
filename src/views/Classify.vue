<template>
  <div class="menu" v-if="isGet">
    <div class="sea">
      <van-search v-model="value" placeholder="搜索商品名称" @focus="searchPro" />
    </div>

    <keep-alive>
      <!-- 商品区 -->
      <div class="aside-menu">

        <!-- 侧边导航栏 -->
        <div class="aside">
          <van-sidebar v-model="sidebarAindex" @change="sidebarChange">
            <div class="s" v-for="(item, index) in categoryDa">
              <van-sidebar-item :title="item.category_name" />
            </div>
          </van-sidebar>
        </div>

        <!-- 推荐 -->
        <div class="content" v-if="isGetRem">
          <div class="fill-img" @click="toPage(RecommendData.cellsAutoFill[0].action.path)">
            <img :src="RecommendData.cellsAutoFill[0].img_url">
          </div>
          <div class="title-box">
            <div class="title">{{ RecommendData.categoryTitle[0] }}</div>
          </div>
          <div class="products">
            <div class="expand-true" v-for="(item, index) in RecommendData.categoryGroup.remExpandTrue"
              @click="toPage(item.product_id)">
              <Expandtrue :product="item"></Expandtrue>
            </div>
            <!-- 使用分类接口 -->
            <!-- https://apis.netstart.cn/xmsc/home/category_v2?cat_id="益智积木" -->
            <div class="e2">
              <div class="expand-false" :data-path="item.action.path"
                v-for="(item, index) in RecommendData.categoryGroup.remExpandFalse" @click="toPage(item.action.path)">
                <Expandfalse :product="item"></Expandfalse>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边导航栏其他数据 -->
        <div class="content" v-show="isGetOth">
          <div class="fill-img" @click="toPage(othCategory.cellsAutoFill[0].action.path)"
            v-if="othCategory.cellsAutoFill.length > 0">
            <img :src="othCategory.cellsAutoFill[0].img_url">
          </div>

          <div class="products">
            <van-index-bar :index-list="proIndexList" :sticky-offset-top='stickyTop' ref="indexAnchor"
              highlight-color="#000">
              <div class="box" v-for="(value, index) in othCategory.productData">
                <!-- 索引 -->
                <van-index-anchor :index="proIndexList[index]">{{ proIndexList[index] }}</van-index-anchor>

                <!-- 手机系列 -->
                <div v-if="othCategory.isExpand">
                  <div class="expand-true" v-for="(childValue, childIndex) in othCategory.productData[index].pro"
                    :data-item="childValue" @click="toPage(childValue.product_id)">
                    <Expandtrue :product="childValue"></Expandtrue>
                  </div>
                </div>

                <!-- 其他系列 -->
                <div v-else>
                  <div class="e2">
                    <div class="expand-false" v-for="(childValue, childIndex) in othCategory.productData[index].pro"
                      @click="toPage(childValue.action.path)">
                      <Expandfalse :product="childValue"></Expandfalse>
                    </div>
                  </div>
                </div>

              </div>
            </van-index-bar>

          </div>
        </div>
      </div>
    </keep-alive>



  </div>
</template>

<script>
import { categoryData, getDetail } from "../api/api.js";
import Expandtrue from '../components/Expandtrue.vue'
import Expandfalse from '../components/Expandfalse.vue'


export default {
  name: 'Classify',
  components: {
    Expandtrue,
    Expandfalse
  },
  data() {
    return {
      isGet: false,
      isGetRem: false,
      isGetOth: false,
      value: '',
      cName: '',
      stickyTop: 0,
      // 侧边导航栏的索引下标
      sidebarAindex: 1,
      // 侧边导航栏
      categoryDa: [],
      // 推荐
      RecommendData: {
        cellsAutoFill: [],
        categoryTitle: [],
        categoryGroup: {
          remExpandTrue: [],
          remExpandFalse: [],
        }
      },

      // 侧边导航栏其他数据
      othCategory: {
        cellsAutoFill: [],
        isExpand: false,
        // Products无用，先不删
        Products: {},
        productData: []
      },

      // 吸顶索引
      proIndexList: [],
      titleIndex: 0,

      // 判断是否有满屏图片 决定索引框距离顶部的高度
      ifCellsAutoFill: true,

    }
  },

  created() {
    // 所有分类内容 没有传id
    categoryData().then(res => {
      this.isGet = true;
      this.categoryDa = res.data.data;
      // console.log('全部分类', this.categoryDa);

      // 默认显示推荐内容
      // this.getRemmendData();
      this.getOthSideData(1242);


    }).catch(err => {
      console.log('Classify分类 err =>', err);
    });
    // console.log('this',this);

    // console.log('this.recommendData', this.recommendData);

  },

  methods: {
    searchPro() {
      this.$router.push({ name: 'Search' });
    },

    // 改变侧边导航栏
    sidebarChange() {
      let id = this.categoryDa[this.sidebarAindex].category_id;
      // console.log(id);
      // 传id 单个分类内容
      if (id === -1) {
        this.getRemmendData();
      } else {
        this.isGetRem = false;
        this.getOthSideData(id);
      }

    },

    // 获取推荐数据
    getRemmendData() {
      categoryData(-1).then(res => {
        this.isGetRem = true;
        this.isGetOth = false;
        let one = res.data.data[0];
        // 推荐
        one.category_list.forEach(ite => {
          // console.log(ite);
          if (ite.view_type == "cells_auto_fill") {
            this.RecommendData.cellsAutoFill.push(...ite.body.items)
          } else if (ite.view_type == "category_title") {
            this.RecommendData.categoryTitle.push(ite.body.category_name)
          } else if ((ite.view_type == "category_group") && (ite.body.is_expand == true)) {
            this.RecommendData.categoryGroup.remExpandTrue.push(...ite.body.product_list)
          } else {
            // console.log('ite.body', ite.body);
            this.RecommendData.categoryGroup.remExpandFalse.push(...ite.body.items)
          }
        });
        // console.log(this.RecommendData);
      }).catch(err => {
        console.log('Classify分类 err =>', err);
      });
    },

    // 获取侧边导航栏其他数据
    getOthSideData(id) {
      // console.log('获取侧边导航栏其他数据id',id);
      categoryData(id).then(res => {
        this.isGetOth = true;
        // 初始化
        this.othCategory = {
          cellsAutoFill: [],
          isExpand: false,
          Products: {},
          productData: []
        };
        this.proIndexList = [];
        this.titleIndex = 0;

        let one = res.data.data[0];
        // 侧边导航栏其他数据
        one.category_list.forEach(ite => {
          // console.log(ite);

          if (ite.view_type == "cells_auto_fill") {
            this.othCategory.cellsAutoFill.push(...ite.body.items);
          }
          else if (ite.view_type == "category_title") {
            this.othCategory.productData[this.titleIndex] = {};

            this.cName = ite.body.category_name;
            this.othCategory.Products[this.cName] = [];
            // 对象名为索引名
            this.othCategory.productData[this.titleIndex].pro = [];
          }
          else {
            // 手机系列 使用 Expandtrue 组件
            if (ite.body.product_list) {
              this.othCategory.isExpand = true;
              this.othCategory.Products[this.cName].push(...ite.body.product_list);
              this.othCategory.productData[this.titleIndex].pro.push(...ite.body.product_list);
              // console.log('ite.body.product_list', ite.body.product_list);
            }
            // 其他系列 使用 Expandfalse 组件
            else {
              this.othCategory.isExpand = false;
              this.othCategory.Products[this.cName].push(...ite.body.items);
              this.othCategory.productData[this.titleIndex].pro.push(...ite.body.items);
              // console.log('ite.body.items', ite.body.items);
            }

            this.titleIndex++;
          }
        });

        // 添加点击高亮索引
        for (let i in this.othCategory.Products) {
          this.proIndexList.push(i);
        }

        // console.log(this.$refs.indexAnchor.$el.children[0]);

      }).catch(err => {
        console.log('Classify分类 err =>', err);
      });
    },

    // 除了推荐的其他侧边导航栏数据 跳转到分类/详情页面
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
  },
}
</script>

<style lang="scss" scoped>
.van-search {
  background: #f2f2f2;

  .van-search__content {
    background: #fff;
    border-radius: 17px;
  }
}

// 侧边导航栏
::v-deep .van-sidebar {
  width: 80px;

  .van-sidebar-item {
    padding: 15px 0;
    color: #666666;
    font-size: 12px;
  }

  .van-sidebar-item--select::before {
    background-color: #ff6d15;
  }
}

// 索引栏目
::v-deep .van-index-anchor--sticky {
  font-weight: bold !important
}

::v-deep .van-index-bar__index {
  white-space: nowrap;
}

::v-deep .van-index-bar__sidebar {
  flex-direction: row;
  top: 90%;
  // bottom: 40px;
  // flex-direction: row;
  width: calc(100% - 80px);
  background: #fff;
  overflow-x: auto;
  color: #828080;

  // padding: 10px 0;
  .van-index-bar__index {
    padding: 5px 5px;
    margin: 2px 5px;
    background: #f2f2f2;
    // height: 16px;
    line-height: 16px;
  }
}

.menu {
  background: pink;

  .sea {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
  }

  .aside-menu {
    .aside {
      width: 80px;
      position: fixed;
      top: 50px;
      left: 0;
      overflow-y: auto;
      height: calc(100% - 100px);
    }

    .content {
      width: calc(100% - 80px);
      // background: pink;
      position: fixed;
      top: 55px;
      right: 0;
      overflow-y: auto;
      height: calc(100% - 140px);

      .fill-img {
        width: 100%;

        img {
          width: 100%;
          display: block;
        }
      }

      .nav-box {
        position: fixed;
        left: 80px;
        top: 150px;
        width: 100%;
        overflow-x: auto;

        .nav {
          display: flex;
          // width: 600px;
          align-items: center;
          height: 40px;
          // line-height: 40px;
          background: pink;
          white-space: nowrap;

          .nav-text {
            border-radius: 5px;
            background: #efefef;
            padding: 5px;
            margin: 0 10px;
            color: #7f7f7f;

            &:nth-child(1) {
              margin-left: 5px;
            }
          }
        }

      }

      .title-box {
        background: #fff;
        text-align: left;
        font-size: 18px;
        padding-top: 20px;
        font-weight: bold;
      }

      .products {
        .expand-true {
          margin-bottom: 10px;
        }

        .e2 {
          display: flex;
          flex-wrap: wrap;
          background: #fff;

          .expand-false {
            width: 33%;
          }

        }
      }
    }
  }
}
</style>

<!-- 数据结构
productData=[
  {
    'Xiaomi MIX系列':{
      {action: {…}, cat_id: 0, comments_total: '', is_multi_price: true, is_stock: true, …},
      {action: {…}, cat_id: 0, comments_total: '', is_multi_price: true, is_stock: true, …},
      {action: {…}, cat_id: 0, comments_total: '', is_multi_price: false, is_stock: false, …}
    }
  }
]
-->