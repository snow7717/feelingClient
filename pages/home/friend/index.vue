<template>
	<view class="container">
		<uni-list class="request">
			<uni-list-item title="好友申请" v-bind:show-badge="true" v-bind:badge-text="reqcount == 0 ? '' : reqcount + ''" showArrow to='/pages/home/friend/request'></uni-list-item>
		</uni-list>
		<uni-collapse>
		  <uni-collapse-item v-bind:title="'我的好友 (' + friends.length + ')'" v-bind:open="true">
				<uni-swipe-action>
					<uni-swipe-action-item v-for="(item,index) in friends" v-bind:key='index' v-bind:right-options="options" @click="handleAction($event,item)">
						<uni-list>
							<uni-list-chat v-bind:title="item.from._id == user._id ? item.to.name : item.from.name" v-bind:avatar="item.from._id == user._id ? item.to.avatar : item.from.avatar" v-bind:note="item.from._id == user._id ? item.to.motto : item.from.motto"></uni-list-chat>
						</uni-list>
					</uni-swipe-action-item>
				</uni-swipe-action>			
		  </uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<style lang="stylus" scoped>
	.container{
		padding-bottom 20rpx
		.request{
			border-bottom #eee solid 20rpx
		}
	}
</style>

<script>
	import socket from '@/socket.js'
		
	export default {
		name: 'friend',
		data() {
			socket.on('friendreq',(data) => {
				this.reqcount = data.count
			})
			return {
				reqcount: 0,
				friends: [],
				user: {},
				options: [
					{
					  text: '删除',
					  style: {
					    backgroundColor: '#dd524d'
					  }
					}
				]
			}
		},
		onShow() {
			this.user = uni.getStorageSync('user')
			this.getCount()
			this.index()
		},
		methods: {
			getCount() {
				this.request({
					url: '/friendreq/count',
					success: res => {
						this.reqcount = res.data.data
					}
				})
			},
			index() {
				this.request({
					url: '/friend',
					success: res => {
						this.friends = res.data.data
					}
				})
			},
			handleAction(e,item) {
				uni.showModal({
				  content: '确定删除该好友吗?',
				  success: res => {
				    if (res.confirm) {
							this.request({
								url: '/friend/delete',
								method: 'DELETE',
								data: {
									_id: item._id
								},
								success: res1 => {
									uni.showToast({
										title: res1.data.message,
										icon: 'none'
									})
									if(res1.data.success) {
										let friend = this.friends.filter((itemer) => {
											return itemer._id == item._id
										})[0]
										let i = this.friends.indexOf(friend)
										this.friends.splice(i,1)
									}
								} 
							})
				    }
				  }
				})
			}
		}
	}
</script>
