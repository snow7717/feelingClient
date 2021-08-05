<template>
	<uni-list>
	  <uni-list-item title="文章列表" v-bind:rightText="total" showArrow to='/pages/user/article/list'></uni-list-item>
	  <uni-list-item title="发表文章" showArrow to='/pages/user/article/create'></uni-list-item>
	</uni-list>
</template>

<style lang='stylus' scoped>
</style>

<script>
	export default {
		name: 'articler',
		data() {
			return {
				total: '0'
			}
		},
		onShow() {
			this.index()
		},
		methods: {
			index() {
				this.request({
					url: '/article/myindex',
					data: {
						title: '',
					},
					success: res => {
						this.total = res.data.total + ''
					}
				})
			}
		}
	}
</script>
