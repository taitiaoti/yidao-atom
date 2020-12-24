import request from '@/router/axios'
// 支付渠道
export function queryPaymentPage(obj) {
  return request({
    url: '/benefit/web/tPayment/page',
    method: 'get',
    params: obj
  })
}
// 新增渠道
export function addPayChannel(obj) {
  return request({
    url: '/benefit/web/tPayment',
    method: 'post',
    data: obj
  })
}
// 修改渠道
export function putPayChannel(obj) {
  return request({
    url: '/benefit/web/tPayment',
    method: 'put',
    data: obj
  })
}
// 删除渠道
export function deletePayChannel(id) {
  return request({
    url: '/benefit/web/tPayment/' + id,
    method: 'delete'
  })
}
// 所有渠道
export function queryPayChannelList(obj) {
  return request({
    url: '/benefit/web/tPayment/list',
    method: 'get',
    params: obj
  })
}
// 支付配置参数
export function queryPayConstant(obj) {
  return request({
    url: '/benefit/web/tPayConstant/page',
    method: 'get',
    params: obj
  })
}
// 新增支付配置参数
export function addPayConstant(obj) {
  return request({
    url: '/benefit/web/tPayConstant',
    method: 'post',
    data: obj
  })
}
// 编辑支付配置参数
export function putPayConstant(obj) {
  return request({
    url: '/benefit/web/tPayConstant',
    method: 'put',
    data: obj
  })
}
// 删除支付配置参数
export function deletePayConstant(id) {
  return request({
    url: '/benefit/web/tPayConstant/' + id,
    method: 'delete'
  })
}