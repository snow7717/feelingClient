<template>
	<view class="container">
		<view class="header">
			<image v-bind:src='user.avatar' class="avatar" mode="aspectFill" v-on:click='go("/pages/user/info/index")'></image>
			<text class="name f-fwb" v-on:click='go("/pages/user/info/index")'>{{user.name}}</text>
			<view class="set f-tar">
				<uni-icons type="gear" size="28" v-on:click='go("/pages/user/setting/index")'></uni-icons>
			</view>
		</view>
		<uni-list>
		  <uni-list-item title="文章管理" showArrow to='/pages/user/article/index'></uni-list-item>
			<uni-list-item title="我的评论" showArrow to='/pages/user/comment/index'></uni-list-item>
			<uni-list-item title="退出登录" showArrow clickable v-on:click='logout'></uni-list-item>
		</uni-list>
	</view>
</template>

<style lang="stylus" scoped>
.container
	padding-bottom 20rpx
	padding-top 20rpx
  .header{
		margin-bottom 20rpx
		display flex
		padding-left 20rpx
		padding-right 20rpx
		.avatar{
			width 120rpx
			max-height 120rpx
		}
		.set{
			flex 1
		}
		.name{
			margin-left 20rpx
			font-size 32rpx
			width 100rpx
			line-height 120rpx
		}
	}
</style>

<script>
	import socket from '@/socket.js'
	
	export default {
		name: 'user',
		data() {
			return {
				user: {}
			}
		},
		computed: {
		},
		onShow() {
			this.user = uni.getStorageSync('user')
			if(this.user._id) {
			}else{
				uni.redirectTo({
					url: '/pages/user/login/index'
				})
			}
		},
		onLoad(option) {
			if(uni.getStorageSync('unread')) {
				uni.setTabBarBadge({
				  index: 1,
				  text: uni.getStorageSync('unread') + ''
				})
			}
			if(uni.getStorageSync('count')) {
				uni.setTabBarBadge({
				  index: 2,
				  text: uni.getStorageSync('count') + ''
				})
			}
		},
		methods: {
			go(url) {
				uni.navigateTo({
					url: url
				})
			},
			logout() {
				uni.showModal({
				  content: '确定退出?',
				  success: (res) => {
				    if (res.confirm) {
							socket.emit('remove', {
								user: this.user._id
							})
							socket.disconnect()
				      uni.removeStorageSync('user')
							uni.removeStorageSync('authorization')
							uni.removeStorageSync('unread')
							uni.removeTabBarBadge({
								index: 1
							})
							uni.removeTabBarBadge({
								index: 2
							})
							uni.showToast({
								title: '退出成功',
								icon: 'none'
							})
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/home/index/index'
								})
							},1500)
				    } else if (res.cancel) {
				    }
				  }
				})
			}
		}
	}
</script>
