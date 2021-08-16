<template>
	<view class="container">
		<view class="header">
			<uni-icons type="arrowleft" class="back" size="24" v-on:click='back'></uni-icons>
			<text class="header-title f-tac f-fwb">{{to.name}}</text>
			<uni-icons color="#999" class="icon" v-bind:type="isfriend ? 'more-filled' : 'personadd'" size="24" v-on:click='isfriend ? "" : showprompt()'></uni-icons>
		</view>
		<view class="main">
			<block v-for='(item, index) in messages' v-bind:key='index'>
				<view class="message-from" v-if='item.from._id == to._id && item.to == user._id'>
					<image v-bind:src='item.from.avatar' mode="aspectFill" class="avatar f-ib"></image>
					<text class="message-content f-ib f-vat">{{item.content}}</text>
				</view>
				<view class="message-to f-tar" v-if='(item.from._id == user._id && item.to == to._id && item.to != user._id) || (item.from == user._id && item.to == to._id && item.to != user._id)'>
					<text class="message-content f-ib f-vat">{{item.content}}</text>
					<image v-bind:src='item.from.avatar || user.avatar' mode="aspectFill" class="avatar f-ib"></image>
				</view>
			</block>
		</view>
		<uni-easyinput suffixIcon="redo" type='textarea' class='input' v-model="form.content" v-bind:placeholder="isfriend ? '请输入内容' : '对方还不是您的好友，请先添加对方为好友'" @iconClick="send" v-bind:disabled='isfriend == false'></uni-easyinput>
		<cfriendadd ref='cfriendadd' v-bind:user='user' v-bind:viewuser="to"></cfriendadd>
	</view>
</template>

<style lang="stylus" scoped>
	.container{
		padding 100rpx 20rpx 200rpx 20rpx
		.header{
			background-color #EEEEEE
			position fixed
			top 0
			left 0
			z-index 4
			width 710rpx
			padding 20rpx
			display flex
			.back{
				width 50rpx
			}
			.header-title{
				flex 1
			}
		}
		.main{
			.message-from{
				margin-top 36rpx
				margin-bottom 36rpx
				.message-content{
					background-color rgb(243,243,243)
					margin-left 10rpx
				}
			}
			.message-to{
				margin-top 36rpx
				margin-bottom 36rpx
				.message-content{
					background-color rgb(223,243,253)
					margin-right 10rpx
				}
			}
			.avatar{
				width 60rpx
				height 60rpx
				border-radius 10rpx
			}
			.message-content{
				line-height 60rpx
				padding-left 20rpx
				padding-right 20rpx
				border-radius 10rpx
			}
		}
		.input{
			position fixed
			left 20rpx
			bottom 0rpx
			z-index 5
			width 690rpx
			background-color white
			padding 10rpx
			border-radius 10rpx
		}
	}
</style>

<script>
	import cfriendadd from '@/components/friend-add/index.vue'
	import socket from '@/socket.js'
	
	export default {
		name: 'chat',
		data() {
			socket.on('message', (data) => {
				this.messages.push(data)
				this.$forceUpdate()
				this.initscroll()
			})
			return {
				isfriend: false,
				to: {},
				messages: [],
				page: 1,
				isall: false,
				form: {
					content: ''
				},
				system: {}
			}
		},
		computed: {
			user() {
				return uni.getStorageSync('user')
			}
		},
		components: {
			cfriendadd
		},
		onShow() {
		},
		onLoad(option) {
			this.to = option
			this.init()
			this.index({
				initscroll: true
			})
			this.getisfriend()
		},
		onUnload() {
			this.setRead()
		},
		onPullDownRefresh() {
			if(this.isall) {
			}else{
				this.page ++
				this.index({
					initscroll: false
				})
			}
			setTimeout(() => {
			  uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			init() {
				uni.getSystemInfo({
					success: (res) => {
						this.system = res
					}
				})
			},
			getisfriend() {
				this.request({
					url: '/friend/isfriend',
					data: {
						to: this.to._id
					},
					success: res => {
						this.isfriend = res.data.data
					}
				})
			},
			initscroll() {
				this.$nextTick(() => {
					let view = uni.createSelectorQuery().select(".main")
					view.boundingClientRect((data) => {
						if(data) {
							uni.pageScrollTo({
								scrollTop: data.height,
								duration: 0
							})
						}
					}).exec()
				})
			},
			showprompt() {
				this.$refs.cfriendadd.showprompt()
			},
			index(option) {
				this.request({
					url: '/message/chatindex',
					data: {
						to: this.to._id,
						page: this.page,
						limit: 10
					},
					success: res => {
						this.isall = res.data.data.length < 10
						for(let item of res.data.data) {
							this.messages.unshift(item)
						}
						if(this.messages.filter((item) => {
							return item.read == false && item.to == this.user._id
						}).length > 0) {
							this.setRead()
						}
						if(option.initscroll) {
							this.initscroll()
						}
					}
				})
			},
			setRead() {
				this.request({
					url: '/message/setread',
					method: 'PUT',
					data: {
						from: this.to._id
					},
					success: res => {
						uni.setStorageSync('unread',rea.data.data)
					}
				})
			},
			send() {
				if(this.form.content == '') {
					uni.showToast({
						title: '您不能发送空信息',
						icon: 'none'
					})
				}else{
					socket.emit('message', {
						from: this.user,
						to: this.to._id,
						content: this.form.content
					})
					this.messages.push({
						from: this.user,
						to: this.to._id,
						content: this.form.content
					})
					this.initscroll()
					this.form.content = ''
				}
			}
		}
	}
</script>
