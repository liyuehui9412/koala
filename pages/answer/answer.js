// pages/answer/answer.js
import Util from "../../utils/util.js";
import { request } from '../../utils/api'
import Config from '../../utils/config.js';

let app = getApp();
let context = null;
let ctx = null;
let titleFun = null;

Page({
  data: {
    statusBarHeight:'',
    navMarginTop:'',
    titleTypeTop:'',
    question:[],
    progress_txt: '正在匹配中...',  
    count: 0,  // 设置 计数器 初始为0 控制绘制圆
    countTimer: null, // 设置 定时器 初始为null
    isQuit:false,
    pages:1,
    current:0,
    totalCount:0,
    itemCount:1,
    rightCount:0,
    errorCount:0,
    subject:1 ,  //1/4
    time:0,
    alreadyNum:0,
    wrong:false

  },
  onLoad (options) {
    console.log('options',options)
    let that = this;
    let screenHeight = app.globalData.systemInfo.screenHeight;
    let marginTop = app.globalData.marginTop;
    let time = that.data.time;
    that.setData({
      time:0,
      subject: options.type,
      alreadyNum: options.alreadyNum,
      navMarginTop: marginTop,
      statusBarHeight: screenHeight - marginTop
    })
    if(app.globalData.platform == 'android'){
      that.setData({
        titleTypeTop:12
      })
    }
    if( options.wrong ){
      that.setData({
        wrong: options.type 
      })
    }

    clearInterval(titleFun);
    titleFun = setInterval(function(){
      time++;
      that.setData({
        time:time
      })
    },1000)

    this.getTopic()

  },
  onHide(){
    // clearInterval(titleFun);
  }, 
  onUnload(){
    clearInterval(titleFun);
  }, 
  onReady () {
    this.drawProgressbg();
     // this.drawCircle(1)
  },
  onShow () {
    console.log('app.globalData.marginTop',app.globalData)

    this.setData({
      question:[],
      pages:1,
      current:0,
      totalCount:0,
      itemCount:1,
      rightCount:0,
      errorCount:0,
    })

    
  },
  onHide(){
    clearInterval(titleFun);
  }, 
  onUnload(){
    clearInterval(titleFun);
  }, 
    // 绘制底层浅色圆
    drawProgressbg(){
      // 使用 wx.createContext 获取绘图上下文 context
      ctx = wx.createCanvasContext('canvasProgressbg');
      // ctx.clearRect()
      ctx.save()
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
    drawCircle (step, i){  
       context = wx.createCanvasContext('canvasProgress');
      context.clearRect(0, 0, 200, 200)
      context.save()
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
    countInterval ( num ) {
      // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
  
      this.countTimer = setInterval(() => {
        if (this.data.count <= num) {
          /* 绘制彩色圆环进度条  
          注意此处 传参 step 取值范围是0到2，
          所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2 */
          this.drawCircle(this.data.count / (30/2) );
          this.data.count++;
        } else {
          clearInterval(this.countTimer);
          this.setData({
            count:0
          })
        }
  
      }, 20);
    },
    // 获取题目
    getTopic(){
      let that = this;
      let pages = parseInt(that.data.pages) ;
      let question = that.data.question ;
      let wrong = that.data.wrong ;
      let answerArray = that.data.answerArray; 
      console.log('question',question)
      // question.splice(0,5)
      let params={
        "limit":"10",
        "page": pages + ''
      }
      let url = ''

      // 判断科目一还是科目四
      if(that.data.subject == 4){ 
        if(wrong){
          url = `/wrong/${app.globalData.userObj.id}/${that.data.subject}`
        }else{
          url = `/getSubjectFour/${app.globalData.userObj.id}`
        }
      }else{
        if(wrong){
          url = `/wrong/${app.globalData.userObj.id}/${that.data.subject}`
        }else{
          url = `/getSubjectOne/${app.globalData.userObj.id}`
        }
      }
      
      request('POST', url , params, 1)
      .then(res=>{
        console.log('res',res)
        let list = res.result.list ;
        pages++;

        for(let i=0; i<list.length; i++){
          let index = list[i].answer.indexOf('')
          let obj = [
            {
              chooseItem:'A',
              chooseTitle:list[i].answerA,
              isSelect:false,
              isRight: list[i].answer.indexOf("A") >= 0 ? true : false
            },
            {
              chooseItem:'B',
              chooseTitle:list[i].answerB,
              isSelect:false,
              isRight: list[i].answer.indexOf("B") >= 0 ? true : false
            },
            {
              chooseItem:'C',
              chooseTitle:list[i].answerC,
              isSelect:false,
              isRight: list[i].answer.indexOf("C") >= 0 ? true : false
            },
            {
              chooseItem:'D',
              chooseTitle:list[i].answerD,
              isSelect:false,
              isRight: list[i].answer.indexOf("D") >= 0 ? true : false
            },
            {
              chooseItem:'E',
              chooseTitle:list[i].answerE || '',
              isSelect:false,
              isRight: list[i].answer.indexOf("E") >= 0 ? true : false
            },
          ]
          list[i].choose = false;
          // if(i % 2 == 0){
          //   list[i].type = '多选';
          // }
          list[i].answerArray = obj; 
        }

        let concatArray = question.concat(list)

        that.setData({
          question: concatArray,
          totalCount: res.result.totalCount,
          pages:pages,
        })
      })
    },
    // swiper 切换
    swiperChange(e){
      console.log(e)
      let index = e.detail.current;
      let pages = parseInt(this.data.pages) ;
      // console.log(index)
      // console.log( ( pages - 2 ) * 10 + 5)
      this.setData({
        itemCount: index+1,
        current: index
      })
      if( index >= ((pages - 2 )*10 + 5) ){
        this.getTopic()
      }
    },
    // 选择答案
    selectAnswer(e){
      console.log(e)
      let that = this;
      let id = e.currentTarget.dataset.id;
      let answer = e.currentTarget.dataset.answer;
      let index = e.currentTarget.dataset.index;
      let question = this.data.question; 
      let current = this.data.current;
      let rightCount = this.data.rightCount;
      let errorCount = this.data.errorCount;
      
      if(question[current].type == '多选'){
        // 多选
        that.moreAnswer(id,answer,index,question,current,rightCount,errorCount)
      }else{
        that.radioAnswer(id,answer,index,question,current,rightCount,errorCount)
      }
     
    },
    //多选
    moreAnswer(id,answer,index,question,current,rightCount,errorCount){
      let that = this;
      let isSelect = question[current].answerArray[index].isSelect

      if(isSelect){
        question[current].answerArray[index].isSelect = false;
      }else{
        question[current].answerArray[index].isSelect = true;
      }

      this.setData({
        question:question
      })
    },
    // 多选确定
    moreSubmit(e){
      let that = this;
      let question = this.data.question; 
      let current = this.data.current;
      let rightCount = this.data.rightCount;
      let errorCount = this.data.errorCount;
      let id = e.currentTarget.dataset.id;
      let answerStr = '';

      let isChoose = false;
      for(let i=0;i < question[current].answerArray.length ;i++){
        if(question[current].answerArray[i].isSelect){
          isChoose = true
          break;
        }
      }
      if(!isChoose){
        wx.showToast({
          title: '请选择答案',
          icon: 'none',
          duration: 1200
        })
        return
      }

      question[current].choose = true;

      for(let i=0;i < question[current].answerArray.length ;i++){
        if(question[current].answerArray[i].isSelect){
          answerStr +=question[current].answerArray[i].chooseItem
        }else{
          if(question[current].answerArray[i].isRight){
            // question[current].answerArray[i].isSelect = true;
          }
        }
      }
      let params = {
        userId: app.globalData.userObj.id,
        titleId: id
      }
      console.log('answerStr',answerStr)
      if(answerStr == question[current].answer){
        rightCount++;
        params.isWrong = 0
        setTimeout(function(){
          that.setData({
            current: current+1
          })
        },150)

      }else{
        errorCount++;
        params.isWrong = 1
      }

      this.setData({
        question:question,
        rightCount:rightCount,
        errorCount:errorCount
      })
      console.log('params',params)
      this.answerFun( params )

    },
    // 单选 / 判断
    radioAnswer(id,answer,index,question,current,rightCount,errorCount){
      let that = this;
      if( question[current].choose ){
          return;
      }
      question[current].answerArray[index].isSelect = true;
      question[current].choose = true;

      for(let i=0;i < question[current].answerArray.length ;i++){
        if(question[current].answerArray[i].isRight){
          question[current].answerArray[i].isSelect = true;
        }
      }

      let params = {
        userId: app.globalData.userObj.id,
        titleId: id
      }
      if(answer == question[current].answer){
        rightCount++;
        params.isWrong = 0
        setTimeout(function(){
          that.setData({
            current: current+1
          })
        },150)

      }else{
        errorCount++;
        params.isWrong = 1
      }

      this.setData({
        question:question,
        rightCount:rightCount,
        errorCount:errorCount
      })

      this.answerFun( params )
    },
    // 答题
    answerFun(params){
      console.log('params',params)
      let url = '/answerSubjectOne'

      // 判断是科目一还是科目四
      if(this.data.subject == 4){
        url = '/answerSubjectFour'
      }

      request('POST', url , params, 1)
      .then(res=>{
        console.log('res',res)
      })


    },
    // 左上角返回函数
    backFun: function (e) {
      console.log('backfun11111111')
     
      let num = 30;
      let totalCount = this.data.totalCount;
      let rightCount = this.data.rightCount;
      let errorCount = this.data.errorCount;
      num = (rightCount+errorCount)/totalCount;

      this.setData({
        isQuit:true
      })
      
      this.countInterval( num );

    },
    // 点击继续答题
    goOn(){
      this.setData({
        isQuit:false
      })
    },
    // 点击退出
    quit(){
      let titleSecond = this.data.time;
      let errorCount = parseInt(this.data.errorCount) ; 
      let rightCount = parseInt(this.data.rightCount);
      let subject = this.data.subject;

      let minute = parseInt(titleSecond / 60);
      let second = parseInt(titleSecond % 60);
      let testTime = Util.formatNumber(minute) +':'+ Util.formatNumber(second);

      wx.redirectTo({
        url: '/pages/result/result?practiceTime='+testTime+'&wrongNum='+ errorCount  +'&practiceNum='+ (errorCount +rightCount) +'&type='+subject,
      })


    }

})