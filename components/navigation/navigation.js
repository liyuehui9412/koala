// components/navigation/navigation.js
let app = getApp();
Component({
  externalClasses: ['bar-class','nav-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    isShowBack: {
      type: String,
      value: '0', 
    },
    title: {
      type: String,
      value: '',
    },
    isBack: {
      type: String,
      value: '0',
    }

  },
  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight:20
  },
  lifetimes:{
    ready:function(){
      let system = app.globalData.systemInfo.system;
      let statusBarHeight = app.globalData.systemInfo.statusBarHeight;
      this.setData({
        statusBarHeight: statusBarHeight
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _navToBack: function () {

      if(this.data.isBack == '0'){
        wx.navigateBack({
          delta: 1,
        })
      }else{
        this.triggerEvent('backfun')
      }
    }
  }



})
