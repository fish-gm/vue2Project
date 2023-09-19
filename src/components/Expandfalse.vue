<template>
  <div>
    <div class="pro">
      <div class="img-box">
        <img v-lazy="product.img_url" class="auto-img">
      </div>
      <div class="text">{{ product.product_name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Expandfalse',
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
.pro {
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  .img-box {
    min-height: 80px;
    width: 90%;
    height: 90%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

    img {
      width: 100%;
      display: block;
    }
  }

  .text {
    color: grey;
    margin-bottom: 10px;
  }

}
</style>