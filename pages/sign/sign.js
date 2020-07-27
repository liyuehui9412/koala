// pages/search/search.js
import Util from '../../utils/util.js'
import Config from '../../utils/config.js'
import { request } from '../../utils/api'

let app = getApp()
let iHValue
let fromSource
let change = false

Page({
	data: {
		navMarginTop: '',
		isIos: app.globalData.platform,
		get_phone_show: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		wxUserData: null,
		swiperData: [
			'https://static.kaolakaola.cn/tiku/swiper1.png',
			'https://static.kaolakaola.cn/tiku/swiper2.png',
			'https://static.kaolakaola.cn/tiku/swiper3.png',
		],
		remindData: [
			'学员135****4473在1分钟前报名',
			'学员137****2538在6分钟前报名',
			'学员137****9613在11分钟前报名',
			'学员136****9574在25分钟前报名',
			'学员138****9947在33分钟前报名',
			'学员139****9256在38分钟前报名',
			'学员135****8356在40分钟前报名',
			'学员133****4455在51分钟前报名',
			'学员137****6679在53分钟前报名',
			'学员139****4400在58分钟前报名',
		],
		surplus: 35,
		price: 0,
	},
	onLoad: function(options) {
		let that = this
		that.setData({
			navMarginTop: app.globalData.marginTop,
		})
		// 查看是否授权
		// wx.getSetting({
		// 	success(res) {
		// 		if (res.authSetting['scope.userInfo']) {
		// 			that.setData({
		// 				canIUse: false,
		// 			})
		// 			// 已经授权，可以直接调用 getUserInfo 获取头像昵称
		// 			wx.getUserInfo({
		// 				success: function(res) {
		// 					console.log(res)
		// 					that.setData({
		// 						wxUserData: res,
		// 					})
		// 					app.globalData.userInfo = res.userInfo
		// 				},
		// 			})
		// 		} else {
		// 			that.setData({
		// 				canIUse: true,
		// 			})
		// 		}
		// 	},
		// })
		if (app.globalData.userInfo.avatarUrl && app.globalData.userInfo.nickName) {
			that.setData({
				canIUse: false,
			})
		} else {
			that.setData({
				canIUse: true,
			})
		}
		that.loadPrice()
		let time = new Date().getHours()
		console.log(time)
		switch (time) {
			case 0:
				this.setData({
					surplus: 35,
				})
				break
			case 1:
				this.setData({
					surplus: 35,
				})
				break
			case 2:
				this.setData({
					surplus: 35,
				})
				break
			case 3:
				this.setData({
					surplus: 35,
				})
				break
			case 4:
				this.setData({
					surplus: 35,
				})
				break
			case 5:
				this.setData({
					surplus: 35,
				})
				break
			case 6:
				this.setData({
					surplus: 35,
				})
				break
			case 7:
				this.setData({
					surplus: 34,
				})
				break
			case 8:
				this.setData({
					surplus: 33,
				})
				break
			case 9:
				this.setData({
					surplus: 32,
				})
				break
			case 10:
				this.setData({
					surplus: 30,
				})
				break
			case 11:
				this.setData({
					surplus: 25,
				})
				break
			case 12:
				this.setData({
					surplus: 20,
				})
				break
			case 13:
				this.setData({
					surplus: 17,
				})
				break
			case 14:
				this.setData({
					surplus: 14,
				})
				break
			case 15:
				this.setData({
					surplus: 11,
				})
				break
			case 16:
				this.setData({
					surplus: 8,
				})
				break
			case 17:
				this.setData({
					surplus: 6,
				})
				break
			case 18:
				this.setData({
					surplus: 4,
				})
				break
			case 19:
				this.setData({
					surplus: 3,
				})
				break
			case 20:
				this.setData({
					surplus: 2,
				})
				break
			default:
				this.setData({
					surplus: 1,
				})
				break
		}
	},
	onReady: function() {},
	onShow: function() {
		console.log('onShow')
	},
	loadPrice() {
		request('get', '/getPrice', {}, 1).then((res) => {
			if (res.code == 0) {
				app.globalData.price = res.result.price
				this.setData({
					price: res.result.price,
				})
			}
		})
	},
	// 报名操作
	sign_action() {
		console.log(app.globalData.phone)
		if (app.globalData.phone) {
			if (this.data.isIos === 'IOS') {
				this.iosPayAction()
				// this.toPay()
			} else {
				this.toPay()
			}
		} else {
			this.setData({
				get_phone_show: true,
			})
		}
	},
	// ios端报名
	iosPayAction() {
		wx.setClipboardData({
			data: 'zsj18515626092',
			success(res) {
				wx.showToast({
					title: '客服微信号已复制成功，请添加微信客服', //提示的内容,
					icon: 'none', //图标,
					duration: 5000, //延迟时间,
					mask: true, //显示透明蒙层，防止触摸穿透,
				})
			},
		})
		console.log('iosPay')
	},
	// 安卓端直接购买
	toPay() {
		console.log('andriodPay')
		wx.request({
			url:
				'https://pbc.kaolakaola.cn/kkof/pay/createOrder/' +
				app.globalData.userObj.id,
			method: 'post',
			data: {},
			header: {
				'content-type': 'application/json', // 默认值
			},
			success(res) {
				console.log(res)
				if (res.data.code === 0) {
					let viewData = res.data.result
					wx.requestPayment({
						timeStamp: viewData.timeStamp.toString(),
						nonceStr: viewData.nonceStr,
						package: viewData.packageValue,
						signType: 'MD5',
						paySign: viewData.paySign,
						success(res) {
							wx.showToast({
								title: '支付成功', //提示的内容,
								icon: 'success', //图标,
								duration: 2000, //延迟时间,
								mask: true, //显示透明蒙层，防止触摸穿透,
								success: (res) => {
									wx.reLaunch({ url: '/pages/practiceIndex/practiceIndex' })
								},
							})
						},
						fail(res) {
							console.log(res)
							wx.showToast({
								title: '支付失败', //提示的内容,
								icon: 'success', //图标,
								duration: 2000, //延迟时间,
								mask: true, //显示透明蒙层，防止触摸穿透,
							})
						},
					})
				} else {
					wx.showToast({
						title: '生成订单失败', //提示的内容,
						icon: 'fail', //图标,
						duration: 2000, //延迟时间,
						mask: true, //显示透明蒙层，防止触摸穿透,
					})
				}
			},
		})
	},
	// 获取手机号
	getPhoneNumber(e) {
		if (e.detail.iv) {
			request(
				'post',
				'/phone',
				{
					sessionKey: app.globalData.sessionKey,
					signature: this.data.wxUserData.signature,
					rawData: this.data.wxUserData.rawData,
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
					openId: app.globalData.openId,
				},
				1,
			).then((res) => {
				app.globalData.phone = res.phone.phoneNumber
				this.setData({
					get_phone_show: false,
				})
				this.sign_action()
			})
		}
	},
	close_get_phone() {
		this.setData({
			get_phone_show: false,
		})
	},
	show_get_phone() {
		console.log(1)
	},
	get_user_info(res) {
		console.log(11111)
		if (res.detail.iv) {
			this.setData({
				canIUse: false,
				wxUserData: res.detail,
			})
			request(
				'post',
				'/info',
				{
					sessionKey: app.globalData.sessionKey,
					signature: res.detail.signature,
					rawData: res.detail.rawData,
					encryptedData: res.detail.encryptedData,
					iv: res.detail.iv,
					schoolCode: app.globalData.businessInfo.schoolCode,
				},
				1,
			).then((res) => {
				console.log(res)
				app.globalData.userInfo = res.result
				app.globalData.userObj = res.result
				if (!app.globalData.phone) {
					this.setData({
						get_phone_show: true,
					})
				} else {
					this.sign_action()
				}
			})
		}
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
})
