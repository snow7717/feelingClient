<template>
	<view class="container">
		<uni-list>
			
		</uni-list>
	</view>
</template>

<style lang="stylus" scoped>
	.container{
		padding-top 20rpx
		padding-bottom 20rpx
	}
</style>

<script>
	export default {
		name: 'setting',
		data() {
			return {
				
			}
		},
		computed: {
			user() {
				return uni.getStorageSync('user')
			}
		},
		methods: {
		}
	}
</script>


