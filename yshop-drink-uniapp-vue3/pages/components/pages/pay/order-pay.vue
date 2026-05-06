<template>
	<uv-navbar
	  :fixed="false"
	  :title="title"
	  left-arrow
	  @leftClick="$onClickLeft"
	/>
	<view class="container">
		<view class="section bg-white rounded mb-30">
			<list-cell :hover="false">
				<view class="w-100 d-flex flex-column">
					<view class="font-size-sm text-color-assist mb-10">门店</view>
					<view class="font-size-lg text-color-base text-truncate">{{ shopName }}</view>
				</view>
			</list-cell>
			<list-cell :hover="false" last>
				<view class="w-100 d-flex justify-content-between align-items-center">
					<view class="text-color-base">应付金额</view>
					<view class="font-size-extra-lg font-weight-bold text-color-primary">￥{{ displayAmount }}</view>
				</view>
			</list-cell>
		</view>

		<view class="section bg-white rounded mb-30">
			<list-cell :hover="false" last>
				<view class="w-100 d-flex justify-content-between align-items-center">
					<view class="text-color-base">支付方式</view>
					<view class="font-weight-bold">{{ payTypeLabel }}</view>
				</view>
			</list-cell>
		</view>

		<view class="font-size-sm text-color-assist px-20 mb-20">订单号 {{ orderId }}</view>

		<view class="fixed-bottom-pay bg-white">
			<view class="d-flex align-items-center justify-content-between px-30 py-20">
				<view>
					<text class="font-size-sm text-color-assist">合计 </text>
					<text class="font-size-lg font-weight-bold">￥{{ displayAmount }}</text>
				</view>
				<view
					class="bg-primary text-color-white font-size-base px-60 py-24 rounded"
					@tap="debounce(confirmPay, 400)"
				>
					确认支付
				</view>
			</view>
		</view>
		<uv-toast ref="uToast" />
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { orderDetail } from '@/api/order'
import { userGetUserInfo } from '@/api/user'
import { useMainStore } from '@/store/store'
import { executeOrderPay, goOrderListTab } from '@/utils/orderPay'
import debounce from '@/uni_modules/uv-ui-tools/libs/function/debounce'
import { USE_WEIXIN_MOCK } from '@/config/pay'

const title = ref('收银台')
const uToast = ref()
const main = useMainStore()

const orderId = ref('')
const userPayType = ref('weixin')
const previewAmount = ref('')
const order = ref({
	shop: { name: '' },
	paid: 0,
	payPrice: 0,
})

const shopName = computed(() => {
	const s = order.value.shop
	if (s && s.name) {
		return s.name
	}
	return '—'
})

const displayAmount = computed(() => {
	const p = order.value.payPrice
	if (p !== undefined && p !== null && p !== '') {
		return Number(p).toFixed ? Number(p).toFixed(2) : p
	}
	return previewAmount.value || '0.00'
})

const payTypeLabel = computed(() => {
	const t = userPayType.value
	if (t === 'yue') return '余额支付'
	if (t === 'alipay') return '支付宝'
	if (t === 'weixin' && USE_WEIXIN_MOCK) return '微信支付（模拟）'
	if (t === 'weixin') return '微信支付'
	return '微信支付'
})

const loadDetail = async () => {
	if (!orderId.value) return
	const data = await orderDetail(orderId.value)
	if (data) {
		order.value = data
		if (data.paid > 0) {
			uToast.value?.show({ message: '订单已支付', type: 'warning' })
			setTimeout(() => goOrderListTab(), 1500)
		}
	}
}

onLoad((options) => {
	orderId.value = options.orderId || options.id || ''
	userPayType.value = options.payType || 'weixin'
	previewAmount.value = options.amount || ''
	if (orderId.value) {
		loadDetail()
	} else {
		uToast.value?.show({ message: '缺少订单信息', type: 'error' })
	}
})

const refreshMember = async () => {
	try {
		const data = await userGetUserInfo()
		if (data) {
			main.SET_MEMBER(data)
		}
	} catch (e) {
		/* ignore */
	}
}

const confirmPay = async () => {
	if (!orderId.value) return
	if (order.value.paid > 0) {
		goOrderListTab()
		return
	}
	const ok = await executeOrderPay(orderId.value, userPayType.value)
	if (ok) {
		await refreshMember()
		uToast.value?.show({ message: '支付成功', type: 'success' })
		setTimeout(() => {
			goOrderListTab()
		}, 600)
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 30rpx;
	padding-bottom: 180rpx;
}
.section {
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
}
.rounded {
	border-radius: 12rpx;
}
.mb-30 {
	margin-bottom: 30rpx;
}
.fixed-bottom-pay {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
	padding-bottom: env(safe-area-inset-bottom);
}
.py-24 {
	padding-top: 24rpx;
	padding-bottom: 24rpx;
}
.py-20 {
	padding-top: 20rpx;
	padding-bottom: 20rpx;
}
.px-60 {
	padding-left: 60rpx;
	padding-right: 60rpx;
}
.rounded {
	border-radius: 999rpx;
}
</style>
