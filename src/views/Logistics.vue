<template>
  <div class="logistics">
    <div class="nav">
      <van-nav-bar title="当前产品物流状态" left-arrow @click-left="clickReturn" />
    </div>

    <div class="content-box">
      <div class="item" v-for="(item, index) in curPro">
        <div class="img-box">
          <img :src="item.imgUrl">
        </div>
        <div class="text">
          <div class="name-box">
            <div class="name">{{ item.firstName }}</div>
            <div class="name">{{ item.secondName }}</div>
          </div>
          <div class="price">&yen;{{ item.originalPrice }}&nbsp;&nbsp;&nbsp;X{{ item.count }}</div>
        </div>
      </div>
    </div>

    <van-steps direction="vertical" :active="0">
      <van-step>
        <h3>等待商家发货</h3>
        <p>{{ curPro[0].payTime }}</p>

      </van-step>
      <van-step>
        <h3>预计发货时间</h3>
        <p>预计 {{ payTime }} 发货</p>
      </van-step>
      <van-step>
        <h3>等待快递揽收</h3>
        <p></p>
      </van-step>
    </van-steps>
  </div>
</template>

<script>
import { getLocalArr, loginPhone, setLocalData } from '../api/my.js'
export default {
  name: 'Logistics',
  data() {
    return {
      payTime: '',
      curPro: []
    }
  },
  created() {
    let selectP = getLocalArr('paidProducts');

    let productId = this.$route.params.product_id;

    this.curPro = selectP.filter(val => {
      return val.productId === productId && val.phone === loginPhone();
    })

    console.log(this.curPro);

    // 等待商家发货时间
    function addOneDayToDateString(dateString) {
      // 将时间字符串转换为 Date 对象
      const date = new Date(dateString);
      // 增加一天
      date.setDate(date.getDate() + 1);
      // 将增加一天后的 Date 对象转换为字符串
      const tomorrowString = date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      // 返回增加一天后的时间字符串
      return tomorrowString;
    }
    const currentDateString = this.curPro[0].payTime;
    this.payTime = addOneDayToDateString(currentDateString);

  },

  methods: {
    clickReturn() {
      this.$router.push({ name: 'My' });
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: #929292;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

.logistics {
  text-align: left;

  .content-box {
    margin-top: 50px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .item {
      width: 100%;
      height: 360px;
      background: #fff;

      .img-box {
        width: 96%;
        margin-left: 2%;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          display: block;
        }
      }

      .text {
        height: 60px;
        padding-left: 10px;
        font-size: 16px;
        text-align: left;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .name-box {
          .name {
            /* 溢出隐藏 */
            overflow: hidden;
            /* 纯英文换行 */
            word-break: break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            /* 这里是超出几行省略 */
            -webkit-line-clamp: 2;
          }
        }

        .price {
          margin-top: 10px;
          margin-right: 10px;
          font-weight: bold;
          color: #f52f32;
          text-align: center;
        }

        .del {
          text-align: right;
          padding-right: 10px;
          color: #999;
        }
      }
    }
  }
}
</style>