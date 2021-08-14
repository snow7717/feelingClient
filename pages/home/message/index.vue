<template>
	<view class="container">
		<text class="no-message f-db f-tac" v-if='messages.filter((item) => {return item.deletes.indexOf(user._id) == -1}).length == 0'>您还未收到任何消息~</text>
		<uni-swipe-action v-else>
			<uni-swipe-action-item v-for='(item,index) in messages' v-bind:key='index' v-if='item.deletes.indexOf(user._id) == -1' v-bind:right-options="options" @click="handleAction($event,item.from._id)">
				<uni-list v-bind:border="true" >
					<uni-list-chat v-on:click='go(item.from._id == user._id ? `/pages/home/message/chat?_id=${item.to._id}&name=${item.to.name}` : `/pages/home/message/chat?_id=${item.from._id}&name=${item.from.name}`)' clickable v-bind:title="item.from.name == user.name ? item.to.name : item.from.name" v-bind:avatar="item.from.name == user.name ? item.to.avatar : item.from.avatar" v-bind:note="item.messages[item.messages.length - 1].content" v-bind:time="item.messages[item.messages.length - 1].created_at" v-bind:badge-text="item.unread"></uni-list-chat>
				</uni-list>
			</uni-swipe-action-item>
		</uni-swipe-action>		
	</view>
</template>

<style lang='stylus' scoped>
	.no-message{
		color #999
		margin-top 100rpx
	}
</style>

<script>
	import socket from '@/socket.js'
	
	export default {
		name: 'message',
		data() {
			socket.on('message',(data) => {
				let messages = this.messages.filter((item) => {
					return (item.from._id == data.from._id && item.deletes.indexOf(this.user._id) == -1) || (item.to._id == data.from._id && item.deletes.indexOf(this.user._id) == -1)
				})
				if(messages.length == 0) {
					this.messages.push({
						from: data.from,
						to: data.to,
						messages: [data],
						deletes: data.deletes
					})
				}else{
					messages[0].messages.push(data)
				} 
				
				for(let item of this.messages) {
					this.$set(item,'unread',item.messages.filter((itemer) => {
						return itemer.read == false
					}).length)
				}
			})
			return {
				user: {},
				messages: [],
				options:[
				  {
				    text: '删除',
				    style: {
				      backgroundColor: '#dd524d'
				    }
				  }
				],
			}
		},
		computed: {},
		onShow() {
			this.user = uni.getStorageSync('user')
			if(this.user._id) {
			}else{
				uni.redirectTo({
					url: '/pages/user/login/index'
				})
			}
			this.index()
		},
		onLoad(option) {
			
		},
		methods: {
			go(url) {
				uni.navigateTo({
					url: url
				})
			},
			index() {
				this.messages = []
				this.request({
					url: '/message',
					success: res => {
						let unread = res.data.data.filter((item) => {
							return item.read == false && item.from._id != this.user._id && item.deletes.indexOf(this.user._id) == -1
						}).length
						if(unread == 0) {
							uni.removeTabBarBadge({
								index: 1
							})
						}else{
							uni.setStorageSync('unread', unread + '')
							uni.setTabBarBadge({
							  index: 1,
							  text: unread + ''
							})
						}
						for(let item of res.data.data) {
							let messages = this.messages.filter((itemer) => {
								return itemer.from._id == item.from._id || itemer.from._id == item.to._id
							})
							if(messages.length == 0) {
								this.messages.unshift({
									from: item.from,
									to: item.to,
									messages: [item].filter((itemer) => {
										return itemer.deletes.indexOf(this.user._id) == -1
									}),
									deletes: item.deletes
								})
							}else{
								if(item.deletes.indexOf(this.user._id) == -1) {
									messages[0].messages.unshift(item)
								}
							} 
						}
						for(let item of this.messages) {
							this.$set(item,'unread',item.messages.filter((itemer) => {
								return itemer.read == false && itemer.from._id != this.user._id
							}).length)
						}
					}
				})
			},
			handleAction(e,_id) {
				switch (e.index){
					case 0:
						this.del(_id)
					  break
				}
			},
			del(_id) {
				uni.showModal({
					content: '确定删除该对话及聊天记录?',
					success: (res) => {
					  if (res.confirm) {
					    this.request({
					    	url: '/message/delchat',
					    	method: 'DELETE',
					    	data: {
					    		from: this.user._id,
					    		to: _id
					    	},
					    	success: res => {
					    		uni.showToast({
					    			title: res.data.message,
					    			icon: 'none'
					    		})
					    		if(res.data.success) {
										this.messages = []
					    			this.index()
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
