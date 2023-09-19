<template>
  <div class="pro">
    <div class="img-box">
      <img :src="product.img_url" class="auto-img">
    </div>
    <div class="name en-name">{{product.product_name}}</div>
    <div class="name ch-name">{{product.product_brief}}</div>
    <div class="price">&yen;{{product.product_price}}{{ product.show_price_qi==true?'&nbsp;起':'' }}</div>
    <!-- <div class="buy">立即购买</div> -->
  </div>
</template>

<script>
export default {
  name: 'Pro',
  props: {
    product: {
      type:Object,
      default(){
        return {};
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pro {
  // width: 50%;
  // height: 250px;
  // margin-bottom: 5px;
  // background: #ddd;
  // border: 1px solid transparent;
  // box-sizing: border-box;

  .img-box {
    margin: 3px auto;
    min-height: 100px;
    // background: pink;
    // width: 179px;
    // height: 146px;
    overflow: hidden;

    .auto-img {
      width: 100%;
      display: block;
    }
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

  // .buy {
  //   width: 100px;
  //   height: 30px;
  //   margin: 3px auto;
  //   background: #ee574f;
  //   color: #fff;
  //   line-height: 30px;
  //   border-radius: 5px;
  // }


}</style>