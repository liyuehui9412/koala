// 公共请求方法
let app = getApp()

function requestApi(type, reqUrl, params, requestNum = 2) {
	app = getApp()

	return new Promise((resolve, reject) => {
		wx.getNetworkType({
			success: function(res) {
				// 返回网络类型, 有效值：
				// wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
				var networkType = res.networkType
				if (
					networkType == 'none' ||
					networkType == undefined ||
					networkType == 'unknown'
				) {
					wx.hideLoading()
					reject({ code: 2002, msg: '无网络' })
				} else {
					wx.request({
						login: true,
						url: `${reqUrl}`,
						method: `${type}`,
						data: params,
						header: {
							'content-type': 'application/json',
						},
						success: function(res) {
							console.log('res', res)
							// resolve(res);
							if (res.data.iHCode == 2000) {
								resolve(res)
							} else {
								requestNum++
								if (requestNum <= 3) {
									console.log(
										'请求失败，执行第' +
											requestNum +
											'次重试',
									)
									requestApi(type, reqUrl, params, requestNum)
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
								image: '/images/warn.png',
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
	request: function(type, reqUrl, params, requestNum) {
		return requestApi(type, reqUrl, params, requestNum)
	},
}
