import request from '@/router/axios'

export function getAllProvince() {
  return request({
    url: '/shop/web/delivery/getAllProvinces',
    method: 'get'
  })
}

export function getCityByProvinceId(query) {
    return request({
      url: '/shop/web/delivery/getCitysByProvinceId',
      method: 'get',
      params: query
    })
}

export function getAreaByCityId(query) {
    return request({
      url: '/shop/web/delivery/getCountysByCityId',
      method: 'get',
      params: query
    })
}

export function getTownByAreaId(query) {
  return request({
    url: '/shop/web/delivery/getTownByCountyId',
    method: 'get',
    params: query
  })
}

export function getSaleProduct(query) {
  return request({
    url: '/shop/web/jdProduct/queryOnSaleProduct',
    method: 'get',
    params: query
  })
}

export function getAddressList() {
  return request({
    url: '/shop/web/delivery/list',
    method: 'get'
  })
}

export function fetchDefaultAddress(obj) {
  return request({
    url: '/shop/web/delivery/getDefault',
    method: 'get',
    data: obj
  })
}

export function addAddress(obj) {
  return request({
    url: '/shop/web/delivery/add',
    method: 'post',
    params: obj
  })
}

export function update(obj) {
  return request({
    url: '/shop/web/delivery/edit',
    method: 'post',
    params: obj
  })
}

export function delAddress(id) {
  return request({
    url: '/shop/web/delivery/delete/' + id,
    method: 'post'
  })
}

export function setDefaultAddress(id) {
  return request({
    url: '/shop/web/delivery/default/' + id,
    method: 'post'
  })
}

export function getBalance() {
  return request({
    url: '/shop/web/pay/queryBalance',
    method: 'get'
  })
}

export function getJdFreight(obj) {
  return request({
    url: '/shop/web/pay/dealOrderFreight',
    method: 'post',
    data: obj
  })
}

export function buyProduct(obj) {
  return request({
    url: '/shop/web/pay/buy',
    method: 'post',
    data: obj
  })
}