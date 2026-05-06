<template>
	<layout>
		<uv-navbar
		  :fixed="false"
		  :title="title"
		  left-arrow
		  @leftClick="$onClickLeft"
		/>
		<view class="container">
			<view style="padding: 0 30rpx;">
				<!-- user box begin -->
				<view class="d-flex flex-column bg-white user-box">

					<view class="d-flex align-items-center">
						<view class="avatar rounded-circle">
							<image :src="isLogin ? member.avatar ? member.avatar : '/static/images/mine/default.png' : '/static/images/mine/default.png'"></image>
						</view>
						<view class="d-flex flex-column flex-fill overflow-hidden" style="margin-top: 20rpx;">
							<view v-if="isLogin"
								class="font-size-lg font-weight-bold d-flex justify-content-start align-items-center"
								@tap="serv({type:'pages',pages:'/pages/components/pages/mine/userinfo'})">
								<view class="text-truncate">{{ member.nickname }}</view>
								<view class="iconfont iconarrow-right line-height-100"></view>
							</view>
							<view v-else class="font-size-lg font-weight-bold" @tap="login">游客</view>
						</view>
					</view>
					<!-- user grid begin -->
					<view class="w-100 d-flex align-items-center just-content-center">
						<view class="user-grid" @tap="serv({type:'pages',pages:'/pages/components/pages/coupons/coupons'})">
							<view class="value font-size-extra-lg font-weight-bold text-color-base">
								{{ isLogin ? member.couponCount : 0}}
							</view>
							<view class="font-size-sm text-color-assist">优惠券</view>
						</view>
						<view class="user-grid" @tap="serv({type:'pages', pages: '/pages/components/pages/balance/bill?cate=1'})">
							<view class="value font-size-extra-lg font-weight-bold text-color-base">
								{{ isLogin ? member.nowMoney : 0 }}
							</view>
							<view class="font-size-sm text-color-assist">余额</view>
						</view>
						<view class="user-grid" @tap="serv({type:'pages', pages: '/pages/components/pages/balance/bill?cate=0'})">
							<view class="value font-size-extra-lg font-weight-bold text-color-base">
								{{ isLogin ? member.sumMoney : 0 }}
							</view>
							<view class="font-size-sm text-color-assist">历史消费</view>
						</view>
					</view>
					<!-- user grid end -->
				</view>
				<!-- user box end -->

			</view>
			<!-- service box begin -->
			<view class="service-box">
				<view class="font-size-lg text-color-base font-weight-bold" style="margin-bottom: 20rpx;">我的服务</view>
				<view class="u-m-t-20">
					<uv-cell-group>
						<block v-for="(item, index) in services" :key='index'>
							<uv-cell :title="serviceTitle(item)" v-if="item.type == 'contact'" :isLink="true">
								<template #icon>
									<image :src="serviceIconSrc(item)" style="width: 40rpx;height: 40rpx;" class="mr-1" mode="aspectFit" @error="onServiceIconError"></image>
								</template>
							</uv-cell>
							<uv-cell :isLink="true" :title="serviceTitle(item)" v-else-if="item.type == 'call'" v-on:click="makePhoneCall(servicePhone(item))">
								<template #icon>
									<image :src="serviceIconSrc(item)" style="width: 40rpx;height: 40rpx;" class="mr-1" mode="aspectFit" @error="onServiceIconError"></image>
								</template>
							</uv-cell>
							<uv-cell :isLink="true" :title="serviceTitle(item)" v-else @tap="serv(item)">
								<template #icon>
									<image :src="serviceIconSrc(item)" style="width: 40rpx;height: 40rpx;" class="mr-1" mode="aspectFit" @error="onServiceIconError"></image>
								</template>
							</uv-cell>
						</block>
					</uv-cell-group>
				</view>
			</view>
		</view>
	</layout>
</template>

<script setup>
import {
  ref,
  computed
} from 'vue'
import { useMainStore } from '@/store/store'
import { storeToRefs } from 'pinia'
import { onLoad,onShow} from '@dcloudio/uni-app'
import { formatDateTime,kmUnit } from '@/utils/util'
import {
  userGetUserInfo,
  mineService
} from '@/api/user'
const main = useMainStore()
const { member,isLogin } = storeToRefs(main)

const title = ref('个人中心')
const services = ref([])

const growthValue = computed(() => { 
	if (!isLogin.value) return 0
	const {
		currentValue,
		needValue
	} = member.value
	return currentValue / (currentValue + needValue) * 100
})

onLoad(() => {
	getServices();
})	
onShow(() => {
	getUserInfo();
})


const getUserInfo = async() => {
	if (isLogin.value) {
		let data = await userGetUserInfo();
		if (data) {
			main.SET_MEMBER(data);
		}
	}
}
const getServices = async() => {
	let data = await mineService();
	if (data) {
		services.value = data;
	}
}
const SERVICE_ICON_FALLBACK = '/static/images/mine/default.png'

/** 库表 name 乱码或 JDBC 编码错误时常见：全问号、替换符等 */
const isGarbledServiceName = (name) => {
	const s = name == null ? '' : String(name).trim()
	if (!s) return true
	if (/^[\s?\uFFFD]+$/.test(s)) return true
	return false
}

