export default function(option) {
	option.url = getApp().globalData.serverUrl + option.url
	try {
		// 获取放入缓存的字段token
		if (uni.getStorageSync('authorization')) {
			option.header = {
				'Authorization': 'Bearer ' + uni.getStorageSync('authorization')
			}
		} else {
			uni.redirectTo({
				url: '/pages/user/login/index'
			})
			return false
		}
	} catch (err) {
		console.error(err)
	}
	option.complete = (response) => {
		if (response.data.code == 401) {
			uni.redirectTo({
				url: '/pages/user/login/index'
			})
			return false
		}else if(response.data.code == 422){
			uni.showToast({
				title: response.data.message,
				icon: 'none'
			})
			uni.showModal({
			  title: '账号下限通知',
			  content: response.data.message,
				confirmText: '去登录',
			  success: res => {
			    if (res.confirm) {
			      uni.redirectTo({
			      	url: '/pages/user/login/index'
			      })
			    }
			  }
			})
			return false
		}
	}
	return uni.request(option)
}
