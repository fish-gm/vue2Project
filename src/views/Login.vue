<template>
  <div class="login">
    <div class="nav">
      <van-nav-bar right-text="先逛逛" left-arrow @click-left="navReturn" @click-right="navLook" />
    </div>

    <div class="brief">
      <div class="b1">小米账号登录</div>
      <div class="img-box">
        <img src="../assets/icon-header-logo3.ddf2a1c313.png">
      </div>
      <div class="b2">让每个人都能享受科技的乐趣</div>
    </div>


    <!-- 登录 login -->
    <div class="form">
      <van-form @submit="login">
        <van-field v-model="LoginUserInfo.phone" name="手机号码" placeholder="请输入手机号码"
          :rules="[{ required: true, message: '请输入手机号码' }, { pattern: /^1[3-9]\d{9}$/, message: '手机格式错误' }]" />

        <van-field v-model="LoginUserInfo.password" :type="isOpenPassword ? 'text' : 'password'" name="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请输入密码' }, { pattern: /^[A-Za-z]\w{5,15}$/, message: '密码格式错误' }]"
          :right-icon="isOpenPassword ? 'eye-o' : 'closed-eye'" @click-right-icon="viewPassword" />

        <van-field name="radio">
          <template #input>
            <div class="agree">
              <input type="checkbox" class="check" v-model="isAgree" @change="clickAgree">
              <span>已阅读并同意小米账号<a href="#" class="link">&nbsp;用户协议&nbsp;</a>和<a href="#"
                  class="link">&nbsp;隐私政策&nbsp;</a></span>
            </div>
          </template>
        </van-field>

        <div style="margin: 16px;" class="login-btn">
          <van-button round block type="info" native-type="submit" :color="btnStatus.btnColor">登录</van-button>
        </div>


      </van-form>
    </div>

    <div class="select" @click="clickRegister">
      <span>未注册？</span>
      <span>立即注册</span>
    </div>

    <div class="tips">

      <div>提示：</div>
      <div class="tips-text">1.密码支持字母数字下划线组合，且必须以字母开头。</div>
      <div class="tips-text">2.昵称支持中英文组合。</div>

    </div>

    <!-- 注册弹窗 register -->
    <van-popup v-model="isRegister" position="bottom" closeable>
      <div class="r-box">
        <van-form @submit="register">
          <van-field v-model="registerUserInfo.phone" name="手机号码" placeholder="请输入手机号码" label="手机号"
            :rules="[{ required: true, message: '请输入手机号码' }, { pattern: /^1[3-9]\d{9}$/, message: '手机格式错误' }]" />

          <van-field v-model="registerUserInfo.password" :type="isOpenPassword ? 'text' : 'password'" name="密码"
            placeholder="密码(6-12位)" label="密码"
            :rules="[{ required: true, message: '请输入密码' }, { pattern: /^[A-Za-z]\w{5,15}$/, message: '密码格式错误' }]"
            :right-icon="isOpenPassword ? 'eye-o' : 'closed-eye'" @click-right-icon="viewPassword" />

          <van-field v-model="registerUserInfo.nickName" name="昵称" placeholder="昵称(1-8位)" label="昵称"
            :rules="[{ required: true, message: '请输入昵称' }, { pattern: /^[A-Za-z\u4e00-\u9fa5]{1,8}$/, message: '昵称格式错误' }]" />


          <div style="margin: 16px;" class="login-btn">
            <van-button round block type="info" native-type="submit">注册</van-button>
          </div>


        </van-form>
      </div>
    </van-popup>

  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
      radio: '1',
      isOpenPassword: false,
      isAgree: false,
      btnStatus: {
        btnColor: '#b5daff',
      },
      // 注册
      registerUserInfo: {
        phone: '',
        password: '',
        nickName: ''
      },
      registerMsg: [],
      // 是否弹出注册弹窗
      isRegister: false,

      // 登录
      LoginUserInfo: {
        phone: '',
        password: '',
      },


    }
  },
  created() {
    let regMsg = localStorage.getItem('registerMsg');
    if (regMsg === null) {
      regMsg = [];
    } else {
      regMsg = JSON.parse(regMsg);
    }
    this.registerMsg = regMsg;
    // console.log(registerMsg);
  },
  methods: {
    generateToken() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_+.,';
      let token = '';
      for (let i = 0; i < 100; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return token;
    },

    navReturn() {
      this.$router.back();
    },
    // 先逛逛
    navLook() {
      this.$router.push({ name: 'Classify' });
    },

    // 勾选同意 登录按钮变色
    clickAgree() {
      //   let isCom=true;
      //   if(this.isAgree){
      //     for(let k in this.LoginUserInfo){
      //       if(!this.LoginUserInfo){
      //         isCom=false;
      //       }
      //     }
      //   }
      //   if(isCom){
      //     this.btnStatus.btnColor='#1989fa';
      //   }
    },

    // 登录 login
    // 登录 login
    login() {
      console.log('登录信息', this.LoginUserInfo);
      if (!this.isAgree) {
        this.$toast('请勾选同意');
        return;
      }

      // console.log();
      this.btnStatus.btnColor = '#1989fa';
      // console.log(this.registerMsg);

      let existPhone = false;
      let curRightPass = '';
      let curReg = {};
      if (this.registerMsg.length > 0) {
        for (let i = 0; i < this.registerMsg.length; i++) {
          if (this.registerMsg[i].phone === this.LoginUserInfo.phone) {
            existPhone = true;
            curRightPass = this.registerMsg[i].password;
            // console.log('this.registerMsg[i]', this.registerMsg[i]);
            // console.log('this.LoginUserInfo', this.LoginUserInfo);
            curReg = this.registerMsg[i];
          }
          // if ((this.registerMsg[i].phone === this.LoginUserInfo.phone) && (this.registerMsg[i].password === this.LoginUserInfo.password)) {
          //   this.$toast('登录成功');
          //   this.LoginUserInfo = {};
          //   // 生成token
          //   const { v4: uuidv4 } = require('uuid');
          //   const token = this.generateToken() + uuidv4() + this.generateToken();
          //   // console.log(token);

          //   // 放进本地存储
          //   // localStorage.setItem('token', token)
          //   let curLogin = { ...this.registerMsg[i] };
          //   curLogin.token = token;
          //   localStorage.setItem('curLogin', JSON.stringify(curLogin))

          //   setTimeout(() => {
          //     this.$router.back();
          //   }, 300)

          //   return;
          // }
          // else if ((this.registerMsg[i].phone != this.LoginUserInfo.phone)) {
          //   // console.log(this.registerMsg[i].phone,this.LoginUserInfo.phone);
          //   // console.log(this.registerMsg[i].password,this.LoginUserInfo.password);
          //   this.$toast('该手机号未注册');
          //   this.LoginUserInfo = {};
          // }
          // else {
          //   this.$toast('密码错误');
          //   this.LoginUserInfo = {};
          // }
        }

        // 如果存在电话号码，说明已经注册过了，验证密码就行
        if (existPhone) {
          if (this.LoginUserInfo.password === curRightPass) {
            this.$toast('登录成功');
            this.LoginUserInfo = {};
            // 生成token
            const { v4: uuidv4 } = require('uuid');
            const token = this.generateToken() + uuidv4() + this.generateToken();
            console.log(curReg);
            // return;
            // 放进本地存储
            // localStorage.setItem('token', token)
            let curLogin = { ...curReg };
            curLogin.token = token;
            localStorage.setItem('curLogin', JSON.stringify(curLogin))

            setTimeout(() => {
              this.$router.back();
            }, 300)
          } else {
            this.$toast('密码错误');
            this.LoginUserInfo = {};
          }

        } else {
          this.$toast('该手机号未注册');
          this.LoginUserInfo = {};
        }

      } else {
        this.$toast('该手机号未注册');
        this.LoginUserInfo = {};
      }

      // console.log(existPhone);

    },

    clickRegister() {
      // 弹出注册窗口
      this.isRegister = true;

    },

    // 注册 register
    register() {

      console.log('表单信息', this.registerUserInfo);

      if (this.registerMsg.length > 0) {
        for (let i = 0; i < this.registerMsg.length; i++) {
          if (this.registerMsg[i].phone === this.registerUserInfo.phone) {
            this.$toast('手机号已注册');
            return;
          }
        }
      }
      this.registerMsg.push(this.registerUserInfo);


      localStorage.setItem('registerMsg', JSON.stringify(this.registerMsg))
      this.$toast('注册成功,请刷新页面再登录！！');
      // 弹出注册窗口
      this.isRegister = false;
      // 清空表单数据
      for (let key in this.registerUserInfo) {
        this.registerUserInfo[key] = '';
      }
      console.log(this.registerMsg);

    },

    // 是否显示密码
    viewPassword() {
      this.isOpenPassword = !this.isOpenPassword;
    },
  }
}
</script>

