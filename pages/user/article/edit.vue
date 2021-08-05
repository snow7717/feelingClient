<template>
	<view class="container">
		<uni-forms v-bind:modelValue="form" ref="form" v-bind:rules='rules'>
		  <uni-forms-item name="title">
		    <uni-easyinput type="text" v-model="form.title" placeholder="请输入标题" />
		  </uni-forms-item>
		  <uni-forms-item name="content">
		    <uni-easyinput v-bind:maxlength='-1' type="textarea" v-model="form.content" placeholder="请输入内容" autoHeight></uni-easyinput>
		  </uni-forms-item>
			<imgUpload v-bind:count="9" v-bind:img_list='form.images' name="file" v-bind:url="uploadurl" v-bind:header='upheader'></imgUpload>
			<view class="f-tac">
				<button type="primary" size="mini" v-on:click="submit">提交</button>
			</view>
		</uni-forms>
	</view>
</template>

<style lang="stylus" scoped>
	.container{
		padding 20rpx
	}
</style>

<script>
	import imgUpload from '@/components/img-upload/img-upload.vue'
	const app = getApp()
	
	export default {
		name: 'articleedit',
		data() {
			return {
				upheader: {
					dirname: 'article',
					Authorization: 'Bearer ' + uni.getStorageSync('authorization')
				},
				uploadurl: app.globalData.serverUrl + '/file/upload',
				form: {
					_id: '',
					title: '',
					content: '',
					images: []
				},
				rules: {
				  title: {
				    rules: [
							{
				        required: true,
				        errorMessage: '请输入标题'
				      },
				    ]
				  },
					content: {
						rules: [
							{
								required: true,
								errorMessage: '请输入内容'
							}
						]
					}
				}	
			}
		},
		components: {
			imgUpload
		},
		onLoad(option) {
			this.show(option._id)
		},
		methods: {
			show(_id) {
				this.request({
					url: '/article/show',
					data:  {
						_id: _id
					},
					success: res => {
						this.form = res.data.data
					}
				})
			},
			submit() {
			  this.$refs.form.submit().then(res => {
			    this.request({
						url: '/article/update',
						method: 'PUT',
						data: this.form,
						success: res => {
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
							if(res.data.success) {
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								},1500)
							}
						}
					})
			  }).catch(err =>{
			    console.log('表单错误信息：', err)
			  })
			}
		}
	}
</script>
