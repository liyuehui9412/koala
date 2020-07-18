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
    current:0,
    totalCount:0,
    itemCount:1,
    rightCount:0,
    errorCount:0,
    title:'60:00',
    titleSecond: 3600,
    pages:1,
    ksList:[],

    modalTitle:'退出考试',
    modalHint:'剩余未做',
    modalStatus: 0 , // 0 退出考试/交卷， 1 考试不合格，2 交卷， 3 超时合格， 4 超时不合格
    modalBtnLeft:'退出',
    modalBtnRight:'继续答题',

    score:0,
    subject:1   //1/4

  },
  onLoad (options) {
    console.log('options',options)
    let that = this;
    let screenHeight = app.globalData.systemInfo.screenHeight;
    let marginTop = app.globalData.marginTop;
    
    that.setData({
      subject: options.type,
      navMarginTop: marginTop,
      statusBarHeight: screenHeight - marginTop
    })
    if(app.globalData.platform == 'android'){
      that.setData({
        titleTypeTop:12
      })
    }

    clearInterval(titleFun);
    titleFun = setInterval(function(){
      console.log(111)
      let titleSecond = that.data.titleSecond;
      titleSecond--;
      if(titleSecond <= 0){
        // 倒计时结束
        that.setData({
          titleSecond: 0
        })
        clearInterval(titleFun)
        that.answerFun()
        return
      }
      let minute = parseInt(titleSecond / 60);
      let second = parseInt(titleSecond % 60);
      that.setData({
        title: Util.formatNumber(minute) +':'+ Util.formatNumber(second),
        titleSecond: titleSecond
      })
      
    },1000)


  },
  onReady () {
    // this.drawProgressbg();
     // this.drawCircle(1)
  },
  onShow () {
    console.log('app.globalData.marginTop',app.globalData)

    this.setData({
      question:[],
      current:0,
      totalCount:0,
      itemCount:1,
      rightCount:0,
      errorCount:0,
      pages:1,
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getTopic()
    
  },
  onHide(){
    clearInterval(titleFun);
  }, 
  onUnload(){
    clearInterval(titleFun);
  }, 
    // 绘制底层浅色圆
    drawProgressbg(){
      let modalStatus = this.data.modalStatus
      // 使用 wx.createContext 获取绘图上下文 context
      ctx = wx.createCanvasContext('canvasProgressbg');
      ctx.clearRect(0, 0, 200, 200)
      ctx.save()
      let out_r = 42 ; //圆半径
      let x = 50 ; //圆心 x坐标
      let y = 50 ; //圆心 y坐标
      let lineWidth = 8 ; // 圆的宽度
    
      ctx.setLineWidth( lineWidth ); // 设置圆环的宽度
      if(modalStatus == 1 || modalStatus == 4){
        ctx.setStrokeStyle( '#FBEBEE' ); // 设置圆环的颜色
      }else{
        ctx.setStrokeStyle( '#C4F2E9' ); // 设置圆环的颜色
      }

      ctx.setLineCap('round'); // 设置圆环端点的形状
      ctx.beginPath(); // 开始一个新的路径
      ctx.arc(x, y, out_r, 0, 2 * Math.PI, false);
      // 设置一个原点(100,100)，半径为90的圆的路径到当前路径
      ctx.stroke(); // 对当前路径进行描边
      ctx.draw();
  
    },
    // 绘制上层
    drawCircle (step, i){  
      let modalStatus = this.data.modalStatus
       context = wx.createCanvasContext('canvasProgress');
      context.clearRect(0, 0, 200, 200)
      context.save()
      let out_r = 42 ; //圆半径
      let x = 50 ; //圆心 x坐标
      let y = 50 ; //圆心 y坐标
      let lineWidth = 8 ; // 圆的宽度
      // 设置渐变
      var gradient = context.createLinearGradient(0, 0, 0, 200);
      if(modalStatus == 1 || modalStatus == 4){
        gradient.addColorStop("0", "#FF6A6E");
        gradient.addColorStop("0.4", "#FF6A6E");
        gradient.addColorStop("0.8", "#FF9391");
        gradient.addColorStop("1.0", "#FF9391");
      }else{ 
        gradient.addColorStop("0", "#2BE1BC");
        gradient.addColorStop("0.4", "#2BE1BC");
        gradient.addColorStop("0.8", "#00BC96");
        gradient.addColorStop("1.0", "#00BC96"); 
      }

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
      let that = this
      that.setData({
        count:0
      })
      this.countTimer = setInterval(() => {
        if (that.data.count <= num) {
          /* 绘制彩色圆环进度条  
          注意此处 传参 step 取值范围是0到2，
          所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2 */
          that.drawCircle(that.data.count / (30/2) );
          that.data.count++;
        } else {
          clearInterval(that.countTimer);
          that.setData({
            count:0
          })
        }
  
      }, 20);
    },
    // 获取题目
    getTopic(){
      let that = this;
      let question = that.data.question ;
      let answerArray = that.data.answerArray;
      console.log('question',question)

      let url = `/examinationOne`
      // 判断科目一还是科目四
      if(that.data.subject == 4){
        url = `/examinationFour`
      }

      request('GET', url , {}, 1)
      .then(res=>{
        console.log('res',res)
        let ksList = res.result.ksList ;
        let list = ksList.slice(0,10);

        that.setData({
          ksList: ksList
        })
        
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
  
          list[i].answerArray = obj; 
        }

        let concatArray = question.concat(list)
        
        wx.hideLoading()

        that.setData({
          question: concatArray,
          totalCount: ksList.length,
        })
      })
    },
    // swiper 切换
    swiperChange(e){
      console.log(e)
      let index = e.detail.current;
      let pages = parseInt(this.data.pages) ;
      let ksList = this.data.ksList ;
      let question = this.data.question ;

      this.setData({
        itemCount: index+1,
        current: index
      })
      // 分页加载question
      if( index >= ((pages - 1 )*10 + 5) ){ 
        let list = ksList.slice( pages * 10 ,pages * 10 + 10);
        let newQuestion = question.concat(list)
        pages++;
        this.setData({
          pages:pages,
          question:newQuestion
        })
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
      let score = that.data.score;
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
            question[current].answerArray[i].isSelect = true;
          }
        }
      }

      console.log('answerStr',answerStr)
      if(answerStr == question[current].answer){
        rightCount++;
        if(that.data.subject == 1){
          score += 1
        }else{
          score += 2
        }
        setTimeout(function(){
          that.setData({
            current: current+1
          })
        },150)

      }else{
        errorCount++;
      }

      this.setData({
        question:question,
        rightCount:rightCount,
        errorCount:errorCount,
        score:score
      })

      this.answerFun( )

    },
    // 单选 / 判断
    radioAnswer(id,answer,index,question,current,rightCount,errorCount){
      let that = this;
      let score = that.data.score;
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

      if(answer == question[current].answer){
        rightCount++;

        if(that.data.subject == 1){
          score += 1
        }else{
          score += 2
        }

        setTimeout(function(){
          that.setData({
            current: current+1
          })
        },150)

      }else{
        errorCount++;

      }

      this.setData({
        question:question,
        rightCount:rightCount,
        errorCount:errorCount,
        score:score
      })

      this.answerFun( )
    },
    // 判断是否结束考试
    answerFun(){
      
      let totalCount = this.data.totalCount;
      let rightCount = this.data.rightCount;
      let errorCount = this.data.errorCount;
      let score = this.data.score;
      let subject = this.data.subject;
      let titleSecond = this.data.titleSecond;

      let num = 30;
      num = (rightCount + errorCount)/totalCount * 30;

      if(subject == 1 && errorCount > 10){
        // 科目一错10题
          this.setData({
            modalTitle:'考试不合格',
            modalHint:'您已答错',
            modalStatus: 1 , // 0 退出考试 1 考试不合格 2 交卷 3 超时合格 4 超时不合格
            modalBtnLeft:'退出',
            modalBtnRight:'继续答题',
            isQuit:true
          })
          this.drawProgressbg();
          this.countInterval( num );
      }else if(subject == 4 && errorCount > 5){
        // 科目四错5题
          this.setData({
            modalTitle:'考试不合格',
            modalHint:'您已答错',
            modalStatus: 1 , // 0 退出考试 1 考试不合格 2 交卷 3 超时合格 4 超时不合格
            modalBtnLeft:'退出',
            modalBtnRight:'继续答题',
            isQuit:true
          })
          this.drawProgressbg();
          this.countInterval( num );
      }
      // 时间到
      if(titleSecond <= 0){
        // 合格
        if(score >= 90){
          this.setData({
            modalTitle:'考试合格',
            modalHint:'您已超时',
            modalStatus: 3 , // 0 退出考试 1 考试不合格 2 交卷 3 超时合格 4 超时不合格
            modalBtnLeft:'现在交卷',
            modalBtnRight:'取消',
            isQuit:true
          })
          this.drawProgressbg();
          this.countInterval( num );
        }else{
          this.setData({
            modalTitle:'考试不合格',
            modalHint:'您已超时',
            modalStatus: 4 , // 0 退出考试 1 考试不合格 2 交卷 3 超时合格 4 超时不合格
            modalBtnLeft:'现在交卷',
            modalBtnRight:'取消',
            isQuit:true
          })
          this.drawProgressbg();
          this.countInterval( num );
        }
      }

    },
    // 右下角交卷
    uploadPaper(){

      let num = 30;
      let totalCount = this.data.totalCount;
      let rightCount = this.data.rightCount;
      let errorCount = this.data.errorCount;
  
      num = (rightCount + errorCount)/totalCount * 30;

      this.setData({
        modalTitle:'交卷',
        modalHint:'剩余未做',
        modalStatus: 2 , // 0 退出考试 1 考试不合格 2 交卷 3 超时合格 4 超时不合格
        modalBtnLeft:'现在交卷',
        modalBtnRight:'取消',
        isQuit:true
      })
      this.drawProgressbg();
      this.countInterval( num );

    },
    // 左上角返回函数
    backFun (e) {
      console.log('backfun11111111')
     
      let num = 30;
      let totalCount = this.data.totalCount;
      let rightCount = this.data.rightCount;
      let errorCount = this.data.errorCount;
  
      num = (rightCount + errorCount)/totalCount * 30;

      this.setData({
        modalTitle:'退出考试',
        modalHint:'剩余未做',
        modalStatus: 0 , // 0 退出考试 1 考试不合格 2 交卷 3 超时合格 4 超时不合格
        modalBtnLeft:'退出',
        modalBtnRight:'继续答题',
        isQuit:true
      })
      console.log('num',num)
      this.drawProgressbg();
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
      wx.navigateBack({
        delta: 1,
      })
    },
    // 点击交卷
    paper(){
      let score = this.data.score;
      let subject = this.data.subject;
      let titleSecond = 3600 - this.data.titleSecond;
      let params = {
        userId: app.globalData.userObj.id,
        "achievement": score,
        "type": subject
      }
      wx.showLoading({
        title: '正在提交',
      })
      clearInterval(titleFun);
      let minute = parseInt(titleSecond / 60);
      let second = parseInt(titleSecond % 60);
      let testTime = Util.formatNumber(minute) +':'+ Util.formatNumber(second);

      console.log('params',params)
      request('POST', `/submitAchievement` , params, 1)
      .then(res=>{
        console.log('paper',res)
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '/pages/examResult/examResult?achievement='+score+'&testTime='+ testTime +'&highestScore='+ res.top +'&type='+subject,
          })
        },1200)
   
      })


    },


})