<template>
	<view class="container">
		<view class="header">
			<uni-icons type="arrowleft" class="back" size="24" v-on:click='back'></uni-icons>
			<text class="header-title f-tac"></text>
			<uni-data-picker v-bind:localdata="statusdata" @change="statusChange" class="status"></uni-data-picker>
		</view>
		<text class="no-message f-db f-tac" v-if='messages.length == 0'>当前状态下没有消息~</text>
		<uni-swipe-action v-else>
			<uni-swipe-action-item v-for='(item,index) in messages' v-bind:key='index' v-bind:right-options="item.status == '待验证' ? options : options1" @click="item.status == '待验证' ? handleAction($event,item) : delrequest($event,item)">
				<uni-list v-bind:border="true" >
					<uni-list-chat v-bind:title="item.from.name" v-bind:avatar="item.from.avatar" v-bind:note="item.message ? item.message : '对方未填写验证消息'" v-bind:time="item.created_at" v-bind:badge-text="item.status"></uni-list-chat>
				</uni-list>
			</uni-swipe-action-item>
		</uni-swipe-action>		
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
			.status{
				width 170rpx
				position relative
				top -10rpx
			}
		}
		.no-message{
			color #999
			margin-top 100rpx
		}
	}
</style>

<script>
	export default {
		name: 'friendrequest',
		data() {
			return {
				messages: [],
				options: [
					{
					  text: '通过',
					  style: {
					    backgroundColor: '#67C23A'
					  }
					},
					{
					  text: '拒绝',
					  style: {
					    backgroundColor: '#dd524d'
					  }
					}
				],
				options1: [
					{
					  text: '删除',
					  style: {
					    backgroundColor: '#dd524d'
					  }
					}
				],
				page: 1,
				isall: false,
				statusdata: [
					{
						text: '全部',
						value: ''
					},
					{
						text: '待验证',
						value: '待验证'
					},
					{
						text: '已通过',
						value: '已通过'
					},
					{
						text: '已拒绝',
						value: '已拒绝'
					}
				],
				status: ''
			}
		},
		computed: {
			user() {
				return uni.getStorageSync('user')
			}
		},
		onLoad(option) {
			this.index()
		},
		onPullDownRefresh() {
			this.page = 1
			this.messages = []
			this.isall = false
			this.index()
			setTimeout(() => {
			  uni.stopPullDownRefresh()
			}, 1000)
		},
		onReachBottom() {
			if(this.isall) {
			}else{
				this.page ++
				this.index()
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			statusChange(e) {
				this.status = e.detail.value[0].value
				this.page = 1
				this.messages = []
				this.index()
			},
			index() {
				this.request({
					url: '/friendreq',
					data: {
						status: this.status,
						page: this.page,
						limit: 10
					},
					success: res => {
						this.isall = res.data.data.length < 10
						this.messages = this.messages.concat(res.data.data)
					}
				})
			},
			handleAction(e,item) {
				let status
				switch (e.index) {
					case 0:
					  status = '已通过'
					  break
					case 1:
						status = '已拒绝'
						break
				}
				this.request({
					url: '/friendreq/deal',
					method: 'POST',
					data: {
						_id: item._id,
						status: status,
						from: item.from._id
					},
					success: res => {
						uni.showToast({
						  title: res.data.message,
							icon: 'none'
						})
						if(res.data.success) {
							this.messages.filter((itemer) => {
								return itemer._id == item._id
							})[0].status = status
						}
					}
				})
			},
			delrequest(e,item) {
				this.request({
					url: '/friendreq/delete',
					method: 'DELETE',
					data: {
						_id: item._id
					},
					success: res => {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
						if(res.data.success) {
							let message = this.messages.filter((itemer) => {
								return itemer._id == item._id
							})[0]
							let i = this.messages.indexOf(message)
							this.messages.splice(i,1)
						}
					}
				})
			}
		}
	}
</script>
