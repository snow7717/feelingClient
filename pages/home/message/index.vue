<template>
	<view class="container">
		<uni-list>
			<uni-swipe-action>
			  <uni-swipe-action-item v-for='(item,index) in messages' v-bind:key='index' v-bind:right-options="options" @click="handleAction($event,item.from._id)">
					<uni-list v-bind:border="true" >
						<uni-list-chat v-on:click='go(`/pages/home/message/chat?_id=${item.from._id}&name=${item.from.name}`)' clickable v-bind:title="item.from.name" v-bind:avatar="item.from.avatar" v-bind:note="item.messages[0].content" v-bind:time="item.messages[0].created_at" v-bind:badge-text="item.unread"></uni-list-chat>
					</uni-list>
				</uni-swipe-action-item>
			</uni-swipe-action>		
		</uni-list>
	</view>
</template>

<style lang='stylus' scoped>
</style>

<script>
	export default {
		name: 'message',
		data() {
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
							return item.read == false
						}).length
						if(unread == 0) {
							uni.removeTabBarBadge({
								index: 1
							})
						}else{
							uni.setStorageSync('unread', unread)
							uni.setTabBarBadge({
							  index: 1,
							  text: unread + ''
							})
						}
						for(let item of res.data.data) {
							let messages = this.messages.filter((itemer) => {
								return itemer.from._id == item.from._id
							})
							if(messages.length == 0) {
								this.messages.push({
									from: item.from,
									messages: [item]
								})
							}else{
								messages[0].messages.push(item)
							} 
						}
						for(let item of this.messages) {
							this.$set(item,'unread',item.messages.filter((itemer) => {
								return itemer.read == false
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
					    			this.index(false)
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
