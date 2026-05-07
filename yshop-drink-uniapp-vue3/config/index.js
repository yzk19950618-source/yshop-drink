/**
 * 微信小程序内 localhost 指向手机/模拟器自身，无法访问开发机后端。
 * 请把 MP_LAN_HOST 改成与你电脑 ipconfig 中 IPv4 一致（须与微信开发者工具里 ws 尝试连接的网段一致）。
 */
const MP_LAN_HOST = 'http://10.141.242.50:48081'

function resolveApiHost() {
  try {
    if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
      const { uniPlatform } = uni.getSystemInfoSync()
      if (uniPlatform === 'mp-weixin') {
        return MP_LAN_HOST
      }
    }
  } catch (_) {
    /* non-uni context */
  }
  return 'http://localhost:48081'
}

const API_HOST = resolveApiHost()

export const VUE_APP_API_URL = API_HOST + '/app-api'
// export const VUE_APP_API_URL = 'https://apidc.yixiang.co/app-api'
export const VUE_APP_RESOURCES_URL = 'https://h5.yixiang.co/static'
export const VUE_APP_UPLOAD_URL = VUE_APP_API_URL + '/infra/file/upload'
export const APP_ID = 'wxdbdbc123c8c30b45'

const orderListStatus = {}

// -1:申请退款
// -2:退货成功
// 0:待发货；
// 1:待收货；
// 2:已收货；
// 3:待评价；
// -1:已退款

export const orderStatus = {
  0: '未支付',
  1: '待发货',
  2: '待收货',
  3: '待评价',
  4: '已完成',
  5: '退款中',
  6: '已退款',
  7: '退款',
}

export const orderReStatus = {
  0: '等待买家付款',
  // 1: '等待卖家发货',
  1: '卖家已发货',
  2: '等待买家待评价',
  3: '订单已完成',
  4: '订单退款中',
  5: '订单已退款',
  6: '退款已完成',
}

// export const orderReStatus = {
//   0: '等待买家付款',
//   1: '等待卖家发货',
//   2: '卖家已发货',
//   3: '等待买家待评价',
//   4: '订单已完成',
//   5: '订单退款中',
//   6: '订单已退款',
//   7: '退款已完成',
// }
