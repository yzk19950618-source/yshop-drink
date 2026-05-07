// 开发服务监听 0.0.0.0，便于本机局域网 IP 访问（含 uni 开发态 WebSocket 回连）。
// H5 跨域可在 devServer 中增加 proxy，例如将 /app-api 转发到后端。
module.exports = {
  devServer: {
    host: '0.0.0.0',
  },
}
