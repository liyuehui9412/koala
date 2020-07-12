import Config from './config.js';
import Api from './api.js';
let app = getApp();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 获取缓存登录信息
const getIHValue = () => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'iHValue',
      success: function (res) {
        // console.log("res", res)
        let data = {};
        try {
          let decryptToken = res.data;
          // console.log("decryptToken", decryptToken);
          if (decryptToken == "") {
            reject("解密token为空")
          } else {
            data.code = 1;
            data.iHValue = decryptToken;
            resolve(data)
          }
        } catch (e) {
          reject("解密错误")
        }
      },
      fail: function (err) {
        reject("获取token失败")
      }
    })
  })
};
// 存储缓存内容
const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    setStorage(key, value)
  }
};
// 获取缓存内容
const getStorage = (key) => {
  try {
    return wx.getStorageSync(key)
  } catch (e) {
    return getStorage(key)
  }
};
// 利用时间戳判断是否重复点击
const doubleClick = () => {
  let lastTime = getStorage('myDate') || 0;
  let myDate = new Date().getTime();
  let doubleClick;
  if (myDate - lastTime > 700) {
    setStorage('myDate', myDate);//存值
    doubleClick = false;
  } else {
    doubleClick = true;
  }
  return doubleClick;
};

module.exports = {
  formatTime: formatTime,
  getIHValue: getIHValue,
  setStorage: setStorage,
  getStorage: getStorage,
  doubleClick: doubleClick
}
