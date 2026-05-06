<template>
	<uv-navbar
	  :fixed="false"
	  :title="title"
	  left-arrow
	  @leftClick="$onClickLeft"
	/>
	<view class="container" style="padding:20rpx;">
		<view style="padding-bottom: 100rpx;">
			<view class="bg-white">
				<view class="section">
					<!-- store info begin -->
					<list-cell :hover="false">
						<view class="w-100 d-flex align-items-center">
							<view class="d-flex flex-column w-60">
								<view class="w-100 font-size-lg text-color-base text-truncate">{{ order.shop.name }}</view>
							</view>
							<view class="d-flex justify-content-end align-items-center w-40">
								<view class="iconfont-yshop icon-mobile"  @click="makePhoneCall(order.shop)" style="font-size: 45rpx;margin-right: 40rpx;"></view>
								<view class="iconfont-yshop icon-location"  @click="openLocation(order.shop)" style="font-size: 45rpx;"></view>
							</view>
						</view>
					</list-cell>
					<!-- store info end -->
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column">
							<view class="d-flex align-items-center just-content-center">
								<view class="sort-num">{{ order.numberId }}</view>
							</view>
							<!-- steps begin -->
							<view class="d-flex just-content-center">
								<view class="steps d-flex flex-column w-80">
									<view class="steps__img-column">
										<view class="steps__img-column-item">
											<view class="iconfont-yshop icon-lamp" :class="{ unactive: orderTimelineStep < 0 }"></view>
										</view>
										<view class="steps__img-column-item">
											<view class="iconfont-yshop icon-daojishi" :class="{ unactive: orderTimelineStep < 1 }"></view>
										</view>
										<view class="steps__img-column-item" v-if="order.orderType == 'takeout'">
											<view class="iconfont-yshop icon-takeout" :class="{ unactive: orderTimelineStep < 2 }"></view>
										</view>
										<view class="steps__img-column-item">
											<view
												class="iconfont-yshop icon-doorbell"
												:class="{ unactive: orderTimelineStep < (order.orderType == 'takeout' ? 3 : 2) }"
											></view>
										</view>
									</view>
									<view class="steps__text-column">
										<view class="steps__text-column-item" :class="{ active: orderTimelineStep === 0 }">
											<view class="steps__column-item-line bg-transparent"></view>
											<view class="steps__text-column-item-text">已下单</view>
											<view class="steps__column-item-line"></view>
										</view>
										<view class="steps__text-column-item" :class="{ active: orderTimelineStep === 1 }">
											<view class="steps__column-item-line"></view>
											<view class="steps__text-column-item-text">制作中</view>
											<view class="steps__column-item-line"></view>
										</view>
										<view
											class="steps__text-column-item"
											:class="{ active: orderTimelineStep === 2 }"
											v-if="order.orderType == 'takeout'"
										>
											<view class="steps__column-item-line"></view>
											<view class="steps__text-column-item-text">配送中</view>
											<view class="steps__column-item-line bg-transparent"></view>
										</view>
										<view
											class="steps__text-column-item"
											:class="{ active: orderTimelineStep === (order.orderType == 'takeout' ? 3 : 2) }"
										>
											<view class="steps__column-item-line"></view>
											<view class="steps__text-column-item-text">
												{{ order.orderType == 'takeout' ? '已送达' : '请取餐' }}
											</view>
											<view class="steps__column-item-line bg-transparent"></view>
										</view>
									</view>
								</view>
							</view>
							<!-- steps end -->
							<view v-if="order.status==0 && order.paid > 0" class="d-flex just-content-center align-items-center font-size-base text-color-assist mb-40">
								您前面还有 <text class="text-color-primary mr-10 ml-10">{{order.preNum}}</text> 单待制作
							</view>
							<!-- goods：仅当接口返回 products 时展示（与 cartInfo 二选一避免重复/空白） -->
							<view v-if="order.products && order.products.length" class="w-100 d-flex flex-column position-relative mt-30" style="margin-bottom: -40rpx;">
								<view class="w-100 d-flex align-items-center mb-40" v-for="(good, index) in order.products" :key="index">
									<view class="d-flex flex-column w-60 overflow-hidden">
										<view class="font-size-lg text-color-base mb-10 text-truncate">{{ good.title }}</view>
										<view class="font-size-sm text-color-assist text-truncate">{{ formatProductSpecDisplay(good.spec) }}</view>
									</view>
									<view class="d-flex w-40 align-items-center justify-content-between pl-30">
										<view class="font-size-base text-color-base">x{{ good.number }}</view>
										<view class="font-size-base text-color-base font-weight-bold">￥{{ good.price }}</view>
									</view>
								</view>
							</view>
						</view>
					</list-cell>
				</view>
				<view class="section">
					<!-- goods begin -->
					<list-cell :hover="false" padding="30rpx 30rpx">
						<view class="w-100 d-flex flex-column position-relative">
							<view class="w-100 d-flex align-items-center mb-40" v-for="(good, index) in order.cartInfo" :key="index">
								<image :src="good.image" mode="aspectFill" class="image"></image>
								<view class="d-flex flex-column w-60 overflow-hidden">
									<view class="font-size-lg text-color-base mb-10 text-truncate">{{ good.title }}</view>
									<view class="font-size-sm text-color-assist text-truncate">{{ formatProductSpecDisplay(good.spec) }}</view>
								</view>
								<view class="d-flex w-40 align-items-center justify-content-between pl-30">
									<view class="font-size-base text-color-base">x{{ good.number }}</view>
									<view class="font-size-base text-color-base font-weight-bold">￥{{ good.price }}</view>
								</view>
							</view>
						</view>
					</list-cell>
					<!-- goods end -->
					<!-- payment and amount begin -->
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column">
							<view class="pay-cell">
								<view>支付方式</view>
								<view class="font-weight-bold">{{ order.statusDto.payType }}</view>
							</view>
							<view class="pay-cell">
								<view>订单金额</view>
								<view class="font-weight-bold">￥{{ order.totalPrice }}</view>
							</view>
							<view class="pay-cell" v-if="order.orderType == 'takeout'">
								<view>配送费</view>
								<view class="font-weight-bold">￥{{ order.payPostage }}</view>
							</view>
							<view class="pay-cell">
								<view>优惠金额</view>
								<view class="font-weight-bold">￥{{ order.couponPrice }}</view>
							</view>
							<view class="pay-cell">
								<view>实付金额</view>
								<view class="font-weight-bold">￥{{ order.payPrice }}</view>
							</view>
						</view>
					</list-cell>
					<!-- payment and amount end -->
				</view>
				<view class="section">
					<!-- order info begin -->
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column">
							<view class="pay-cell">
								<view>下单时间</view>
								<view class="font-weight-bold">{{ formatDateTime(order.createTime )}}</view>
							</view>
							<view class="pay-cell">
								<view>下单门店</view>
								<view class="font-weight-bold">{{ order.shop.name }}</view>
							</view>
							<view class="pay-cell">
								<view>订单号</view>
								<view class="font-weight-bold">{{ order.id }}</view>
							</view>
						</view>
					</list-cell>
					<!-- order info end --> 
				</view>
				<!-- order other info begin -->
				<list-cell :hover="false" padding="50rpx 30rpx 20rpx" last>
					<view class="w-100 d-flex flex-column">
						<view class="pay-cell">
							<view>享用方式</view>
							<view class="font-weight-bold">{{order.orderType == 'takein' ? '自取' : '外卖'}}</view>
						</view>
						<view class="pay-cell">
							<view>取餐时间</view>
							<view class="font-weight-bold">{{order.getTime ? formatDateTime(order.getTime) : '立即取餐'}}</view>
						</view>
						<view class="pay-cell">
							<view>制作完成时间</view>
							<view class="font-weight-bold">{{ order.deliveryTime ? formatDateTime(order.deliveryTime) : '无' }}</view>
						</view>
						<view class="pay-cell">
							<view>备注</view>
							<view class="font-weight-bold">{{ order.remark ? order.remark : '无' }}</view>
						</view>
					</view>
				</list-cell>
				<!-- order other info end -->
			</view>
			<view class="fixed-bottom flex justify-end bg-white p-2" v-if="order.paid > 0 && order.refundStatus == 0">
				<view class="mr-1"><uv-button type="success" v-if="order.status < 2" :plain="true" size="small" text="确认收到餐" @click="receive(order)"></uv-button></view>
				<view><uv-button type="warning" :plain="true" size="small" text="申请退款" @click="refund(order)"></uv-button></view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { formatDateTime, formatProductSpecDisplay } from '@/utils/util'
