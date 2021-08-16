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
		<cfriendadd ref='cfriendadd' v-bind:user='user' v-bind:viewuser="viewuser"></cfriendadd>
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
	import cfriendadd from '@/components/friend-add/index.vue'
	const app = getApp()
	
	export default {
		name: 'usershow',
		data() {
			return {
				viewuser: {},
				count: 0
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
				this.$refs.cfriendadd.showprompt()
			}
		}
	}
</script>
