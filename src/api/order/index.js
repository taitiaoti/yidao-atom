import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/shop/web/order/page',
    method: 'get',
    params: query
  })
}

export function fetchAgentList(query) {
  return request({
    url: '/shop/web/order/agentPage',
    method: 'get',
    params: query
  })
}

export function fetchShipper() {
  return request({
    url: '/shop/web/order/shipper',
    method: 'get'
  })
}

export function fetchExpressInfo(orderNo) {
  return request({
    url: '/shop/web/order/toSend/' + orderNo,
    method: 'get'
  })
}

export function addExpressInfo(obj, orderNo) {
  return request({
    url: '/shop/web/order/send/' + orderNo,
    method: 'put',
    data: obj
  })
}

export function fetchOrderInfoById(id) {
  return request({
    url: '/shop/web/order/' + id,
    method: 'get'
  })
}

export function fetchProductInfo(orderNo) {
  return request({
    url: '/shop/web/order/productInfo/' + orderNo,
    method: 'get'
  })
}

export function fetchPayLog(orderNo) {
  return request({
    url: '/shop/web/order/payLog/' + orderNo,
    method: 'get'
  })
}

export function fetchShipInfo(orderNo) {
  return request({
    url: '/shop/web/order/expressInfo/' + orderNo,
    method: 'get'
  })
}

export function logisticsInfo(expressId) {
  return request({
    url: '/shop/web/express/logistics/' + expressId,
    method: 'get'
  })
}

export function fetchRate(obj) {
  return request({
    url: '/shop/web/rate',
    method: 'get',
    params: obj
  })
}

export function updateRate(obj) {
  return request({
    url: '/shop/web/rate',
    method: 'put',
    data: obj
  })
}

export function fetchOrderExport(query) {
  return request({
    url: '/shop/web/order/export',
    method: 'get',
    params: query
  })
}

export function fetchOrderAgentExport(query) {
  return request({
    url: '/shop/web/order/agentExport',
    method: 'get',
    params: query
  })
}

export function fetchReturnGoods(orderNo) {
  return request({
    url: '/shop/web/order/refund/' + orderNo,
    method: 'post'
  })
}

export function queryOrderInfoLis(query) {
  return request({
    url: '/shop/web/order/queryOrderInfoList',
    method: 'get',
    params: query
  })
}
// 加油订单导出
export function exportOrder(query) {
  return request({
    url: '/benefit/web/CheZhuBangController/export',
    method: 'get',
    params: query
  })
}
// 加油订单退款refundMoney
export function refundGasOrder(orderNo) {
  return request({
    url: '/benefit/web/CheZhuBangController/refund/' + orderNo,
    method: 'post'
  })
}