<template>
  <div v-if="isFlag">
    <!-- <h2>Television</h2> -->

    <div class="hot" v-for="(item, index) in datas.cellsAutoFill">
      <img :src="item.img_url">
      <div v-if="index === 1" class="products">
        <div class="product" v-for="(item1, index) in datas.listTwoType14One" @click="toPage(item1.product_id)">
          <Pro :product="item1"></Pro>
        </div>
      </div>
      <div v-if="index === 4" class="products">
        <div class="product" v-for="(item2, index) in datas.listTwoType14Two" @click="toPage(item2.product_id)">
          <Pro :product="item2"></Pro>
        </div>
      </div>
      <div v-if="index === 4" class="products-three">
        <div class="product-three" v-for="(item3, index) in datas.listThreeType4">
          <div class="pro" @click="toPage(item3.product_id)">
            <div class="img-box">
              <img :src="item3.img_url" class="auto-img">
            </div>
            <div class="name en-name">{{ item3.product_name }}</div>
            <div class="name ch-name">{{ item3.product_brief }}</div>
            <div class="price">&yen;{{ item3.product_price }}{{ item3.show_price_qi == true ? '&nbsp;起' : '' }}</div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { PageTypeActivity,getDetail } from '../api/api.js'
import Pro from '../components/Pro.vue'

export default {
  name: 'Television',
  components: {
    Pro
  },
  data() {
    return {
      isFlag: false,
      sections: [],
      datas: {
        cellsAutoFill: [],
        listTwoType14One: [],
        listTwoType14Two: [],
        listThreeType4: [],

      }
    }
  },
  created() {
    PageTypeActivity(19071).then(res => {
      this.isFlag = true;
      this.sections = res.data.data.data.sections;

      this.sections.forEach(ite => {
        // 产品
        if (ite.view_type === 'list_two_type14') {
          if (this.datas.listTwoType14One.length == 0) {
            this.datas.listTwoType14One.push(...ite.body.items);
          } else {
            this.datas.listTwoType14Two.push(...ite.body.items)
          }
        }
        if (ite.view_type === 'list_three_type4') {
          this.datas.listThreeType4.push(...ite.body.items)
        }

        // 满屏图片
        if (ite.view_type === 'cells_auto_fill') {
          this.datas.cellsAutoFill.push(...ite.body.items)
        }
      })
      // console.log(this.datas);
    }).catch(err => {
      console.log('Television err=>', err);
    })
  },

  methods:{
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
.hot {
  width: 100%;

  img {
    width: 100%;
    display: flex;
  }
}

.products,
.products-three {
  background: #ffae99;
  display: flex;
  justify-content: space-around;

  .product {
    flex-grow: 1;
    padding: 5px;
    height: 230px;
    background: #fff;
    width: 45%;
  }

  .product-three {
    flex-grow: 1;
    width: 33%;
    background: #fff;
    .img-box{
      height: 140px;
    }
    .name {
      padding: 1px;
      /* 第一步：强制代码一行显示 */
      white-space: nowrap;
      /* 第二步：溢出部分内容隐藏 */
      overflow: hidden;
      /* 第三步：溢出部分内容使用省略号代码 */
      text-overflow: ellipsis;
      text-align: center;
    }

    .en-name {
      color: #000;
    }

    .ch-name {
      color: #666;
      font-size: 12px;
    }

    .price {
      color: #e43937;
      font-weight: bold;
    }
  }
}
</style>