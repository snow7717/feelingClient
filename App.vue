<style>
	/*每个页面公共css */
	@import '/static/css/function.css';
	@import '/static/css/common.css';
</style>

<script>	
	export default {
		globalData: {
			serverUrl: 'http://localhost:3000',
		},
		onLaunch() {
			if(uni.getStorageSync('unread')) {
				uni.setTabBarBadge({
				  index: 1,
				  text: uni.getStorageSync('unread') + '',
					fail(err) {
						console.error(err)
					}
				})
			}
		},
		onShow() {
		},
		onHide() {
		}
	}
</script>
