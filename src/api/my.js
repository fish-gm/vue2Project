// 获取本地存储的地址
export const getLocalArr = (arrName) => {
  let localArr = localStorage.getItem(arrName);
  if (localArr === null) {
    localArr = [];
  } else {
    localArr = JSON.parse(localArr);
  }
  return localArr;
}

// 判断是否登录
export const isLogin = () => {
  let curLogin = localStorage.getItem('curLogin');
  if (curLogin !== null) {
    return true;
  } 
  return false;
}

// 取出登录用户的电话
export const loginPhone = () => {
  let curLogin = localStorage.getItem('curLogin');
  if (curLogin !== null) {
    curLogin = JSON.parse(curLogin);
    return curLogin.phone;
  }
  return '未登录';
}

// 存入本地存储，不带电话号码
export const setLocalData = (localName,ownName) => {
  let tel = loginPhone();
  // localStorage.setItem(localName + `${tel}`,ownName);
  localStorage.setItem(localName,ownName);
}

// 从本地存储中取出，不带电话号码
export const getLocalArrData = (arrName) => {
  let tel = loginPhone();
  // let localArr = localStorage.getItem(arrName + `${tel}`);
  let localArr = localStorage.getItem(arrName);
  if (localArr === null) {
    localArr = [];
  } else {
    localArr = JSON.parse(localArr);
  }
  return localArr;
}

// 从本地存储中取出单个，带电话号码
export const getWithPhone = (data) => {
  let tel = loginPhone();
  let localData = localStorage.getItem(data + `${tel}`);
  // let localData = localStorage.getItem(data);
  return localData;
}

// 从本地存储中取出数组/对象，带电话号码
export const getArrWithPhone = (data) => {
  let tel = loginPhone();
  let localArr = localStorage.getItem(data + `${tel}`);
  if (localArr === null) {
    localArr = [];
  } else {
    localArr = JSON.parse(localArr);
  }
  return localArr;
}

// 存入本地存储，带电话号码 
export const setWithPhone = (localName,ownName) => {
  let tel = loginPhone();
  localStorage.setItem(localName + `${tel}`,ownName);
  // localStorage.setItem(localName,ownName);
}