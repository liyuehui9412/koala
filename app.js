//app.js
App({
  onLaunch: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('getSystemInfo',res)
        that.globalData.systemInfo = res;
        that.globalData.marginTop = res.statusBarHeight + 44
        that.globalData.proportion = res.screenHeight / res.screenWidth
      }
    });
  },
  onShow(){
    console.log('appjs onshow')
  },
  globalData: {
    userInfo: null,
    systemInfo:null,
    marginTop:64,
    proportion:null
  }
})