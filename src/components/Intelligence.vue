<template>
  <div v-if="isFlag">
    <!-- 轮播图 -->
    <van-swipe :autoplay="3000" indicator-color="#bfbfbf" height="187">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>


    <!-- 活动 -->
    <div class="item-10">
      <div class="items-box">
        <div class="item" v-for="(item, index) in itemsBoxData">
          <img :src="item.img_url">
        </div>
      </div>
    </div>

    <div class="hot">
      <div class="h" v-for="(item, index) in hot">
        <img :src="item.img_url">
      </div>
    </div>

    <!-- 横幅 -->
    <div class="hot">
      <div class="h">
        <img :src="banner[0]">
      </div>
    </div>

    <!-- 产品 -->
    <div class="products">
      <div class="product" :data-id="item.product_id" v-for="(item, index) in products.pro1" @click="toPage(item.product_id)">
        <Pro :product="item"></Pro>
      </div>
    </div>

    <!-- 横幅 -->
    <div class="hot">
      <div class="h">
        <img :src="banner[1]">
      </div>
      <div class="h">
        <img :src="banner[2]">
      </div>
    </div>

    <!-- 产品 -->
    <div class="products">
      <div class="product" :data-id="item.product_id" v-for="(item, index) in products.pro2" @click="toPage(item.product_id)">
        <Pro :product="item"></Pro>
      </div>
    </div>

    <!-- 横幅 -->
    <div class="hot">
      <div class="h">
        <img :src="banner[3]">
      </div>
      <div class="h">
        <img :src="banner[4]">
      </div>
      <div class="h">
        <img :src="banner[5]">
      </div>
    </div>

    <!-- 产品 -->
    <div class="products">
      <div class="product" :data-id="item.product_id" v-for="(item, index) in products.pro3" @click="toPage(item.product_id)">
        <Pro :product="item"></Pro>
      </div>
    </div>

    <!-- 横幅 -->
    <div class="hot">
      <div class="h">
        <img :src="banner[6]">
      </div>
      <div class="h">
        <img :src="banner[7]">
      </div>
      <div class="h">
        <img :src="banner[8]">
      </div>
    </div>

    <!-- 产品 -->
    <div class="products">
      <div class="product" :data-id="item.product_id" v-for="(item, index) in products.pro4"
        @click="toPage(item.product_id)">
        <Pro :product="item"></Pro>
      </div>
    </div>

    <div class="hot">
      <div class="h">
        <img :src="lastPic">
      </div>
    </div>

  </div>
</template>

<script>
import { PageTypeActivity } from '../api/api.js'
import { getRecSlideshow, categoryData, getDetail } from '../api/api.js'
import Pro from '../components/Pro.vue'


export default {
  name: 'Intelligence',
  components: {
    Pro
  },
  data() {
    return {
      isFlag: false,
      sections: [],
      // 轮播图
      images: [],
      // 活动
      itemsBoxData: [],
      // 热卖产品
      hot: [],
      banner: [],
      products: {
        pro1: [],
        pro2: [],
        pro3: [],
        pro4: []
      },
      lastPic: []

    }
  },
  created() {
    PageTypeActivity(10288).then(res => {
      this.isFlag = true;
      this.sections = res.data.data.data.sections;

      // console.log('Intelligence this.sections => ', this.sections);
      this.sections.forEach(value => {
        // 轮播图
        if (value.view_type === 'gallery') {
          // console.log('轮播图', value.body.items);
          value.body.items.forEach(ite => {
            this.images.push(ite.img_url);
          });
        }

        // 爆款新品
        if (value.body.w === 720 && value.body.h === 152) {
          this.itemsBoxData.push(...value.body.items);
        }

        // console.log(this.itemsBoxData);

        // 热卖产品
        if (value.body.w === 720 && value.body.h === 112) {
          this.hot.push(...value.body.items);
        }

        // 横幅图片 小家电
        if (value.body.w === 720 && value.body.h === 80) {
          value.body.items.forEach(ite => {
            this.banner.push(ite.img_url);
          });
        }

        // console.log(this.banner[0]);

        // 产品
        if (value.view_type === 'list_three_type4') {
          if (this.products.pro1.length < 3) {
            this.products.pro1.push(...value.body.items);
          } else if (this.products.pro2.length < 3) {
            this.products.pro2.push(...value.body.items);
          } else if (this.products.pro3.length < 6) {
            this.products.pro3.push(...value.body.items);
          } else {
            this.products.pro4.push(...value.body.items);
          }
        }

        // 横幅图片 小家电
        if (value.body.w === 720 && value.body.h === 280) {
          value.body.items.forEach(ite => {
            this.lastPic = ite.img_url;
          });
        }
        // console.log(this.lastPic);
      });

    }).catch(err => {
      console.log('Intelligence err => ', err);
    })



    // console.log('this=>',this);
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
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      width: 20%;
      background: #fff;

      img {
        width: 100%;
        display: block;
      }
    }

  }
}

.hot {
  .h {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;

    img {
      width: 100%;
      display: block;
    }
  }
}

.banner {
  width: 100%;
}

// 手机产品
.products {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;

  .product {
    margin-bottom: 5px;
    width: 33.3%;
    // width: 120px;
    // height: 6.3rem;
    height: 180px;
    // padding: 3px;
    background: #ddd;
    border: 1px solid transparent;
    box-sizing: border-box;
    background: #fff;
  }

  img {
    width: 100%;
    display: block;
  }
}
</style>