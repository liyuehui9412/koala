//app.js
import { request } from './utils/api'
App({
	onLaunch: function(options) {
		let that = this
		// 获取商户信息
		console.log(options)
		if (Object.keys(options.query).length > 0) {
			this.globalData.businessInfo = options.query.businessInfo
		} else {
			this.globalData.businessInfo.schoolCode = ''
		}
		// 登录
		wx.login({
			success: (res) => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				request('post', '/login', { code: res.code }, 1)
					.then((res) => {
						that.globalData.openId = res.result.openid
						that.globalData.sessionKey = res.result.sessionKey
					})
					.then(() => {
						/**
						 * 拿openid此处请求接口，判断该用户是否购买过课程，跳转到报名页面或联系页面
						 */
						this.loadUserStatus()
					})
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
		request('get', `/${this.globalData.openId}`, {}, 1).then((res) => {
			console.log(res)
			this.globalData.userObj = res.result.user
			if (res.result.flag === 0) {
				wx.reLaunch({
					url: '/pages/sign/sign',
				})
				return
			}
			if (res.result.flag === 1 && res.result.user.userStatus === 0) {
				this.globalData.phone = res.result.user.phone
				wx.reLaunch({
					url: '/pages/sign/sign',
				})
			} else {
				wx.reLaunch({
					url: '/pages/practiceIndex/practiceIndex',
				})
				// wx.reLaunch({
				// 	url: '/pages/examResult/examResult',
				// })
			}
		})
	},
	globalData: {
		userInfo: null, // 微信用户基本信息
		systemInfo: null,
		marginTop: 64,
		proportion: null,
		businessInfo: {
			schoolCode: '',
		}, // 商户信息，由options传入
		platform: null, // ios还是安卓
		openId: null,
		windowHeight: null,
		sessionKey: null,
		phone: null,
		userObj: {}, // 项目内用户信息
		price: null, // 价格
		currentNav: true, // 首页点击状态
	},
})
