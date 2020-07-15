import Config from './config.js'
console.log(Config)
let app = getApp()

function requestApi(type, nav, params, requestNum) {
	app = getApp()
	let token = wx.getStorageSync('token') || ''
	if (token != '') {
		params.token = token
	}
	return new Promise((resolve, reject) => {
		wx.getNetworkType({
			success: function(res) {
				console.log(res)
				// 返回网络类型, 有效值：
				// wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
				var networkType = res.networkType
				if (
					networkType == 'none' ||
					networkType == undefined ||
					networkType == 'unknown'
				) {
					wx.hideLoading()
					wx.navigateTo({
						url: '/pages/notNet/notNet',
					})
					reject({ code: 2002, msg: '无网络' })
				} else {
					wx.request({
						login: true,
						url: `${Config.API_URL}${nav}`,
						method: `${type}`,
						data: params,
						header: {
							'content-type': 'application/json',
						},
						success: function(res) {
							if (res.data.code == 0) {
								resolve(res.data)
							} else {
								requestNum++
								if (requestNum <= 3) {
									console.log(
										'请求失败，执行第' +
											requestNum +
											'次重试',
									)
									requestApi(type, nav, params, requestNum)
										.then((res) => {
											resolve(res)
										})
										.catch((err) => {
											reject(err)
										})
								} else {
									console.log('第三次请求失败，返回错误信息')
									resolve(res)
								}
							}
						},
						fail: function() {
							reject({ code: 2001, msg: '请求超时' })
							wx.hideLoading()
							wx.showToast({
								title: '网络异常',
								image: '/image/warn.png',
								duration: 1500,
							})
						},
					})
				}
			},
		})
	})
}

module.exports = {
	request: function(type, nav, params, requestNum) {
		return requestApi(type, nav, params, requestNum)
	},
}
