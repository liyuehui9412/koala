// pages/answer/answer.js
import Util from "../../utils/util.js";
import Api from '../../utils/api.js';
import Config from '../../utils/config.js';

let app = getApp();

Page({
  data: {
    statusBarHeight:'',
    navMarginTop:'',
    titleTypeTop:'',
    quetion:[
      {
        id:1,
        title:'造成交通事故后逃逸且构成犯罪的驾驶人将吊销驾驶证终生不得重新取得驾驶证。',
        isMore:false,
        ansertNum:['A','B','C','D','E','F','G','H','J','K','L','M','N'],
        answer:[
          {
            title:'违章行为',
            isSelect:false
          },
          {
            title:'违法行为',
            isSelect:false
          },
          {
            title:'违规行为',
            isSelect:false
          },
          {
            title:'过失行为',
            isSelect:false
          },
        ],
        rightAnswer:['A']
      }
    ],
    progress_txt: '正在匹配中...',  
    count: 0,  // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
    isQuit:false
  },
  onLoad: function (options) {
    let that = this;
    let windowHeight = app.globalData.systemInfo.windowHeight;
    let marginTop = app.globalData.marginTop;

    that.setData({
      navMarginTop: marginTop,
      statusBarHeight: windowHeight - marginTop
    })
    if(app.globalData.platform == 'android'){
      that.setData({
        titleTypeTop:12
      })
    }

  },
  onReady: function () {
    this.drawProgressbg();
    // this.drawCircle(1)
    this.countInterval();
  },
  onShow: function () {

  },
    // 绘制底层浅色圆
    drawProgressbg: function(){
      // 使用 wx.createContext 获取绘图上下文 context
      let ctx = wx.createCanvasContext('canvasProgressbg');

      let out_r = 42 ; //圆半径
      let x = 50 ; //圆心 x坐标
      let y = 50 ; //圆心 y坐标
      let lineWidth = 8 ; // 圆的宽度
      let bgc = '#C4F2E9'; // 圆的背景色
  
      ctx.setLineWidth( lineWidth ); // 设置圆环的宽度
      ctx.setStrokeStyle( bgc ); // 设置圆环的颜色
      ctx.setLineCap('round'); // 设置圆环端点的形状
      ctx.beginPath(); // 开始一个新的路径
      ctx.arc(x, y, out_r, 0, 2 * Math.PI, false);
      // 设置一个原点(100,100)，半径为90的圆的路径到当前路径
      ctx.stroke(); // 对当前路径进行描边
      ctx.draw();
  
    },
    // 绘制上层
    drawCircle: function (step, i){  
      var context = wx.createCanvasContext('canvasProgress');

      let out_r = 42 ; //圆半径
      let x = 50 ; //圆心 x坐标
      let y = 50 ; //圆心 y坐标
      let lineWidth = 8 ; // 圆的宽度
      // 设置渐变
      var gradient = context.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop("0", "#2BE1BC");
      gradient.addColorStop("0.4", "#2BE1BC");
      gradient.addColorStop("0.8", "#00BC96");
      gradient.addColorStop("1.0", "#00BC96");
      context.setStrokeStyle(gradient);
      context.setLineWidth( lineWidth );
      context.setLineCap('round')
      context.beginPath();
      // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
      context.arc(x, y, out_r, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
      context.stroke();
  
      context.draw();
  
   },
  //    定时器绘制
    countInterval: function () {
      // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
  
      this.countTimer = setInterval(() => {
        if (this.data.count <= 60) {
          console.log('count',this.data.count)
          /* 绘制彩色圆环进度条  
          注意此处 传参 step 取值范围是0到2，
          所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2 */
          this.drawCircle(this.data.count / (60/2) );
          this.data.count++;
        } else {
          this.setData({progress_txt: "匹配成功"});
          clearInterval(this.countTimer);
        }
  
      }, 50);
    },
  
})