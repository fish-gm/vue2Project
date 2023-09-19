import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { categoryData, getDetail } from "../api/api.js";
export default new Vuex.Store({
  state: {
    // token: localStorage.getItem('token'),
    proCount: 0,
    curAddress: '',
    allSelect: false,
    nickName: '登录/注册',
  },
  getters: {

  },
  mutations: {
    changeAllSelect(state, val) {
      state.allSelect = val
    },
    changeNickName(state, val) {
      state.nickName = val;
    }
  },
  actions: {
  },
  modules: {
  }
})
