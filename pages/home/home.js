// pages/search/search.js
import Util from "../../utils/util.js";
import Api from '../../utils/api.js';
import Config from '../../utils/config.js';

let app = getApp();

Page({
  data: {
    navMarginTop:''

  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      navMarginTop: app.globalData.marginTop,
    })

  },
  onReady: function () {

  },
  onShow: function () {

  },
  start(){
    wx.navigateTo({
      url: '/pages/examAnswer/examAnswer',
    })
  }
  
})