//app.js
App({
	onLaunch: function(options) {
		let that = this
		// 获取商户信息
		console.log(options)
		if (Object.keys(options.query).length > 0) {
			console.log(1)
			this.globalData.businessInfo = options.query.businessInfo
		}
		// 获取ios端还是安卓端
		wx.getSystemInfo({
			success: function(res) {
				console.log(res)
				if (res.platform == 'android') {
					that.globalData.platform = 'android'
				} else {
					that.globalData.platform = 'IOS'
				}
			},
		})

		// 登录
		wx.login({
			success: (res) => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
			},
		})
		// 获取用户信息
		wx.getSetting({
			success: (res) => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: (res) => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						},
					})
				}
			},
		})
		console.log(this.globalData)
	},
	globalData: {
		userInfo: null, // 用户信息
		businessInfo: null, // 商户信息，由options传入
		platform: null, // ios还是安卓
	},
})
