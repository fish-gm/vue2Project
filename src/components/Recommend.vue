<template>
  <div class="recom" v-if="isFlag">
    <!-- 轮播图 -->
    <van-swipe :autoplay="3000" indicator-color="#bfbfbf" height="187">
      <div v-for="(image, index) in images" :key="index">
        <van-swipe-item>
          <img v-lazy="image" />
        </van-swipe-item>
      </div>
    </van-swipe>

    <!-- 活动 -->
    <div class="item-10">
      <div class="items-box">
        <div class="item" v-for="(item1, index) in itemsBoxData1">
          <img v-lazy="item1.img_url">
        </div>
      </div>
      <div class="items-box">
        <div class="item" v-for="(item2, index) in itemsBoxData2">
          <img v-lazy="item2.img_url">
        </div>
      </div>
    </div>

    <!-- <div style="width: 100vw; height: 2000px; background-color: pink;"></div> -->

    <!-- 小米 -->
    <div class="x">
      <div class="xiaomi-box clearfix1">
        <div class="xiaomi-1" :data-id="material[0].material_id">
          <img v-lazy="material[0].img_url">
        </div>
        <div class="xiaomi-2" :data-id="material[1].material_id">
          <img v-lazy="material[1].img_url">
        </div>
        <div class="xiaomi-3" :data-id="material[2].material_id">
          <img v-lazy="material[2].img_url">
        </div>
      </div>
    </div>

    <div class="hot">
      <img v-lazy="cellsAutoFill[0].img_url">
    </div>

    <!-- 手机产品 -->
    <div class="products">
      <div class="product" :data-id="item.product_id" v-for="(item, index) in productListPhone" @click="toPage(item.product_id)">
        <Pro :product="item"></Pro>
      </div>
    </div>

    <!-- 分页 -->
    <div class="more">更多小米手机产品 &gt; </div>
    <div class="hot" @click="toPage(cellsAutoFill[1].product_id)">
      <img v-lazy="cellsAutoFill[1].img_url">
    </div>
    <div class="more">更多小米电视产品 &gt; </div>
    <div class="hot" @click="toPage(cellsAutoFill[2].product_id)">
      <img v-lazy="cellsAutoFill[2].img_url">
    </div>

    <!-- 电脑产品 找不到接口-->
    <div class="products">
      <div class="product" :data-id="item.product_id" v-for="(item, index) in productListCom">
        <Pro :product="item"></Pro>
      </div>
    </div>
    <div class="more">更多小米笔记本产品 &gt; </div>
    <div class="hot" @click="toPage(cellsAutoFill[3].product_id)">
      <img v-lazy="cellsAutoFill[3].img_url">
    </div>
    <div class="more">更多小米家电产品 &gt; </div>
    <div class="more">更多小米智能产品 &gt; </div>

    <div class="products">
      <div class="product" :data-id="item.ad_position_id" v-for="(item, index) in sortPic">
        <img v-lazy="item.img_url">
      </div>
    </div>


    <div class="last-pic">
      <img v-lazy="lastPic">
    </div>


  </div>
</template>

<script>
import { getRecSlideshow, categoryData, getDetail } from '../api/api.js'
import Pro from '../components/Pro.vue'

export default {
  name: 'Recommend',
  components: {
    Pro,
  },
  data() {
    return {
      // 首页数据部分
      sections: [],
      // 轮播图数据
      slideshowData: [],
      // 轮播图图片
      images: [],

      // 米金商城
      itemsBoxData1: [],
      itemsBoxData2: [],

      material: [],

      // 产品
      productListPhone: [],
      productListCom: [],

      // 满屏图片
      cellsAutoFill: [],

      // 分类图片
      sortPic: [],

      lastPic: '',

      isFlag: false,
      isGetDetail: false,
    }
  },

  mounted() {
    // 获取轮播图图片
    getRecSlideshow().then(res => {
      // 判断数据是否加载完成
      this.isFlag = true;

      this.sections = res.data.data.data.sections;
      this.slideshowData = this.sections[0]?.body.items;
      // console.log('this.sections => ', this.sections);

      this.material = [
        this.sections[4].body.items[0],
        this.sections[4].body.items[1],
        this.sections[4].body.items[2],
      ];
      // console.log(this.material);

      // 轮播图图片路径
      for (let i = 0; i < this.sections[0]?.body.items.length; i++) {
        this.images.push(this.slideshowData[i].img_url);
      }

      // console.log(this.slideshowData);
      // 米金商城
      this.itemsBoxData1 = this.sections[1]?.body.items;
      this.itemsBoxData2 = this.sections[2]?.body.items;

      this.sections.forEach(item => {
        // 手机电脑产品
        if (item.view_type === 'list_two_type13') {
          if (this.productListPhone.length < 8) {
            this.productListPhone.push(...item.body.items);
          } else {
            this.productListCom.push(...item.body.items);
          }
        }
        // 满屏图片
        if (item.body.w === 720 && item.body.h === 440) {
          this.cellsAutoFill.push(...item.body.items);
        }

        // 分类图片
        if (item.body.w === 720 && item.body.h === 480) {
          this.sortPic.push(...item.body.items);
        }
        if (item.body.w === 720 && item.body.h === 280) {
          this.lastPic = item.body.items[0].img_url;
        }

      });

    }).catch(err => {
      console.log('Recommend err => ', err);
    })
  },

  methods: {
    toPage(id) {
      // 商品详情页面
      getDetail(id).then(res => {
        // console.log(id);
        this.isGetDetail = true;
        // 跳转到详情页面
        if (res.data.data) {
          this.$router.push({ name: 'Detail', params: { product_id: id } });
        }
        // 跳转到分类页面
        else {
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
// 轮播图
.van-swipe-item {
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.item-10 {
  background: #fff;

  .items-box {
    display: flex;
    justify-content: space-between;

    .item {
      width: 75px;
      // background: pink;

      img {
        width: 100%;
        display: block;
      }
    }

  }
}

.x {
  height: 270px;

  .xiaomi-box {
    background: #fff;
    position: relative;

    .xiaomi-1 {
      width: calc(50% - 5px);
      position: absolute;
      left: 5px;
      top: 0;

      img {
        width: 100%;
        height: 270px;
        display: block;
      }
    }

    .xiaomi-2 {
      position: absolute;
      width: calc(50% - 5px);
      right: 5px;
      top: 135px;

      img {
        width: 100%;
        height: 135px;
        display: block;
      }
    }

    .xiaomi-3 {
      width: calc(50% - 5px);
      right: 5px;
      top: 0px;
      position: absolute;

      img {
        width: 100%;
        height: 135px;
        display: block;
      }
    }

    img {
      width: 100%;
      display: block;
    }
  }
}

.hot {
  width: 100%;
  // position: relative;

  img {
    width: 100%;
    display: flex;
  }
}

// 手机产品
.products {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;

  .product {
    margin-bottom: 5px;
    width: 49%;
    height: 220px;
    padding: 3px;
    background: #ddd;
    border: 1px solid transparent;
    box-sizing: border-box;
    background: #fff;
    // overflow: hidden;
  }

  img {
    width: 100%;
    display: block;
  }
}

.more {
  width: 100%;
  margin: 5px auto;
  text-align: center;
  background: #fff;
  line-height: 40px;
  height: 40px;
  color: #6b6969;
}

.last-pic {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;

  img {
    width: 100%;
    display: block;
  }
}
</style>