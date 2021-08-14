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
			/* if(uni.getStorageSync('unread')) {
				uni.setTabBarBadge({
				  index: 1,
				  text: uni.getStorageSync('unread') + ''
				})
			}else{
				uni.removeTabBarBadge({
					index: 1
				})
			}
			if(uni.getStorageSync('count')) {
				uni.setTabBarBadge({
				  index: 2,
				  text: uni.getStorageSync('count') + ''
				})
			}else{
				uni.removeTabBarBadge({
					index: 2
				})
			} */
		},
		onShow() {
		},
		onHide() {
		}
	}
</script>