/** 与工程 sql/yixiang-drink-open.sql 中 yshop_service 种子 id / pages 对齐 */
const SERVICE_TITLE_BY_ID = {
	20: '积分签到',
	21: '我的订单',
	22: '积分商城',
	23: '兑换订单',
	24: '联系客服',
	25: '我的地址',
	26: '帮助中心',
	27: '关于我们',
	28: '退出登录',
	29: '用户协议',
	30: '隐私政策',
	31: '积分订单'
}
const SERVICE_TITLE_BY_PAGE = {
	'/pages/components/pages/integrals/integrals': '积分签到',
	'/pages/components/pages/orders/orders': '我的订单',
	'/pages/components/pages/scoreproduct/list': '积分商城',
	'/pages/components/pages/scoreproduct/order': '兑换订单',
	'/pages/components/pages/address/address': '我的地址',
	'/pages/components/pages/login/logout': '退出登录'
}

const serviceTitleFallback = (item) => {
	if (!item) return ''
	const id = item.id
	if (id != null && SERVICE_TITLE_BY_ID[id] != null) {
		return SERVICE_TITLE_BY_ID[id]
	}
	const rawPath = item.pages != null ? String(item.pages) : ''
	const path = rawPath.split('?')[0].trim()
	if (path && SERVICE_TITLE_BY_PAGE[path]) {
		return SERVICE_TITLE_BY_PAGE[path]
	}
	if (item.type === 'call' || item.type === 'contact') {
		return '联系客服'
	}
	if (item.type === 'content') {
		if (id === 26) return '帮助中心'
		if (id === 27) return '关于我们'
	}
	return ''
}

const serviceTitle = (item) => {
	const raw = item && (item.name || item.title)
	const n = raw != null ? String(raw).trim() : ''
	if (n && !isGarbledServiceName(n)) {
		return n
	}
	const fb = serviceTitleFallback(item)
	return fb || '服务'
}
const serviceIconSrc = (item) => {
	const u = item && item.image
	return (u && String(u).trim()) || SERVICE_ICON_FALLBACK
}
const onServiceIconError = (e) => {
	if (e && e.detail && e.target) {
		e.target.src = SERVICE_ICON_FALLBACK
	}
}
const servicePhone = (item) => {
	return (item && (item.phone || item.mobile)) || ''
}
const makePhoneCall = (phoneNumber) => {
	uni.makePhoneCall({
		phoneNumber: phoneNumber,
	})
}
const login = () => {
	uni.navigateTo({
		url: '/pages/components/pages/login/login'
	})
}
const packages = () => {
	if (!isLogin.value) {
		login()
		return
	}
	uni.navigateTo({
		url: '/pages/components/pages/packages/index'
	})
}
const serv = (item) => {
	switch (item.type) {
		case 'pages':
			if (!isLogin.value) {
				login()
				return
			}
			uni.navigateTo({
				url: item.pages || ''
			})
			break;
		case 'miniprogram':
			{
				const appId = item.appId || item.app_id
				if (!appId) {
					uni.showToast({ title: '未配置跳转小程序', icon: 'none' })
					return
				}
				const path = item.pages || item.path
				const mpOpts = { appId }
				if (path) {
					mpOpts.path = path
				}
				uni.navigateToMiniProgram(mpOpts)
			}
			break;
		case 'menu':
			uni.navigateTo({
				url: '/pages/components/pages/mine/service?id=' + item.id + '&name=' + encodeURIComponent(serviceTitle(item))
			})
			break;
		case 'content':
			uni.navigateTo({
				url: '/pages/components/pages/mine/content?id=' + item.id + '&name=' + encodeURIComponent(serviceTitle(item))
			})
			break;
	}
}



</script>

<style lang="scss" scoped>
	page {
		height: auto;
		min-height: 100%;
	}


	.user-box {
		position: relative;
		border-radius: 8rpx;
		margin-bottom: 30rpx;
		margin-top: 70rpx;
		box-shadow: $box-shadow;
	}

	.avatar {
		position: relative;
		margin-top: -35rpx;
		margin-left: 35rpx;
		margin-right: 35rpx;
		width: 160rpx;
		height: 160rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
		box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.2);

		image {
			width: 140rpx;
			height: 140rpx;
			border-radius: 100%;
		}

		.badge {
			position: absolute;
			right: -10rpx;
			bottom: -10rpx;
			background-color: #FFFFFF;
			border-radius: 50rem;
			display: flex;
			align-items: center;
			justify-content: center;
			color: $color-warning;
			font-size: 24rpx;
			padding: 8rpx 16rpx;
			box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.2);

			image {
				width: 30rpx;
				height: 30rpx;
			}
		}
	}


	.user-grid {
		width: 33.33%;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.value {
			margin-bottom: 20rpx;
		}
	}

	

	.service-box {
		width: 100%;
		background-color: #FFFFFF;
		padding: 32rpx 30rpx 10rpx;
		box-shadow: $box-shadow;

		.row {
			display: flex;
			flex-wrap: wrap;
			color: $text-color-assist;
			font-size: $font-size-sm;
			padding-bottom: -40rpx;

			.grid {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 40rpx;
				width: 25%;
				position: relative;

				image {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 20rpx;
				}
			}

			.opacity-0 {
				position: absolute;
				width: 100%;
				height: 100%;
				opacity: 0;
				z-index: 10;
			}

		}
	}
</style>
