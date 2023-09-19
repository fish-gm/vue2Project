<template>
  <div class="add">
    <div class="nav">
      <van-nav-bar :title="aid ? '编辑地址' : '新增地址'" left-arrow @click-left="navReturn" />
    </div>

    <div class="bg"></div>

    <div class="address-box">
      <van-address-edit :area-list="areaList" :address-info="addressInfo" show-postal show-delete show-set-default
        :search-result="searchResult" :area-columns-placeholder="['选择省', '选择市', '选择区']" @save="saveAddress"
        @delete="deleteAddress" />
    </div>

  </div>
</template>

<script>

import { areaList } from '@vant/area-data';
import { isEqual } from 'lodash';
import { getArrWithPhone, setWithPhone, getWithPhone } from '../api/my.js'

export default {
  name: 'NewAddress',
  data() {
    return {
      areaList,
      searchResult: [],

      addressInfo: {
        // name: '小米',
        // tel: 15200001111,
        // areaCode: '150524',
        // province: '内蒙古自治区',
        // county: '库伦旗',
        // city: '通辽市',
        // addressDetail: '102号',
        // postalCode: 123456,
        // isDefault: true
      },

      aid: '',
      // 本地存储 适配地址列表的数组
      addressMsg: [],
      // 原始的地址数据
      oriAddressMsg: [],
      // token: localStorage.getItem('token')
      token: null
    }
  },
  created() {
    // 获取本地登录
    let curLogin = localStorage.getItem('curLogin');
    // let curLogin = getWithPhone('curLogin');
    if (curLogin !== null) {
      curLogin = JSON.parse(curLogin);
      this.token = curLogin.token;
    }

    // console.log('curLogin', curLogin);
    // console.log('this.token', this.token);

    // 获取本地存储的地址信息
    // let localAddress = localStorage.getItem('addressMsg');
    let localAddress = getWithPhone('addressMsg');
    if (localAddress === null) {
      localAddress = [];
    } else {
      localAddress = JSON.parse(localAddress);
    }

    this.addressMsg = [...localAddress];
    // 获取本地存储的原始地址信息
    // let oriLocalAddress = localStorage.getItem('oriAddressMsg');
    let oriLocalAddress = getWithPhone('oriAddressMsg');
    if (oriLocalAddress === null) {
      oriLocalAddress = [];
    } else {
      oriLocalAddress = JSON.parse(oriLocalAddress);
    }

    this.oriAddressMsg = [...oriLocalAddress];

    // console.log(this.addressMsg);

    // 存在aid 当前地址为所编辑的地址
    this.aid = this.$route.params.aid;
    if (this.aid !== undefined) {
      this.oriAddressMsg.forEach(val => {
        if (val.id === this.aid) {
          this.addressInfo = { ...val };
        }
      })
    } else {
      this.addressInfo = {};
    }

  },
  computed: {

  },
  methods: {
    generateId() {
      const characters = '0123456789';
      let id = '';
      for (let i = 0; i < 10; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return id;
    },
    navReturn() {
      this.$router.back();
    },
    contactData(content) {
      // 拼接数据
      let contentData = '';
      for (let key in content) {
        content[key] = key == 'isDefault' ? Number(content[key]) : content[key];
        contentData += (key + '=' + content[key] + '&');
      }
      contentData += `appkey=${this.appkey}`;
      return contentData;
    },
    // 改变默认地址
    changeDefault(copyContent, content, aid) {
      if (this.addressMsg.length <= 0) {
        return;
      }
      // 是否存在默认地址
      let isExistDefault = false;
      // 如果当前地址为默认地址 设其他的地址都不是默认地址
      for (let i = 0; i < this.addressMsg.length; i++) {
        if (copyContent.isDefault) {
          isExistDefault = true;
          this.addressMsg[i].isDefault = false;
          this.oriAddressMsg[i].isDefault = false;
          // console.log(this.addressMsg[i]);
        } else {
          // 除了当前的地址 其他的地址中存在默认地址
          if (this.addressMsg[i].isDefault && this.addressMsg[i].id != copyContent.id) {
            isExistDefault = true;
          }
        }
      }
      // console.log('isExistDefault', isExistDefault);
      // 如果不存在默认地址，设第一个为默认地址
      if (!isExistDefault) {
        console.log('不存在默认地址');

        // 如果全部没有默认并且取消第一个的默认
        if (aid === this.addressMsg[0].id) {
          copyContent.isDefault = true;
          content.isDefault = true;
        } else {
          this.addressMsg[0].isDefault = true;
          this.oriAddressMsg[0].isDefault = true;
        }
      }

      // console.log('this.addressMsg', this.addressMsg);
      // console.log('this.oriAddressMsg', this.oriAddressMsg);
    },

    // 保存地址 content为表单数据
    saveAddress(content) {
      // console.log('content', content);
      // return;
      // let copyContent = { ...content };
      let copyContent = {};
      let id = this.aid ? this.aid : this.generateId();
      copyContent.id = id;
      content.id = id;
      copyContent.name = content.name;
      copyContent.tel = content.tel;
      copyContent.address = content.province + content.city + content.county + content.addressDetail;
      copyContent.isDefault = content.isDefault;

      // 判断地址是否存在
      let isAddressExist = this.addressMsg.length > 0 ? true : false;
      // console.log(isAddressExist);
      // console.log(this.addressMsg);
      for (let i = 0; i < this.addressMsg.length; i++) {
        // console.log(id, this.aid, this.addressMsg[i].id);
        // 用aid判断
        // 如果传了aid 则编辑 否则增加
        if (this.aid) {
          if (this.aid === this.addressMsg[i].id) {
            for (let key in this.addressMsg[i]) {
              if (key != 'id') {
                if (copyContent[key] != this.addressMsg[i][key]) {
                  isAddressExist = false;
                }
              }
            }
          }
        } else {
          isAddressExist = false;
        }

      }

      // console.log('isAddressExist', isAddressExist);
      if (isAddressExist) {
        this.$toast('该地址已存在');
        return;
      }

      // console.log('this.token', this.token);
      // console.log(this.aid);
      if (this.token === null) {
        console.log(2222);
        this.$toast('未登录，请先登录');
        setTimeout(() => {
          this.$router.push({ name: 'Login' });
        }, 300)
      }

      // 新增地址
      if (this.aid === undefined && this.token != null) {
        console.log('添加地址');
        // 改变默认地址
        this.changeDefault(copyContent, content, this.aid);

        this.addressMsg.push(copyContent);
        this.oriAddressMsg.push(content);
        // 放进本地存储
        // localStorage.setItem('addressMsg', JSON.stringify(this.addressMsg));
        // localStorage.setItem('oriAddressMsg', JSON.stringify(this.oriAddressMsg));
        setWithPhone('addressMsg', JSON.stringify(this.addressMsg));
        setWithPhone('oriAddressMsg', JSON.stringify(this.oriAddressMsg));
        this.$toast('添加地址成功');
        setTimeout(() => {
          this.$router.back();
        }, 500)
      }

      // 编辑地址
      if (this.aid !== undefined && this.token != null) {
        console.log('编辑地址');
        // 改变默认地址
        this.changeDefault(copyContent, content, this.aid);

        // 替换原来的地址
        for (let i = 0; i < this.oriAddressMsg.length; i++) {
          if (this.oriAddressMsg[i].id === this.aid) {
            this.oriAddressMsg[i] = content;
            this.addressMsg[i] = copyContent;
          }
        }

        // console.log('this.addressMsg', this.addressMsg);
        // console.log('this.oriAddressMsg', this.oriAddressMsg);

        // 放进本地存储
        // localStorage.setItem('addressMsg', JSON.stringify(this.addressMsg));
        // localStorage.setItem('oriAddressMsg', JSON.stringify(this.oriAddressMsg));
        setWithPhone('addressMsg', JSON.stringify(this.addressMsg));
        setWithPhone('oriAddressMsg', JSON.stringify(this.oriAddressMsg));
        this.$toast('修改地址成功');
        setTimeout(() => {
          this.$router.back();
        }, 500)
      }

      // 清空表单数据
      for (let key in this.addressInfo) {
        this.addressInfo[key] = null;
      }
      // return;
    },

    // 删除地址
    deleteAddress() {
      console.log(this.addressInfo.isDefault);
      let index = this.oriAddressMsg.findIndex(item => {
        return item.id === this.addressInfo.id;
      });
      this.oriAddressMsg.splice(index, 1);
      this.addressMsg.splice(index, 1);

      // 当前删除的为默认地址
      if (this.addressInfo.isDefault) {
        console.log('当前删除的为默认地址');
        this.addressMsg[0].isDefault = true;
        this.oriAddressMsg[0].isDefault = true;
      }

      // 放进本地存储
      // localStorage.setItem('addressMsg', JSON.stringify(this.addressMsg));
      // localStorage.setItem('oriAddressMsg', JSON.stringify(this.oriAddressMsg));
      setWithPhone('addressMsg', JSON.stringify(this.addressMsg));
      setWithPhone('oriAddressMsg', JSON.stringify(this.oriAddressMsg));

      this.addressInfo = {};
      setTimeout(() => {
        this.$router.back();
      }, 500)

    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: #000;
  font-size: 18px;
}

// 保存按钮
::v-deep .van-address-edit__fields {
  background: #fff;

}

::v-deep .van-button--danger {
  background: #ec6617;
  border: 0.02667rem solid #ec6617;
}

::v-deep .van-switch--on {
  background: #ec6617;
}

.bg {
  height: 150px;
  // background: rgb(200, 198, 198);
  background: #f9833f;

}

.address-box {
  position: fixed;
  top: 130px;
  width: 100%;

}
</style>

<!-- data: `name=${content.name}&tel=${content.tel}&province=${content.province}&city=${content.city}&county=${content.county}&addressDetail=${content.addressDetail}&areaCode=${content.areaCode}&postalCode=${content.postalCode}&isDefault=${Number(content.isDefault)}&appkey=${this.appkey}`, -->