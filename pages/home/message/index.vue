<template>
	<view class="container">
		<uni-list>
		  <uni-list v-bind:border="true">
		    <uni-list-chat title="uni-app" avatar="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png" note="您收到一条新的消息" time="2020-02-02 20:20" badge-text="12"></uni-list-chat>
		  </uni-list>
			<uni-list v-bind:border="true">
			  <uni-list-chat title="uni-app" avatar="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png" note="您收到一条新的消息" time="2020-02-02 20:20" badge-text="12"></uni-list-chat>
			</uni-list>
		</uni-list>
	</view>
</template>

<style lang='stylus' scoped>
</style>

<script>
	export default {
		name: 'message',
		data() {
			return {
				user: {}
			}
		},
		computed: {},
		onShow() {
			this.user = uni.getStorageSync('user')
			if(this.user._id) {
			}else{
				uni.redirectTo({
					url: '/pages/user/login/index'
				})
			}
		},
		methods: {
		}
	}
</script>
