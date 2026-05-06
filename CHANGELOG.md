# 变更日志

格式依据 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循语义化版本。

## [Unreleased]

### 新增

- 管理端订单详情抽屉：小票预览区与「打印小票」（浏览器 `window.print`，打印时仅输出小票块）。
- 管理端 WebSocket 新订单/支付提醒：尝试播放 `public/order-notify.mp3`（可选放置）；失败时用 Web Audio 短蜂鸣。
- 小程序点餐：`CHANGELOG.md` 与本约定，便于每次合并 GitHub 时写明改动。

### 修复

- 小程序订单详情页「确认收到」误调未定义的 `getOrders`，改为重新拉取详情；订单列表/详情增加 `onShow` 刷新。
- 小程序订单列表 Tab「进行中」：后端 `orderList(type=1)` 包含库表 `status` 为制作中(0)与已出单/配送(1)。
- 订单行项目：`saveCartInfo` 改为同步落库；SKU 未匹配时使用商品原价并记日志，避免异步 NPE 导致明细为空。
- 管理端订单明细表格增加「规格」列。

### 变更约定（GitHub）

1. 确认代码无误后：`git add -A`，使用清晰前缀提交，例如：`fix(mp): 订单 onShow 刷新`、`feat(admin): 订单小票打印`。
2. 每次发布前在本文件 `[Unreleased]` 下补充条目，发布时再打上版本标题与日期。
3. 推送在个人环境执行：`git push origin main`（勿将 token 写入仓库）。

可选：将短音频命名为 `order-notify.mp3` 放到 `yshop-drink-vue3/public/` 以替换默认蜂鸣。
