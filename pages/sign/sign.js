// pages/search/search.js
import Util from '../../utils/util.js'
import Api from '../../utils/api.js'
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
	},
	onLoad: function(options) {
		let that = this
		that.setData({
			navMarginTop: app.globalData.marginTop,
		})
		// 查看是否授权
		wx.getSetting({
			success(res) {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称
					wx.getUserInfo({
						success: function(res) {
							console.log(res)
							that.setData({
								wxUserData: res,
							})
							app.globalData.userInfo = res.userInfo
						},
					})
				}
			},
		})
	},
	onReady: function() {},
	onShow: function() {
		console.log('onShow')
	},
	// 报名操作
	sign_action() {
		console.log(this.globalData.phone)
		if (app.globalData.phone) {
			if (this.data.isIos === 'IOS') {
				this.iosPayAction()
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
		console.log('iosPay')
	},
	// 安卓端直接购买
	toPay() {
		console.log('andriodPay')
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
				},
				1,
			).then((res) => {
				this.setData({
					get_phone_show: true,
				})
			})
			app.globalData.userInfo = res.detail.userInfo
		}
	},
})
