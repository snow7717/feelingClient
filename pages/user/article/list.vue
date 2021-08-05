<template>
	<view class="container">
		<uni-swipe-action>
		  <uni-swipe-action-item v-for='(item,index) in articles' v-bind:key='index' v-bind:right-options="options" @click="handleAction($event,item._id)">
				<uni-list-item v-bind:ellipsis='1' v-bind:title="item.title" v-bind:note="item.content.substring(0,15) + '...'" showArrow v-bind:rightText='item.created_at.substring(0,10)' v-bind:to='"/pages/user/article/edit?_id=" + item._id'></uni-list-item>
		  </uni-swipe-action-item>
		</uni-swipe-action>	
		<text class="load-all f-db f-tac" v-if="isall">已经加载全部了~</text>
	</view>
</template>

<style lang="stylus" scoped>
	.container{
		padding 20rpx
	}
	.load-all{
		color #999
		margin-top 20rpx
	}
</style>

<script>
	export default {
		name: 'articlelist',
		data() {
			return {
				stitle: '',
				options:[
					{
					  text: '看评论',
					  style: {
					    backgroundColor: '#409EFF'
					  }
					},
				  {
				    text: '删除',
				    style: {
				      backgroundColor: '#dd524d'
				    }
				  }
				],
				page: 1,
				articles: [],
				isall: false
			}
		},
		onLoad(option) {
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
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: '/pages/user/article/create'
			})
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
		methods: {
			index() {
				this.request({
					url: '/article/myindex',
					data: {
						title: this.stitle,
						page: this.page,
						limit: 10
					},
					success: res => {
						this.isall = res.data.data.length < 10
						this.articles = this.articles.concat(res.data.data)
					}
				})
			},
			handleAction(e,_id) {
				switch (e.index){
					case 0:
						uni.navigateTo({
							url: '/pages/user/article/comment?_id=' + _id
						})
					  break
					case 1:
					  this.del(_id)
					  break
				}
			},
			del(_id) {
				uni.showModal({
				  content: '确定删除?',
				  success: res => {
				    if (res.confirm) {
				      this.request({
				      	url: '/article/delete',
				      	method: 'DELETE',
				      	data: {
				      		_id: _id
				      	},
				      	success: res => {
				      		uni.showToast({
				      			title: res.data.message,
				      			icon: 'none'
				      		})
				      		if(res.data.success) {
				      			let article = this.articles.filter((item) => {
				      				return item._id == _id
				      			})[0]
				      			let i = this.articles.indexOf(article)
				      			this.articles.splice(i,1)
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
