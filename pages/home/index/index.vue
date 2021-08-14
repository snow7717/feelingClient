<template>
	<view class="container">
		<view class="card" v-for='(item,index) in articles' v-bind:key='index'>
			<view class="card-header">
				<image class="avatar" v-bind:src='item.author.avatar' mode="widthFix" v-on:click='go(item.author._id == user._id ? "/pages/user/info/index" : "/pages/home/user/show?_id=" + item.author._id)'></image>
				<view class="header-info">
					<text class="author-name f-db">{{item.author.name}}</text>
					<text class="created-at f-db">{{item.created_at}} 发布</text>
				</view>
			</view>
			<view class='card-body' v-on:click='go("/pages/home/article/show?_id=" + item._id)'>
				<text class="article-title f-fwb f-db">{{item.title}}</text>
				<text class="article-content f-db">{{item.content}}</text>
				<view class="article-images" v-if='item.images.length > 0'>
					<image v-for="(image,i) in item.images" v-bind:key='i' v-if='i < 3' v-bind:src="image" mode="aspectFill" v-on:click.stop='previewImage(i,item.images)' class="article-image"></image>
					<uni-icons type="more-filled" size="36" v-if='item.images.length > 3'></uni-icons>
				</view>
			</view>
			<view class="card-footer" v-if='user._id'>
				<view class="praise-wrapper f-ib" v-on:click='togglePraise(item._id)'>
					<uni-icons v-bind:type='item.praises.indexOf(user._id) == -1 ? "hand-thumbsup" : "hand-thumbsup-filled"' color="#999" class="icon"></uni-icons>
					<text class="num">{{item.praises.length}}</text>
				</view>
				<view class="comment-wrapper f-ib" v-on:click='opencomment(item)'>
					<uni-icons type="chat" color="#999" class="icon"></uni-icons>
					<text class="num">{{item.comments.length}}</text>
				</view>
			</view>
		</view>
		<text class="load-all f-db f-tac" v-if="isall" v-on:click="backTop">已经加载全部了~</text>
		<uni-icons v-show="scroll > 500" type="arrowthinup" class="backtop" size="24" v-on:click='backtop'></uni-icons>
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
	.container{
		padding 20rpx 20rpx 120rpx 20rpx
		.card{
			margin-bottom 20rpx
			border-bottom #eee solid 20rpx
			padding-bottom 20rpx
			.card-header{
				display flex
				.avatar{
					width 80rpx
				}
				.header-info{
					margin-left 20rpx
					.created-at{
						font-size 24rpx
						color #999
					}
				}
			}
			.card-body{
				margin-top 20rpx
				.article-title{
					display -webkit-box
					-webkit-box-orient vertical
					-webkit-line-clamp 1
					overflow hidden
				}
				.article-content{
					color #999
					display -webkit-box
					-webkit-box-orient vertical
					-webkit-line-clamp 2
					overflow hidden
				}
				.article-images{
					margin-top 20rpx
					.article-image{
						width 120rpx
						max-height 120rpx
						margin-right 20rpx
					}
				}
			}
			.card-footer{
				border-top #eee solid 2rpx
				padding-top 20rpx
				margin-top 20rpx
				.comment-wrapper{
					margin-left 100rpx
					.icon{
						margin-right 4rpx
					}
				}
				.num{
					position relative
					top -2rpx
				}
			}
		}
		.load-all{
			color #999
			margin-top 20rpx
		}
		.backtop{
			position fixed
			bottom 200rpx
			right 40rpx
		}
		.comment-popup{
			padding-bottom 400rpx
			max-height 600rpx
			background-color white
			overflow auto
		}
		.form{
			padding 20rpx
			position fixed
			bottom 100rpx
			left 0
			z-index 4
			width 710rpx
			background-color white
		}
		.send{
			margin-top 20rpx
		}
	} 
</style>

<script>
	import fiveCommentlist from '@/components/five-commentlist/five-commentlist.vue'
	const app = getApp()
	
	export default {
		data() {
			return {
				stitle: '',
				articles: [],
				page: 1,
				isall: false,
				user: {},
				comment: {
					page: 1,
					data: []
				},
				form: {
					article: '',
					content: '',
					commentator: ''
				},
				scroll: 0
			}
		},
		computed: {
		},
		components: {
			fiveCommentlist
		},
		onShow() {
			this.user = uni.getStorageSync('user')
			this.form.commentator = this.user._id
			this.initbadge()
		},
		onLoad() {
			this.index()
		},
		onNavigationBarSearchInputChanged(e) {
			this.stitle = e.text
		},
		onNavigationBarSearchInputConfirmed() {
			this.page = 1
			this.articles = []
			this.isall = false
			this.index()
		},
		onPullDownRefresh() {
			this.page = 1
			this.articles = []
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
		onPageScroll(e) {
			this.scroll = e.scrollTop
		},
		methods: {
			go(url) {
				uni.navigateTo({
					url: url
				})
			},
			backtop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			},
			initbadge() {
				if(uni.getStorageSync('unread')) {
					uni.setTabBarBadge({
					  index: 1,
					  text: uni.getStorageSync('unread') + ''
					})
				}else{
					uni.removeTabBarBadge({
						index: 1
					})
				}
				if(uni.getStorageSync('count')) {
					uni.setTabBarBadge({
					  index: 2,
					  text: uni.getStorageSync('count') + ''
					})
				}else{
					uni.removeTabBarBadge({
						index: 2
					})
				}
			},
			index() {
				uni.request({
					url: app.globalData.serverUrl + '/article',
					data: {
						title: this.stitle,
						author: '',
						page: this.page,
						limit: 10
					},
					success: res => {
						this.isall = res.data.data.length < 10
						this.articles = this.articles.concat(res.data.data)
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
							this.articles.filter((item)  => {
								return item._id == _id
							})[0].praises = res.data.data.praises
						}
					}
				})
			},
			opencomment(item) {
				this.comment.data = []
				this.form.article = item._id
				this.commentIndex(item._id)
			  this.$refs.comment.open()
			},
			commentIndex(_id) {
				uni.request({
					url: app.globalData.serverUrl + '/comment',
					data: {
						article: _id,
						page: this.comment.page,
						limit: 10
					},
					success: res => {
						this.comment.data = this.comment.data.concat(res.data.data)
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
