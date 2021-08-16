<template>
	<prompt v-bind:visible.sync="promptVisible" isMutipleLine placeholder="请输入验证消息" @confirm="send" mainColor="#e74a39"></prompt>
</template>

<style lang="stylus" scoped>
</style>

<script>
	import prompt from '@/components/zz-prompt/index.vue'
	import socket from '@/socket.js'
	
	export default {
		name: 'cfriendadd',
		props: {
			viewuser: {
				type: Object
			},
			user: {
				type: Object
			}
		},
		data() {
			return {
				promptVisible: false
			}
		},
		components: {
			prompt
		},
		methods: {
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
