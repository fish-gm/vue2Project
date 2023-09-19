// 加载提示
import { Toast } from 'vant'
import axios from 'axios'

// 基础地址
// axios.defaults.baseURL = 'https://apis.netstart.cn/xmsc'
axios.defaults.baseURL = 'https://apic.netstart.cn/xmsc'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  Toast({
    type: 'loading',
    message: '加载中...',
    duration: 0,
    forbidClick: true
  });

  if (config.method === 'get') {
    // console.log('get请求方式');
  } else if (config.method === 'post') {
    console.log('post请求方式');
  }

  // console.log('config ==> ', config);

  return config;
}, function (error) {
  // 对请求错误做些什么
  Toast.clear();
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  Toast.clear();

  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  Toast.clear();

  return Promise.reject(error);
});


// 获取商城首页Tab布局
export const getRecSlideshow = () => {
  return axios({
    method: 'get',
    url: '/home/page',
  })
}

// 获取商城首页其他Tab布局
export const PageTypeActivity = (pageId) => {
  return axios({
    method: 'get',
    url: '/home/page',
    params: {
      page_type: 'activity',
      page_id: pageId
    }
  })
}

// 商城主分类 1251
export const categoryData = (catId) => {
  return axios({
    method: 'get',
    url: '/home/category_v2',
    params: {
      cat_id: catId,
    }
  })
}

// 商品分类列表
export const getAllProduct = (id) => {
  return axios({
    method: 'get',
    // https://apis.netstart.cn/xmsc
    url: '/product/all_product',
    params: {
      // 1836
      cat_id: id,
    }
  })
}

// 商品详情页面
export const getDetail = (id) => {
  return axios({
    method: 'get',
    // https://apis.netstart.cn/xmsc
    url: '/miproduct/view',
    params: {
      // 14834
      commodity_id: id,
    }
  })
}

// 商城热门搜索
export const hotSearch = () => {
  return axios({
    method: 'get',
    // https://apis.netstart.cn/xmsc
    url: '/hisearch/se_default'
  })
}


// 搜索产品
export const searchPro = (query) => {
  return axios({
    method: 'get',
    // https://apis.netstart.cn/xmsc
    url: '/hisearch/query_v3',
    params: {
      query: query,
      page_index: 1,
      page_size: 20
    }
  })
}



