<template>
	<view class="container">
		<uni-list>
			<uni-list-item clickable showArrow v-on:click='upload'>
				<text slot='header' class="avatar-label f-fs2">头像</text>
				<image v-on:click.stop='preview' v-bind:src='user.avatar' slot='footer' class="avatar" mode="aspectFill"></image>
			</uni-list-item>
			<uni-list-item clickable v-on:click='showprompt("promptVisible")' title='昵称' showArrow v-bind:rightText="user.name"></uni-list-item>
			<uni-list-item clickable v-on:click='showprompt("promptVisible1")' title="签名" showArrow v-bind:note='user.motto'></uni-list-item>
		</uni-list>
		<prompt v-bind:visible.sync="promptVisible" placeholder="请输入昵称" v-bind:defaultValue="user.name" @confirm="updateName" mainColor="#e74a39"></prompt>
		<prompt v-bind:visible.sync="promptVisible1" placeholder="请输入签名" v-bind:defaultValue="user.motto" @confirm="updateMotto" mainColor="#e74a39"></prompt>
	</view>
</template>

<style lang="stylus" scoped>
	.container{
		padding-top 20rpx
		padding-bottom 20rpx
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
	const app = getApp()
	
	export default {
		name: 'userinfo',
		data() {
			return {
				user: {},
				promptVisible: false,
				promptVisible1: false
			}
		},
		components: {
			prompt
		},
		onLoad(option) {
			this.user = uni.getStorageSync('user')
		},
		methods: {
			preview() {
				uni.previewImage({
					urls: [this.user.avatar]
				})
			},
			upload() {
				uni.chooseImage({ 
					count: 1,
					success: res => {
						const tempFilePaths = res.tempFilePaths
						uni.uploadFile({
							url: app.globalData.serverUrl + '/file/upload',
							filePath: res.tempFilePaths[0],
							name: 'file',
							header: {
								dirname: 'avatar',
								Authorization: 'Bearer ' + uni.getStorageSync('authorization')
							},
							success: res => {
								res.data = JSON.parse(res.data)
								this.request({
									url: '/user/update',
									method: 'PUT',
									data: {
										avatar: res.data.data.url
									},
									success: res1 => {
										uni.showToast({
											title: res1.data.message,
											icon: 'none'
										})
										if(res1.data.success) {
											this.user.avatar = res.data.data.url
											uni.setStorageSync('user', this.user)
										}
									}
								})
							}
						})
					}
				})
			},
			showprompt(promptVisible) {
				this[promptVisible] = true
			},
			updateName(e) {
				this.request({
					url: '/user/update',
					method: 'PUT',
					data: {
						name: e
					},
					success: res => {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
						if(res.data.success) {
							this.promptVisible = false
							this.user.name = e
							uni.setStorageSync('user', this.user)
						}
					}
				})
			},
			updateMotto(e) {
				this.request({
					url: '/user/update',
					method: 'PUT',
					data: {
						motto: e
					},
					success: res => {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
						if(res.data.success) {
							this.promptVisible1 = false
							this.user.motto = e
							uni.setStorageSync('user', this.user)
						}
					}
				})
			}
		}
	}
</script>
