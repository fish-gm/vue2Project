<template>
  <div>
    <div class="pros">
      <div class="img-box">
        <img v-lazy="product.puzzle_url" class="auto-img">
      </div>
      <div class="text-box">
        <div class="name">{{ product.name }}</div>
        <div class="price-box">
          <div class="price">&yen;{{ product.price }}{{ product.is_multi_price == true ? '&nbsp;起' : '' }}</div>
          <div class="s-new" v-if="product.is_multi_price">上新</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Expandtrue',
  props: {
    product: {
      type: Object,
      default() {
        return {};
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pros{
  background: #fff;
  display: flex;
  align-items: center;
  .img-box{
    margin: 5px;
    width: 70px;
    height: 100%;
    min-height: 70px;
    img{
      width: 100%;
      display: block;
    }
  }
  .text-box{
    // margin-left: 5px;
    color: #414141;
    .name{
      padding: 5px;
    }
    .price-box{
      padding: 5px;
      display: flex;
      .s-new{
        font-size: 12px;
        color: #ecad6f;
        border: 1px solid #ecad6f;
        padding: 1px 2px;
        margin-left: 10px;
        margin-top: -5px;
      }
    }
    
  }
}
</style>