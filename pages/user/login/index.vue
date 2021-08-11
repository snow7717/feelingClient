<template>
	<view class="container">
		<view class="header">
			<uni-icons type="arrowleft" class="back" size="24" v-on:click='back'></uni-icons>
			<text class="header-title f-tac f-fwb">用户登录</text>
			<uni-icons v-on:click='gohome' type='home' color="#999" class="icon" size="24"></uni-icons>
		</view>
		<uni-forms ref="form" v-bind:modelValue="form" v-bind:rules="rules" class="form">
		  <uni-forms-item name="name">
		    <uni-easyinput type="text" v-model="form.name" placeholder="请输入姓名" />
		  </uni-forms-item>
			<uni-forms-item name="password">
			  <uni-easyinput type="password" v-model="form.password" placeholder="请输入密码" />
			</uni-forms-item>
			<view class="f-tac">
				<button @click="submit" size="mini" type="primary">登录</button>
			</view>
		</uni-forms>
	</view>
</template>

<style lang='stylus' scoped>
	.container{
		.header{
			padding 20rpx
			background-color #EEEEEE
			display flex
			height 60rpx
			line-height 60rpx
			margin-bottom 20rpx
			.back{
				width 50rpx
			}
			.header-title{
				flex 1
			}
		}
		.form{
			padding 20rpx
		}
	}
</style>

<script>
	import uniEasyinput from '@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue'
	import socket from '@/socket.js'
	const app = getApp()
	
	export default {
		name: 'login',
		data() {
			return {
				form: {
					name: 'jack',
					password: '111111'
				},
				rules: {
					name: {
						rules: [
							{
								required: true,
								errorMessage: '请输入姓名'
							}
						]
					},
					password: {
						rules: [
							{
								required: true,
								errorMessage: '请输入密码'
							},
							{
							  minLength: 6,
							  maxLength: 16,
							  errorMessage: '密码长度在 6 到 16 个字符',
							}
						]
					}
				}
			}
		},
		components: {
			uniEasyinput
		},
		onLoad(option) {
			
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			gohome() {
				uni.switchTab({
					url: '/pages/home/index/index'
				})
			},
			submit(form) {
			  this.$refs.form.submit().then(res => {
			    uni.request({
						url: `${app.globalData.serverUrl}/user/login`,
						method: 'POST',
						data: {
							name: this.form.name,
							password: this.form.password
						},
						success: res => {
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
							if(res.data.success)  {
								uni.setStorage({
									key: 'user',
									data: res.data.data,
									complete: () => {
										socket.connect()
									}
								})
								uni.setStorageSync('authorization', res.data.token)
								uni.setStorageSync('unread', res.data.unread == 0 ? '' : res.data.unread > 99 ? '99+' : res.data.unread + '')
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/user/index/index'
									})
								}, 1500)
							}
						}
					})
			  }).catch(err =>{
			    console.log('表单错误信息：', err)
			  })
			}
		}
	}
</script>
