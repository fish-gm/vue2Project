<template>
  <div v-if="isFlag">

    <div class="hot" v-for="(item, index) in cellsAutoFillOne">
      <img :src="item.img_url">
      <div class="products" v-if="index == 0">
        <div class="product" v-for="(itemPro, index) in listOneType14" @click="toPage(itemPro.product_id)">
          <Pro :product="itemPro"></Pro>
        </div>
      </div>
    </div>

    <div class="last">
      <img :src="item.img_url" v-for="(item, index) in cellsAutoFillTwo">
    </div>


  </div>
</template>

<script>
import { PageTypeActivity,getDetail } from '../api/api.js'
import Pro from '../components/Pro.vue'

export default {
  name: 'Notebook',
  components: {
    Pro
  },
  data() {
    return {
      isFlag: false,
      sections: [],
      cellsAutoFillOne: [],
      cellsAutoFillTwo: [],
      listOneType14: [],
    }
  },
  created() {
    PageTypeActivity(13176).then(res => {
      this.isFlag = true;
      this.sections = res.data.data.data.sections;

      this.sections.forEach(ite => {
        // 产品
        if (ite.view_type === 'list_one_type14') {
          this.listOneType14.push(...ite.body.items)
        }

        if (ite.view_type === 'cells_auto_fill') {
          // 满屏图片
          if (this.cellsAutoFillOne.length < 5) {
            this.cellsAutoFillOne.push(...ite.body.items);
          } else {
            // 电脑图片
            this.cellsAutoFillTwo.push(...ite.body.items)
          }
        }
      })

      // console.log(this.cellsAutoFillOne);
      // console.log(this.cellsAutoFillTwo);
      // console.log(this.cellsAutoFill);

    }).catch(err => {
      console.log('Television err=>', err);
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
.hot {
  img {
    width: 100%;
    display: block;
  }
}

.last {
  img {
    width: 50%;
    display: inline-block;
  }
}
</style>