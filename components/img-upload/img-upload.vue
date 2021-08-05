<template>
	<view>
		<view class="fanku_con">
			<view class="img_z">
				<view class="f-pr" v-for="(item,index) in img_list" :key="index">
					<image @click="preview(index,img_list)" v-bind:src="item" class="image" mode="widthFix"></image>
					<image class="shancs" src="./shanchus2.png" mode="widthFix" @click="selec(index)"></image>
				</view>
				<view class="imgadf center">
					<uni-icons type="plusempty" size="36" @click="ongetimg()"></uni-icons>
					<text>上传图片</text>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped>
	.fanku_con {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 10rpx;
		padding-top: 20rpx;
		margin-bottom: 20rpx;
	}
	.preimage{
		width: 58rpx;
		height: 58rpx;
	}
	.imgadf {
		width: 120rpx;
		height: 120rpx;
		background-color: rgba(255, 255, 255, 0.5);
		margin-left: 20rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		font-size: 20rpx;
		color: #666666;
		flex-direction: column;
	}
	.img_z {
		display: flex;
		flex-wrap: wrap;
		padding-right: 10rpx;
		box-sizing: border-box;
	}
	.image{
		width: 120rpx;
		height: 120rpx;
		margin-left: 20rpx;
		border-radius: 10rpx;
	}
	.shancs {
		width: 35rpx;
		height: 35rpx;
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		background-color: #FFFFFF;
		border-radius: 100%;
	}

	.dianhua_on {
		width: 364rpx;
		height: 74rpx;
		background: linear-gradient(to right, #F55C63, #F78361);
		border-radius: 38rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		margin-top: 130rpx;
		margin-left: 192rpx;
	}

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

<script>
	export default {
		data() {
			return {}
		},
		props: {
			img_list: {
				type: Array,
				default: []
			},
			// 最多上数量 1-9
			count: {
				type: Number,
				default: false
			},
			//图片上传地址
			url: {
				type: String,
				default: ''
			},
			//文件对应的 key 
			name: {
				type: String,
				default: ''
			},
			//请求头
			header: {
				type: Object,
				default: {}
			}
		},
		computed: {
		},
		methods: {
			ongetimg() { 
				if (this.img_list.length >= this.count){
					uni.showToast({
						title: '最多上传' + this.count + '张图片',
						icon: 'none'
					});
					return false
				}
				//选中本地图片
				uni.chooseImage({ 
					count: this.count,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: res => {
						uni.showLoading({ //加载框
							title: '加载中...'
						})
						const tempFilePaths = res.tempFilePaths;
						res.tempFilePaths.forEach((item, index) => { //本地选中的图片组
							uni.uploadFile({ //上传图片
								url: this.url, //上传接口地址
								filePath: item, //一张图
								name: this.name,
								header: this.header,
								success: res => {
									res.data = JSON.parse(res.data)
									this.img_list.push(res.data.data.url)
								}
							});
							uni.hideLoading() //关闭加载框
						});
					}
				});
			},
			//删除
			selec(index) {
				this.img_list.splice(index, 1)
				this.$emit('obtain_img', this.img_list)
			},
			//预览
			preview(index, urls) {
				uni.previewImage({
					urls: urls,
					current: index,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success(data) {
						},
						fail(err) {
						}
					}
				})
			}
		}
	}
</script>
