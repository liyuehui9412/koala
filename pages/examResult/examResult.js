// pages/examResult/examResult.js
import Util from '../../utils/util.js'
import Api from '../../utils/api.js'
import Config from '../../utils/config.js'

let app = getApp()

Page({
	data: {
		navMarginTop: '',
		progress_txt: '正在匹配中...',
		count: 0, // 设置 计数器 初始为0
		countTimer: null, // 设置 定时器 初始为null
		gridNum: 60, //内层圆点数

		isPass: true,
	},
	onLoad: function(options) {
		let that = this
		that.setData({
			navMarginTop: app.globalData.marginTop,
		})
	},
	onReady: function() {
		this.drawProgressbg()
		// this.drawCircle(1)
		this.countInterval()
	},
	onShow: function() {},
	// 绘制底层浅色圆
	drawProgressbg: function() {
		// 使用 wx.createContext 获取绘图上下文 context
		let ctx = wx.createCanvasContext('canvasProgressbg')
		let gridNum = this.data.gridNum
		// 内层底圈栅格圆
		let in_r = 70 //内层圆半径
		let out_r = 80 //内层圆半径
		let x = 85 //圆心 x坐标
		let y = 85 //圆心 y坐标
		let lineWidth = 10 // 圆的宽度
		let angle = 360 / gridNum // 计算每个栅格间隔角度（最好能整除）
		let bgc = 'rgba(0,0,0,0.1)' // 圆的背景色
		for (let i = 0; i < gridNum; i++) {
			ctx.beginPath()
			ctx.setLineWidth(2)
			ctx.setStrokeStyle(bgc)
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
  },
	// 绘制上层
	drawCircle: function(step, i) {
		var context = wx.createCanvasContext('canvasProgress')
		let gridNum = this.data.gridNum
		// 内层底圈栅格圆
		let in_r = 70 //内层圆半径
		let out_r = 80 //内层圆半径
		let x = 85 //圆心 x坐标
		let y = 85 //圆心 y坐标
		let lineWidth = 10 // 圆的宽度
		let angle = 360 / gridNum // 计算每个栅格间隔角度（最好能整除）
		let bgc = '#ffffff' // 圆的背景色
		let radian = (step * gridNum) / 2 + 1

		context.setStrokeStyle(bgc)
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
			context.setLineWidth(2)
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
	countInterval: function() {
		// 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈

		this.countTimer = setInterval(() => {
			if (this.data.count <= 30) {
				console.log('count', this.data.count)
				/* 绘制彩色圆环进度条  
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2 */
				this.drawCircle(this.data.count / (30 / 2))
				this.data.count++
			} else {
				this.setData({ progress_txt: '匹配成功' })
				clearInterval(this.countTimer)
			}
		}, 30)
	},
})
