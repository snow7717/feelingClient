<template>
	<view class="container">
		 <five-commentlist v-bind:user='user' v-bind:commentList="comments" v-on:clickPraise="togglePraises" v-on:clickDelete="del"></five-commentlist>
	</view>
</template>

<style lang="stylus" scoped>

</style>

<script>
	import fiveCommentlist from '@/components/five-commentlist/five-commentlist.vue'
	const app = getApp()
	
	export default {
		name: 'comment',
		data() {
			return {
				article: '',
				comments: [],
				page: 1,
				isall: false
			}
		},
		computed: {
			user() {
				return uni.getStorageSync('user')
			}
		},
		components: {
			fiveCommentlist
		},
		onLoad(option) {
			this.article = option._id
			this.index()
		},
		onPullDownRefresh() {
			this.page = 1
			this.articles = []
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
			index() {
				uni.request({
					url: app.globalData.serverUrl + '/comment',
					data: {
						article: this.article,
						page: this.page,
						limit: 10
					},
					success: res => {
						this.comments = this.comments.concat(res.data.data)
					}
				})
			},
			togglePraises(e) {
				this.request({
					url: '/comment/praise',
					method: 'POST',
					data: {
						_id: e._id
					},
					success: res => {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
						if(res.data.success)  {
							e.praises = res.data.data.praises
						}
					}
				})
			},
			del(e) {
				uni.showModal({
				  content: '确定删除您的该条评论?',
				  success: res => {
				    if (res.confirm) {
							this.request({
								url: '/comment/delete',
								method: 'DELETE',
								data: {
									_id: e._id
								},
								success: res => {
									uni.showToast({
										title: res.data.message,
										icon: 'none'
									})
									if(res.data.success) {
										let comment = this.comments.filter((item) => {
											return item._id == e._id
										})[0]
										let i = this.comments.indexOf(comment)
										this.comments.splice(i,1)
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
