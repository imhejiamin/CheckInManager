// TODO 发送网页
export function sendPage(ctx, status = 200, data) {
  sendData(ctx, status, data)
}
// TODO 仅发送数据
export function sendData(ctx, status = 200, data, type = 'application/json') {
  ctx.response.status = status;
  ctx.response.body = data;
  ctx.response.type = type;
  console.log(ctx.response.status);
  
}