import {
  orderDetail,
  orderReceive,
} from '@/api/order'
const title = ref('订单详情')
const order = ref({
	shop:{name:''},
	statusDto:{payType:''}
})
const numForMading = ref(5)
const orderKey = ref('')

/**
 * 与后端 order.status 一致：0待发货 1待收货 2已收货 3已完成；结合 paid、orderType 驱动时间轴高亮。
 * 外卖：0已下单 1制作中 2配送中 3已送达；自取/堂食：0已下单 1制作中 2请取餐。
 */
const orderTimelineStep = computed(() => {
	const o = order.value
	if (!o) return 0
	const paid = Number(o.paid) || 0
	const st = Number(o.status)
	const takeout = o.orderType === 'takeout'
	if (paid <= 0) return 0
	if (Number.isNaN(st) || st < 0) return 0
	if (st === 0) return 1
	if (st === 1) return 2
	return takeout ? 3 : 2
})

onLoad((option) => {
	orderKey.value = option.id || ''
})

onShow(() => {
	if (orderKey.value) {
		detail(orderKey.value)
	}
})

const detail = async (id) => {
	if (!id) return
	const data = await orderDetail(id)
	if (data) {
		order.value = data
	}
}
const openLocation = () => {
	let shop = order.value.shop;
	uni.openLocation({
		address: shop.addressMap + shop.address + " " + shop.name,
		latitude: parseFloat(shop.lat),
		longitude: parseFloat(shop.lng),
		fail(res) {
			console.log(res);
		}
	});
}
const makePhoneCall = () =>{
	let shop = order.value.shop;
	uni.makePhoneCall({
		phoneNumber: shop.mobile,
		fail(res) {
			console.log(res)
		}
	})
}

