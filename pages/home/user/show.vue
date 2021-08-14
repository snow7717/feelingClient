<template>
	<view class="container">
		<view class="header">
			<uni-icons type="arrowleft" class="back" size="24" v-on:click='back'></uni-icons>
			<text class="header-title f-tac f-fwb">用户资料</text>
			<uni-icons color="#999" class="icon" type="personadd" size="20" v-on:click='showprompt'></uni-icons>
		</view>
		<uni-list>
			<uni-list-item clickable>
				<text slot='header' class="avatar-label f-fs2">头像</text>
				<image v-on:click.stop='preview' v-bind:src='viewuser.avatar' slot='footer' class="avatar" mode="aspectFill"></image>
			</uni-list-item>
			<uni-list-item title='昵称' v-bind:rightText="viewuser.name"></uni-list-item>
			<uni-list-item title='注册时间' v-bind:rightText='viewuser.created_at'></uni-list-item>
			<uni-list-item title='他的发表' v-bind:rightText='count + ""' showArrow v-bind:to="'/pages/home/user/article?author=' + viewuser._id"></uni-list-item>
		</uni-list>
		<prompt v-bind:visible.sync="promptVisible" isMutipleLine placeholder="请输入验证消息" @confirm="send" mainColor="#e74a39"></prompt>
	</view>
</template>

<style lang="stylus" scoped>
	.container{
		.header{
			padding 20rpx
			background-color #EEEEEE
			display flex
			height 60rpx
			line-height 60rpx
			.back{
				width 50rpx
			}
			.header-title{
				flex 1
			}
		}
		.avatar-label{
			line-height 60rpx
		}
		.avatar{
			width 60rpx
			max-height 60rpx
			border-radius 10rpx
		}
	}
</style>

<script>
	import prompt from '@/components/zz-prompt/index.vue'
	import socket from '@/socket.js'
	const app = getApp()
	
	export default {
		name: 'usershow',
		data() {
			return {
				viewuser: {},
				count: 0,
				promptVisible: false
			}
		},
		computed: {
			user() {
				return uni.getStorageSync('user')
			}
		},
		components: {
			prompt
		},
		onLoad(option) {
			this.show(option._id)
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			show(_id) {
				uni.request({
					url: `${app.globalData.serverUrl}/user/show`,
					data: {
						_id: _id
					},
					success: res => {
						this.viewuser = res.data.data
						this.count = res.data.count
					}
				})
			},
			preview() {
				uni.previewImage({
					urls: [this.user.avatar]
				})
			},
			showprompt() {
				if(this.user._id) {
					this.request({
						url: '/friend/isfriend',
						data: {
							to: this.viewuser._id
						},
						success: res => {
							if(res.data.data) {
								uni.showToast({
									title: '你们已经是好友了,无需重复添加',
									icon: 'none'
								})
							}else{
								this.request({
									url: '/friendreq/isrequested',
									data: {
										to: this.viewuser._id
									},
									success: res1 => {
										if(res1.data.data) {
											let title
											if(res1.data.data.from == this.user._id) {
												title = '您已经向对方发送好友验证,请等待对方验证'
											}else{
												title = '对方已向您发送好友验证，请去好友申请页面查看'
											}
											uni.showToast({
												title: title,
												icon: 'none',
												duration: 3000
											})
										}else{
											this.promptVisible = true
										}
									}
								})
								
							}
						}
					})
				}else{
					uni.showToast({
						title: '您还未登录,请先登录',
						icon: 'none'
					})
				}
			},
			send(e) {
				socket.emit('friendreq', {
					from: this.user._id,
					to: this.viewuser._id,
					message: e
				})
				this.promptVisible = false
				uni.showToast({
					title: '好友申请发送成功,请等待对方验证',
					icon: 'none'
				})
			}
		}
	}
</script>
