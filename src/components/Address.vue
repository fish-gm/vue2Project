<template>
  <div class="address">
    <!-- 地址选择 -->
    <div class="popup-add" v-if="isLog">
      <van-cell is-link @click="showPopupAdd">
        <div class="already-select">
          <span v-if="!Boolean(selected.tel)">选择地址</span>
          <div class="main" v-show="Boolean(selected.tel)">
            <span>{{ selected.name }}&nbsp;</span>
            <span>{{ selected.tel }}</span>
          </div>
          <div class="sec">{{ selected.selectAddress }}</div>
        </div>
      </van-cell>
      <van-popup v-model="showSelectAddress" position="bottom" :style="{ height: '30%' }" closeable>
        <div class="address-content">
          <div class="no-address" v-show="addList.length === 0">
            <van-empty description="您还没有添加地址，快去添加一个吧！" />
          </div>
          <van-address-list v-model="chosenAddressId" :list="addList" default-tag-text="默认" @add="addAddress"
            @edit="editAddress" @select="toggleAddress" />
        </div>
      </van-popup>
    </div>

    <div class="select-add" v-else @click="noLogin">
      <span>选择地址</span>
      <span><van-icon name="arrow" /></span>
    </div>
  </div>
</template>

<script>
import { isLogin,getWithPhone } from "../api/my.js";

export default {
  name: 'Address',
  data() {
    return {
      showSelectAddress: false,
      chosenAddressId: '',
      selected: {
        name: '',
        tel: '',
        selectAddress: '',
      },
      addList: [
        // {
        //   id: '1',
        //   name: '张三',
        //   tel: '13000000000',
        //   address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
        //   isDefault: true,
        // },
        // {
        //   id: '2',
        //   name: '李四',
        //   tel: '1310000000',
        //   address: '浙江省杭州市拱墅区莫干山路 50 号',
        // },
      ],

      isLog: isLogin(),

      // isExistAddress: true,

    }
  },
  created() {

    // 获取本地地址
    // let getAdd = localStorage.getItem('addressMsg');
    let getAdd = getWithPhone('addressMsg');
    if (getAdd === null) {
      getAdd = [];
    } else {
      getAdd = JSON.parse(getAdd);
    }

    if (getAdd.length <= 0) {
      this.isExistAddress = false;
    }

    // console.log('getAdd', getAdd);

    getAdd.forEach(val => {
      if (getAdd.length === 1) {
        this.chosenAddressId = val.id;
        // console.log(val);
        this.selected.name = val.name;
        this.selected.tel = val.tel;
        this.selected.selectAddress = val.address;
      }
      if (val.isDefault) {
        this.chosenAddressId = val.id;
        // console.log(val);
        this.selected.name = val.name;
        this.selected.tel = val.tel;
        this.selected.selectAddress = val.address;
        // console.log(val);
      }
    })
    this.addList = getAdd;

    // console.log('this.selected', this.selected);

  },
  methods: {
    showPopupAdd() {
      this.showSelectAddress = true;
    },
    // 跳转到新增地址页面
    addAddress() {
      // this.$toast('加载中...');
      this.$router.push({ name: 'NewAddress' });
    },
    editAddress(item, index) {
      // this.$toast('加载中...');
      this.$router.push({ name: 'NewAddress', params: { aid: item.id } });
    },
    // 切换地址
    toggleAddress(item, index) {
      console.log(item, index);
      this.selected.name = item.name;
      this.selected.tel = item.tel;
      this.selected.selectAddress = item.address;
    },
    noLogin() {
      // 判断是否登录
      if (!this.isLog) {
        this.$toast('请先登录');
        setTimeout(() => {
          this.$router.push({ name: 'Login' });
        });
        return;
      }
    },

  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-popup--bottom {
  height: 70% !important;
}

// 弹出框的X
::v-deep .van-popup__close-icon--top-right {
  font-size: 12px;
  top: 10px;
}

// 地址
::v-deep .van-tag--danger {
  border: 1px solid #ff6620;
  background: #ff6620;
}

::v-deep .van-button--danger {
  border: 1px solid #ff6620;
  background: #ff6620;
}

::v-deep .van-address-item .van-radio__icon--checked .van-icon {
  border: 1px solid #ff6620;
  background: #ff6620;
}

::v-deep .van-cell--clickable {
  display: flex;
  align-items: center
}

.address {
  margin-bottom: 10px;
}

// 选择规格/地址
.popup-add,
.popup {
  .already-select {
    // margin-top: 30px;
    // display: flex;
    font-size: 12px;

    .main {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .address-content {
    .van-empty {
      margin-top: 60px;
    }

    .a-text {
      text-align: center;
      width: 90vw;
      position: fixed;
      bottom: 10px;
      left: 5vw;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      color: #fff;
      background: #0c34ba;
    }

  }
}

.select-add {
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-weight: bold;
}
</style>