/**
 * 与后端 `yshop.pay.weixin-mock-enabled` 保持一致：
 * - 本地 / 联调：两端可同时开 mock，调用 paytype `weixin_mock`
 * - 上线真实微信支付：此处设为 false，并在服务端关闭 mock、配置商户号等
 */
export const USE_WEIXIN_MOCK = true
