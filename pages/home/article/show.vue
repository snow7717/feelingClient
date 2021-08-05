<template>
	<view class="container">
		<view class="header">
			<uni-icons type="arrowleft" class="back" size="24" v-on:click='back'></uni-icons>
			<text class="header-title f-tac f-fwb">文章浏览</text>
			<uni-icons v-on:click='togglePraise(article._id)' v-bind:type='article.praises.indexOf(user._id) == -1 ? "hand-thumbsup" : "hand-thumbsup-filled"' color="#999" class="icon"></uni-icons>
			<text class="num">{{article.praises.length}}</text>
		</view>
		<uni-title class="article-title" type="h4" v-bind:title="article.title" align="center"></uni-title>
		<text class="article-content f-db">{{article.content}}</text>
		<view class="article-images" v-if="article.images.length > 0">
			<image v-for="(image,i) in article.images" v-bind:key='i' v-bind:src="image" mode="aspectFill" v-on:click='previewImage(i,article.images)' class="article-image"></image>
		</view>
		<view class="author-wrapper f-tar">
			<image v-bind:src="article.author.avatar" mode="widthFix" class="avatar f-ib"></image>
			<text class="author f-ib f-vat">{{article.author.name}}</text>
			<text class="f-db">发表于 {{article.created_at}}</text>
		</view>
		<view class="view-comment f-tac" v-on:click='opencomment'>
			<text>查看全部评论</text>
			<uni-icons type="arrowdown" size="12"></uni-icons>
			<uni-icons type="chat" color="#999" class="icon" size="12"></uni-icons>
			<text class="num">{{comment.total}}</text>
		</view>
		<uni-popup ref="comment" type="bottom">
			<scroll-view class="comment-popup" scroll-y @scrolltoupper='commentRefresh' @scrolltolower='commentLoadmore'>
				<five-commentlist v-bind:commentList="comment.data" v-on:clickPraise="commentPraise" v-on:clickDelete="delcomment" v-bind:user="user"></five-commentlist>
				<view class="form f-tac">
					<uni-easyinput type='textarea' autoHeight v-model="form.content" placeholder="评论千万条,友善第一条" class="f-ib"></uni-easyinput>
					<button type="primary" class="send f-ib" size="mini" v-bind:disabled="form.content.length == 0" v-on:click='submit'>发送</button>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<style lang="stylus" scoped>
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
	.article-title{
		padding-left 20rpx
		padding-right 20rpx
	}
	.article-content{
		padding 20rpx
	}
	.article-images{
		padding-left 20rpx
		padding-right 20rpx
		.article-image{
			width 120rpx
			max-height 120rpx
			margin-right 22rpx
		}
	}
	.author-wrapper{
		border-top #ddd solid 2rpx
		border-bottom #ddd solid 2rpx
		padding 20rpx
		margin-top 20rpx
		margin-bottom 20rpx
		.author{
			line-height 60rpx
		}
		.avatar{
			width 60rpx
			margin-right 10rpx
		}
	}
	.icon{
		margin-left 10rpx
		margin-right 5rpx
	}
	.comment-popup{
		padding-bottom 320rpx
		max-height 600rpx
		background-color white
		overflow auto
	}
	.form{
		padding 20rpx
		position fixed
		bottom 20rpx
		left 0
		z-index 4
		width 710rpx
		background-color white
	}
	.send{
		margin-top 20rpx
	}
</style>

<script>
	import fiveCommentlist from '@/components/five-commentlist/five-commentlist.vue'
	const app = getApp()
	
	export default {
		name: 'articleShow',
		data() {
			return {
				article: {
					author: {},
					images: [],
					praises: []
				},
				user: {},
				comment: {
					page: 1,
					data: [],
					total: 0
				},
				form: {
					article: '',
					content: '',
					commentator: ''
				}
			}
		},
		components: {
			fiveCommentlist
		},
		onShow() {
			this.user = uni.getStorageSync('user')
			this.form.commentator = this.user._id
		},
		onLoad(option) {
			this.form.article = option._id
			this.show(option._id)
			this.commentIndex()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			show(_id) {
				this.request({
					url: '/article/show',
					data:  {
						_id: _id
					},
					success: res => {
						this.article = res.data.data
					}
				})
			},
			previewImage(i,images) {
				uni.previewImage({
					current: i,
					urls: images
				})
			},
			togglePraise(_id) {
				this.request({
					url: '/article/praise',
					method: 'POST',
					data: {
						article: _id
					},
					success: res => {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
						if(res.data.success)  {
							this.article.praises = res.data.data.praises
						}
					}
				})
			},
			opencomment() {
			  this.$refs.comment.open()
			},
			commentIndex() {
				uni.request({
					url: app.globalData.serverUrl + '/comment',
					data: {
						article: this.form.article,
						page: this.comment.page,
						limit: 10
					},
					success: res => {
						this.comment.data = this.comment.data.concat(res.data.data)
						this.comment.total = res.data.total
					}
				})
			},
			commentRefresh() {
				this.comment.page = 1
				this.comment.data = []
				this.commentIndex(this.form.article)
			},
			commentLoadmore() {
				this.comment.page ++
				this.commentIndex(this.form.article)
			},
			commentPraise(e) {
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
			delcomment(e) {
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
										let comment = this.comment.data.filter((item) => {
											return item._id == e._id
										})[0]
										let i = this.comment.data.indexOf(comment)
										this.comment.data.splice(i,1)
									}
								}
							})
				    }
				  }
				})
			},
			submit() {
				this.request({
					url: '/comment/create',
					method: 'POST',
					data: this.form,
					success: res => {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
						if(res.data.success) {
							this.commentIndex(this.form.article)
							this.form.content = ''
						}
					}
				})
			}
		}
	}
</script>
