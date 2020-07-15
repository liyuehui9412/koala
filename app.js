//app.js
App({
	onLaunch: function(options) {
		let that = this
		// 获取商户信息
		console.log(options)
		if (Object.keys(options.query).length > 0) {
			this.globalData.businessInfo = options.query.businessInfo
		}
		// 登录
		wx.login({
			success: (res) => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId

				/**
				 * 拿openid此处请求接口，判断该用户是否购买过课程，跳转到报名页面或联系页面
				 */
				this.loadUserStatus()
			},
		})
		wx.getSystemInfo({
			success: function(res) {
				console.log('getSystemInfo', res)
				if (res.platform == 'android') {
					that.globalData.platform = 'android'
				} else {
					that.globalData.platform = 'IOS'
				}
				that.globalData.systemInfo = res
				that.globalData.marginTop = res.statusBarHeight + 44 
				that.globalData.proportion = res.screenHeight / res.screenWidth
				that.globalData.windowHeight = res.windowHeight
			},
		})
	},
	onShow() {
		console.log('appjs onshow')
	},
	// 获取用户信息
	loadUserStatus() {
		// 查询用户信息，是否报过名，报过名去首页，没报名去报名
		// wx.reLaunch({
		// 	url: '',
		// })
	},
	globalData: {
		userInfo: null,
		systemInfo: null,
		marginTop: 64,
		proportion: null,
		businessInfo: null, // 商户信息，由options传入
		platform: null, // ios还是安卓
		openId: null,
		windowHeight: null,
	},
})
