<template>
	<view class="container">
		<view class="comment" v-for="(item, index) in comments" v-bind:key='index'>
			<view class="commentator">
				<image v-bind:src="user.avatar" mode="widthFix" class="commentator-avatar f-ib"></image>
				<text class="commentator-name f-ib f-vat">{{user.name}} </text>
				<text class="commentator-text f-vat">评论了文章</text>
			</view>
			<text class="comment-content">{{item.content}}</text>
			<view class="article-wrapper" v-if='item.article' v-on:click='go("/pages/home/article/show?_id=" + item.article._id)'>
				<image v-if='item.article.images.length > 0' v-bind:src='item.article.images[0]' mode="widthFix" class="article-image f-ib"></image>
				<text class="article-title f-ib f-vat">{{item.article.title}}</text>
			</view>
			<text class="deleted f-db" v-else>该文章已被删除</text>
			<text class="comment-time f-fs1 f-db">{{item.created_at}}</text>
		</view>
		<text class="load-all f-db f-tac" v-if="isall">已经加载全部了~</text>
	</view>
</template>

<style lang="stylus" scoped>
	.container{
		padding 20rpx
		.comment{
			border-bottom #ddd solid 2rpx
			padding-top 20rpx
			padding-bottom 10rpx
			.commentator{
				.commentator-avatar{
					width 60rpx
					border-radius 10rpx
				}
				.commentator-name{
					line-height 60rpx
					margin-left 10rpx
					margin-right 20rpx
					color rgb(0, 122, 200)
				}
				.commentator-text{
					line-height 60rpx
					font-size 24rpx
				}
			}
			.article-wrapper{
				margin-top 20rpx
				display flex
				background-color #eee
				border-radius 10rpx
				padding 20rpx
				.article-image{
					width 120rpx
					margin-right 20rpx
				}
				.article-title{
					flex 1
					font-size 24rpx
				}
			}
			.deleted{
				margin-top 10rpx
				color #f54100
			}
			.comment-time{
				color #999
				margin-top 10rpx
			}
		}
		.load-all{
			color #999
			margin-top 20rpx
		}
	}
</style>

<script>
	export default {
		name: 'usercomment',
		data() {
			return {
				search: {
					content: ''
				},
				page: 1,
				isall: false,
				comments: []
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
		onNavigationBarSearchInputChanged(e) {
			this.search.content = e.text
		},
		onNavigationBarSearchInputConfirmed() {
			this.page = 1
			this.comments = []
			this.isall = false
			this.index()
		},
		onPullDownRefresh() {
			this.page = 1
			this.comments = []
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
			go(url) {
				uni.navigateTo({
					url: url
				})
			},
			index() {
				this.request({
					url: '/comment/myindex',
					data: {
						content: this.search.content,
						page: this.page,
						limit: 10
					},
					success: res => {
						this.isall = res.data.data.length < 10
						this.comments = this.comments.concat(res.data.data)
					}
				})
			}
		}
	}
</script>
