// pages/test/test.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {},
	onLoad: function(options) {
		// 页面初始化 options为页面跳转所带来的参数
	},
	onReady: function() {
		// 页面渲染完成
		// 绘制圆形 支持 0.01~1
		this.drawCircle(0.99)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
	// 绘制圆形
	drawCircle(step) {
		step = step * 2
		var cxt_arc = wx.createCanvasContext('canvasArc') //创建并返回绘图上下文context对象。
		cxt_arc.setLineWidth(6)
		cxt_arc.setStrokeStyle('#d2d2d2')
		cxt_arc.setLineCap('round')
		cxt_arc.beginPath() //开始一个新的路径
		cxt_arc.arc(106, 106, 100, 0, 2 * Math.PI, false) //设置一个原点(106,106)，半径为100的圆的路径到当前路径
		cxt_arc.stroke() //对当前路径进行描边

		cxt_arc.setLineWidth(6)
		cxt_arc.setStrokeStyle('#3ea6ff')
		cxt_arc.setLineCap('round')
		cxt_arc.beginPath() //开始一个新的路径
		cxt_arc.arc(
			106,
			106,
			100,
			-Math.PI / 2,
			step * Math.PI - Math.PI / 2,
			false,
		)
		cxt_arc.stroke() //对当前路径进行描边

		cxt_arc.draw()
	},
})
