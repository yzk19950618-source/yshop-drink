import { payUnify } from '@/api/order'
import { USE_WEIXIN_MOCK } from '@/config/pay'
import { isWeixin } from '@/utils/util'

export function getPayFrom() {
  let from = 'routine'
  // #ifdef H5
  from = 'h5'
  if (isWeixin()) {
    from = 'wechat'
  }
  // #endif
  return from
}

/**
 * 用户选择的支付方式（weixin/yue/alipay）→ 调用 `/order/pay` 的 paytype
 */
export function resolveApiPayType(userPayType) {
  if (userPayType === 'weixin' && USE_WEIXIN_MOCK) {
    return 'weixin_mock'
  }
  return userPayType
}

/**
 * 执行订单支付；成功返回 true（调用方负责跳转、刷新用户信息）
 */
export async function executeOrderPay(orderId, userPayType) {
  const from = getPayFrom()
  const paytype = resolveApiPayType(userPayType)

  uni.showLoading({ title: '支付处理中' })
  try {
    const data = await payUnify({
      uni: orderId,
      from,
      paytype,
    })

    if (!data) {
      return false
    }

    if (paytype === 'yue') {
      return data.status === 'ok'
    }

    if (paytype === 'weixin_mock') {
      if (data.trade_type === 'MOCK_JSAPI' || data.status === 'ok') {
        return true
      }
      return false
    }

    if (paytype === 'weixin') {
      if (data.trade_type === 'MWEB') {
        // #ifdef H5
        if (data.data) {
          location.href = data.data
          return true
        }
        // #endif
        return false
      }
      if (data.trade_type === 'JSAPI' && data.data) {
        // #ifdef MP-WEIXIN
        await new Promise((resolve, reject) => {
          uni.requestPayment({
            provider: 'wxpay',
            timeStamp: data.data.timeStamp,
            nonceStr: data.data.nonceStr,
            package: data.data.package,
            signType: data.data.signType || 'MD5',
            paySign: data.data.paySign,
            success: () => resolve(),
            fail: (err) => reject(err),
          })
        })
        return true
        // #endif
        // #ifndef MP-WEIXIN
        uni.showToast({ title: '请在微信小程序内完成支付', icon: 'none' })
        return false
        // #endif
      }
    }

    if (paytype === 'alipay' && data.data) {
      // #ifdef H5
      const div = document.createElement('div')
      div.innerHTML = data.data
      document.body.appendChild(div)
      document.forms[0].submit()
      return true
      // #endif
    }

    return false
  } catch (e) {
    return false
  } finally {
    uni.hideLoading()
  }
}

export function goOrderListTab() {
  uni.switchTab({
    url: '/pages/order/order',
    fail() {
      uni.navigateTo({ url: '/pages/order/order' })
    },
  })
}
