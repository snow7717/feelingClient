<template>
	<view class="container">
		<view class="header">
			<uni-icons type="person" class="back" size="24" v-on:click='go("/pages/user/login/index")'></uni-icons>
			<text class="header-title f-tac f-fwb">用户注册</text>
			<uni-icons v-on:click='gohome' type='home' color="#999" class="icon" size="24"></uni-icons>
		</view>
		<uni-forms ref="form" v-bind:modelValue="form" v-bind:rules="rules" class="form">
		  <uni-forms-item name="name">
		    <uni-easyinput type="text" v-model="form.name" placeholder="请输入姓名" />
		  </uni-forms-item>
			<uni-forms-item name="password">
			  <uni-easyinput type="password" v-model="form.password" placeholder="请输入密码" />
			</uni-forms-item>
			<uni-forms-item name="password_repeat">
			  <uni-easyinput type="password" v-model="form.password_repeat" placeholder="请确认密码" />
			</uni-forms-item>
			<view class="f-tac">
				<button @click="submit" size="mini" type="primary">注册</button>
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
			padding-left 20rpx
			padding-right 20rpx
		}
	}
</style>

<script>
	import uniEasyinput from '@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue'
	const app = getApp()
	
	export default {
		name: 'register',
		data() {
			let validateRepeat = (rule,value,data,callback) => {
				if(value == this.form.password) {
										
				}else{
					callback('两次输入的密码不一致')
					return true
				}
			}
			return {
				form: {
					name: '',
					password: '',
					password_repeat: ''
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
					},
					password_repeat: {
						rules: [
							{
								required: true,
								errorMessage: '请确认密码'
							},
							{
								validateFunction: validateRepeat
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
			go(url) {
				uni.navigateTo({
					url: url
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
						url: `${app.globalData.serverUrl}/user/register`,
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
								uni.setStorageSync('user', res.data.data)
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
