// pages/search/search.js
import Util from '../../utils/util.js'
import Api from '../../utils/api.js'
import Config from '../../utils/config.js'

let app = getApp()

Page({
	data: {
		navMarginTop: '',
	},
	onLoad: function(options) {
		wx.hideShareMenu({
			menus: ['shareAppMessage', 'shareTimeline'],
		})
		let that = this
		that.setData({
			navMarginTop: app.globalData.marginTop,
		})
	},
	onReady: function() {},
	onShow: function() {},
	start() {
		// wx.navigateTo({
		//   url: '/pages/examResult/examResult?type=1',
		// })
		wx.navigateTo({
			// url: '/pages/examResult/examResult?achievement='+23+'&testTime='+ '12:23' +'&highestScore='+ 45 +'&type='+1,
			url:
				'/pages/result/result?practiceTime=' +
				'12:23' +
				'&wrongNum=' +
				13 +
				'&practiceNum=' +
				45 +
				'&type=' +
				1,
		})
	},
})