// 确认收到货
const receive = async (row) => {
	const uniId = row.orderId || orderKey.value
	const data = await orderReceive({ uni: uniId })
	if (data) {
		uni.showToast({ title: '已确认收到', icon: 'success' })
		await detail(orderKey.value)
	}
}
//提交退款
const refund = (order) => {
	uni.navigateTo({
		url: '/pages/components/pages/orders/refund?orderId=' + order.orderId + '&payPrice=' + order.payPrice + '&totalPrice=' + order.totalPrice
	})
}

</script>

<style lang="scss" scoped>
	.image {
		width: 120rpx;
		height: 120rpx;
		margin-right: 30rpx;
		border-radius: 8rpx;
	}


.pay-cell {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: $font-size-base;
	color: $text-color-base;
	margin-bottom: 40rpx;

	&:nth-last-child(1) {
		margin-bottom: 0;
	}
}



/* #ifdef H5 */
	page {
		min-height: 100%;
		background-color: $bg-color;
	}
	/* #endif */
	.order-box {
		padding: 20rpx;
		/* #ifdef H5 */
		margin-bottom: 100rpx;
		/* #endif */
	}
	
	.drinks-img {
		width: 260rpx;
		height: 260rpx;
	}
	
	.tips {
		margin: 60rpx 0 80rpx;
		line-height: 48rpx;
	}

	
	@mixin arch {
		content: "";
		position: absolute;
		background-color: $bg-color;
		width: 30rpx;
		height: 30rpx;
		bottom: -15rpx;
		z-index: 10;
		border-radius: 100%;
	}
	
	.section {
		position: relative;
		
		&::before {
			@include arch;
			left: -15rpx;
		}
		
		&::after {
			@include arch;
			right: -15rpx;
		}
	}
	
	.pay-cell {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: $font-size-base;
		color: $text-color-base;
		margin-bottom: 40rpx;

		&:nth-last-child(1) {
			margin-bottom: 0;
		}
	}
	
	.sort-num {
		font-size: 64rpx;
		font-weight: bold;
		color: $text-color-base;
		line-height: 2;
	}
	
	.steps__img-column {
		display: flex;
		margin: 30rpx 0;
		
		.steps__img-column-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			
			image {
				width: 80rpx;
				height: 80rpx;
			}
			.unactive {
				color: #919293;
			}
		}
	}
	
	.steps__text-column {
		display: flex;
		margin-bottom: 40rpx;
		
		.steps__text-column-item {
			flex: 1;
			display: inline-flex;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: $font-size-base;
			color: $text-color-assist;
			
			&.active {
				color: $text-color-base;
				font-weight: bold;
				
				.steps__column-item-line {
					background-color: $text-color-base;
				}
			}
			
			.steps__column-item-line{
				flex: 1;
				height: 2rpx;
				background-color: #919293;
				transform: scaleY(0.5);
			}
			
			.steps__text-column-item-text {
				margin: 0 8px;
			}
		}
	}
	.icon-lamp, .icon-daojishi, .icon-takeout, .icon-doorbell{
		font-size: 60rpx;
	}
	.iconfont-yshop {
		color: #09b4f1;
	}
</style>
