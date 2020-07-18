// pages/practiceIndex/practiceIndex.js
import Util from '../../utils/util.js'
import Config from '../../utils/config.js'
import { request } from '../../utils/api'

let app = getApp()
let iHValue
let fromSource
let change = false

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		navMarginTop: '',
		headUrl: '',
		userName: '',
		currentNav: true,
		topicOneAnswerCount: {
			already: 0,
			all: 0,
		},
		topicFourAchievement: 0,
		onePracticeAnswerCount: {},
		fourPracticeAnswerCount: {},
		oneLast3Achievement: 0,
		fourLast3Achievement: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		let that = this
		that.setData({
			navMarginTop: app.globalData.marginTop,
			headUrl: app.globalData.userObj.avatarUrl,
			userName: app.globalData.userObj.nickName,
		})
		this.getAnswerCount()
		this.getLast3Achievement()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},

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
	clickOne() {
		this.setData({
			currentNav: true,
			topicOneAnswerCount: this.data.onePracticeAnswerCount,
			topicFourAchievement: this.data.oneLast3Achievement,
		})
	},
	clickFour() {
		this.setData({
			currentNav: false,
			topicOneAnswerCount: this.data.fourPracticeAnswerCount,
			topicFourAchievement: this.data.fourLast3Achievement,
		})
	},
	// 做过多少题
	getAnswerCount() {
		request(
			'get',
			`/getAnswerCount/${app.globalData.userObj.id}/1`,
			{},
			1,
		).then((res) => {
			if (res.code == 0) {
				console.log(res)
				this.setData({
					topicOneAnswerCount: res.result,
					onePracticeAnswerCount: res.result,
				})
			}
		})
		request(
			'get',
			`/getAnswerCount/${app.globalData.userObj.id}/4`,
			{},
			1,
		).then((res) => {
			if (res.code == 0) {
				console.log(res)
				this.setData({
					fourPracticeAnswerCount: res.result,
				})
			}
		})
	},
	getLast3Achievement() {
		request(
			'get',
			`/getLast3Achievement/1/${app.globalData.userObj.id}`,
			{},
			1,
		).then((res) => {
			if (res.code == 0) {
				console.log(res)
				this.setData({
					oneLast3Achievement: res.aver || 0,
					topicFourAchievement: res.aver || 0,
				})
			}
		})
		request(
			'get',
			`/getLast3Achievement/4/${app.globalData.userObj.id}`,
			{},
			1,
		).then((res) => {
			if (res.code == 0) {
				this.setData({
					fourLast3Achievement: res.aver || 0,
				})
			}
		})
	},
	jumpToPractice() {
		let that = this
		wx.navigateTo({
			url: `/pages/answer/answer?type=${that.data.currentNav ? 1 : 4}`,
		})
	},
	jumpToTest() {
		let that = this
		wx.navigateTo({
			url: `/pages/examAnswer/examAnswer?type=${that.data.currentNav ? 1 : 4}`,
		})
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
})
