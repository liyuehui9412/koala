// pages/result/result.js
import Util from '../../utils/util.js'
import { request } from '../../utils/api'
import Config from '../../utils/config.js'

let app = getApp()
let ctx = null;
let context = null;
Page({
	data: {
		navMarginTop: '',
		count: 0, // 设置 计数器 初始为0
		countTimer: null, // 设置 定时器 初始为null
		gridNum: 60, //内层圆点数
		type: '',
		wrongNum: '',
		practiceTime: '',
		practiceNum: '',
		percentage: '', // 百分比
		fourPracticeAnswerCount: {
			already: '',
			all: '',
		},
		activeWidth:0
	},
	onLoad: function(options) {
		console.log('options', options)
		let percentage = parseInt(((options.practiceNum - options.wrongNum) / options.practiceNum) * 100)
		let that = this
		that.setData({
			navMarginTop: app.globalData.marginTop,
			type: options.type,
			wrongNum: options.wrongNum,
			practiceTime: options.practiceTime,
			practiceNum: options.practiceNum,
			percentage,
		})
		this.getAnswerCount()
		this.countInterval(percentage)
	},
	onReady: function() {
		this.drawProgressbg()
		// this.drawCircle(1)
	},
	onShow: function() {},
	// 绘制底层浅色圆
	drawProgressbg: function() {
		// 使用 wx.createContext 获取绘图上下文 context
		ctx = wx.createCanvasContext('canvasProgressbg')
		// ctx.clearRect(0, 0, 200, 200)
		// ctx.save()
		let gridNum = this.data.gridNum
		// 内层底圈栅格圆
		let in_r = 84 //内层圆半径
		let out_r = 100 //内层圆半径
		let x = 110 //圆心 x坐标
		let y = 110 //圆心 y坐标
		let lineWidth = 10 // 圆的宽度
		let angle = 360 / gridNum // 计算每个栅格间隔角度（最好能整除）
		let bgc = '#C4F2E9' // 圆的背景色


		for (let i = 0; i < gridNum; i++) {
			ctx.beginPath()
			ctx.setLineWidth(10)
			ctx.setStrokeStyle('#C4F2E9' )
			ctx.setLineCap('butt')
			ctx.arc(
				x,
				y,
				in_r,
				((270 - angle * (i + 1) + (angle - 1)) * Math.PI) / 180,
				((270 - angle * i) * Math.PI) / 180,
				false,
			)
			ctx.stroke()
			ctx.closePath()
		}
		ctx.stroke()
		ctx.save()
		// 外层底圈圆
		ctx.setLineWidth(lineWidth) // 设置圆环的宽度
		ctx.setStrokeStyle(bgc) // 设置圆环的颜色
		ctx.setLineCap('round') // 设置圆环端点的形状
		ctx.beginPath() // 开始一个新的路径
		ctx.arc(x, y, out_r, 0, 2 * Math.PI, false)
		// 设置一个原点(100,100)，半径为90的圆的路径到当前路径
		ctx.stroke() // 对当前路径进行描边
		ctx.draw()

	},
	// 绘制上层
	drawCircle: function(step, i) {
		context = wx.createCanvasContext('canvasProgress')
		context.clearRect(0, 0, 200, 200)
		context.save()
		let gridNum = this.data.gridNum
		// 内层底圈栅格圆
		let in_r = 84 //内层圆半径
		let out_r = 100 //内层圆半径
		let x = 110 //圆心 x坐标
		let y = 110 //圆心 y坐标
		let lineWidth = 10 // 圆的宽度
		let angle = 360 / gridNum // 计算每个栅格间隔角度（最好能整除）
		let bgc = '#17D5AC' // 圆的背景色
		let radian = (step * gridNum) / 2 + 1
		// 设置渐变
		var gradient = context.createLinearGradient(0, 0, 0, 200)
		gradient.addColorStop('0', '#2BE1BC')
		gradient.addColorStop('0.4', '#2BE1BC')
		gradient.addColorStop('0.8', '#00BC96')
		gradient.addColorStop('1.0', '#00BC96')
		context.setStrokeStyle(gradient)
		context.setLineWidth(lineWidth)
		context.setLineCap('round')
		context.beginPath()
		// 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
		context.arc(x, y, out_r, -Math.PI / 2, step * Math.PI - Math.PI / 2, false)
		context.stroke()

		if (radian >= gridNum) {
			radian = gridNum
		}
		for (let i = 0; i < radian; i++) {
			context.beginPath()
			context.setLineWidth(lineWidth)
			context.setStrokeStyle(bgc)
			context.setLineCap('butt')
			context.arc(
				x,
				y,
				in_r,
				(-(91 - angle * i) * Math.PI) / 180,
				(-(91 - angle * (i + 1) + (angle - 1)) * Math.PI) / 180,
				false,
			)
			context.stroke()
			context.closePath()
			context.save()
		}

		context.draw()
	},
	//    定时器绘制
	countInterval: function(percentage) {
		let that = this;
		// 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
		percentage = percentage * 0.6;
		that.drawProgressbg()
		this.countTimer = setInterval(() => {
			if (that.data.count <= percentage) {
				// console.log('count', this.data.count)
				/* 绘制彩色圆环进度条  
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2 */
				that.drawCircle(that.data.count / (60 / 2))
				that.data.count++
			} else {
				clearInterval(that.countTimer)
			}
		}, 50)
	},
	// 做过多少题
	getAnswerCount() {
		console.log('323232')
		request(
			'get',
			`/getAnswerCount/${app.globalData.userObj.id}/${this.data.type}`,
			{},
			1,
		).then((res) => {
			if (res.code == 0) {
				console.log(res)
				let activeWidth = parseInt((res.result.already / res.result.all) *100) + "%";
				let activeLeft = (res.result.already / res.result.all)  * 690
				if(activeLeft <= 40){
					activeLeft = activeLeft - 40
				}

				this.setData({
					fourPracticeAnswerCount: res.result,
					activeWidth:activeWidth,
					activeLeft:activeLeft
				})



			}
		})
	},
})
