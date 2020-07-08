import request from '@/router/axios'

export function getproducts(obj) {
  return request({
    url: '/shop/web/purchase/queryProductByPage',
    method: 'get',
    params: obj
  })
}

export function getProperty(productNo) {
  return request({
    url: '/shop/web/purchase/property/' + productNo,
    method: 'get'
  })
}

export function getGoodDetail(productNo) {
  return request({
    url: '/shop/web/purchase/detail/' + productNo,
    method: 'get'
  })
}

export function dealCartPrice(obj) {
  return request({
    url: '/shop/web/purchase/dealCartPrice',
    method: 'post',
    data: obj
  })
}

export function getRedPackBalance() {
  return request({
    url: '/shop/web/purchase/queryBalance',
    method: 'get'
  })
}

export function carBuy(obj) {
  return request({
    url: '/shop/web/purchase/cartBuy',
    method: 'post',
    data: obj
  })
}

export function fetchPayStatus(orderNo) {
  return request({
    url: '/shop/web/purchase/payStatus/' + orderNo,
    method: 'get'
  })
}

export function fetchOrderList(obj) {
  return request({
    url: '/shop/web/purchase/orderPage',
    method: 'get',
    params: obj
  })
}

export function continuePay(orderNo, obj) {
  return request({
    url: '/shop/web/purchase/continue/' + orderNo, 
    method: 'post',
    params: obj
  })
}