<style lang="scss" scoped>
// 导航栏
::v-deep .van-nav-bar .van-icon {
  color: grey;
}

::v-deep .van-nav-bar__text {
  color: grey;
}

// 登录表单
::v-deep .van-field__value {
  // padding-left: 20px;

  .van-field__body {
    // background: #f0f0f0;
    color: rgb(53, 53, 53);
    height: 40px;
    border-radius: 15px;

    .van-radio--horizontal {
      margin-right: 0;
      margin-left: -21px;
      background: #fff;
    }
  }
}

.login {
  height: 100vh;
  background: #fff;

  .brief {
    margin-top: 30px;

    .b1 {
      height: 40px;
      font-weight: bold;
      font-size: 20px;
    }

    .img-box {
      width: 40px;
      margin: 30px auto 0;

      img {
        width: 100%;
        display: block;
      }
    }

    .b2 {
      color: #58585a;
      margin-top: 20px;
    }
  }

  .form {
    margin-top: 40px;
    width: 340px;
    margin: 40px auto 0;

    .link {
      text-decoration: none;
      color: #1989fa;
      text-decoration: underline;
    }
  }

  .select {
    color: grey;

    span {
      margin-right: 5px;

      &:last-child {
        margin-right: 0px;
      }
    }
  }

  .tips {
    text-align: left;
    margin-top: 40px;
    margin-left: 30px;
    color: grey;
  }

  .r-box {
    margin-top: 45px;
    margin-bottom: 20px;
  }

  .check {
    width: 15px;
    height: 15px;
    margin-top: 5px;
  }

}
</style>