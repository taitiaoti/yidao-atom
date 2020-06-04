
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/shop/web/agentProduct/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/shop/web/agentProduct/',
    method: 'post',
    data: obj
  })
}

export function putOnSale(obj) {
  return request({
    url: '/shop/web/agentProduct/updateOnSale',
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/shop/web/agentProduct/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/shop/web/agentProduct/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/shop/web/agentProduct/',
    method: 'put',
    data: obj
  })
}

export function addObjDesc(obj) {
  return request({
    url: '/shop/web/agentProduct/desc',
    method: 'post',
    data: obj
  })
}

export function putObjDesc(obj) {
  return request({
    url: '/shop/web/agentProduct/desc',
    method: 'put',
    data: obj
  })
}

export function addObjPrama(obj) {
  return request({
    url: '/shop/web/agentProduct/spec',
    method: 'post',
    data: obj
  })
}

export function getObjPrama(productNo) {
  return request({
    url: '/shop/web/agentProduct/spec/' + productNo,
    method: 'get'
  })
}
export function deleteObjPrama(id) {
  return request({
    url: '/shop/web/agentProduct/spec/' + id,
    method: 'delete'
  })
}

export function getpropertyByCategoryId(categoryId, obj) {
  return request({
    url: '/shop/web/agentProduct/propertyByCategoryId/' + categoryId,
    method: 'get',
    params: obj
  })
}

export function getGoodsPic(productNo) {
  return request({
    url: '/shop/web/agentProduct/image/' + productNo,
    method: 'get'
  })
}

export function delectGoodsPic(id) {
  return request({
    url: '/shop/web/agentProduct/image/' + id,
    method: 'delete'
  })
}

export function uploadGoodsDetailPic(obj) {
  return request({
    url: '/shop/web/handy/upload',
    method: 'post',
    data: obj
  })
}

export function addInventory(obj) {
  return request({
    url: '/shop/web/agentProduct/inventory',
    method: 'post',
    data: obj
  })
}

export function updateInventory(obj) {
  return request({
    url: '/shop/web/agentProduct/inventory',
    method: 'put',
    data: obj
  })
}

export function deleteInventory(id) {
  return request({
    url: '/shop/web/agentProduct/inventory/' + id,
    method: 'delete'
  })
}

export function propertyByProductNo(productNo, obj) {
  return request({
    url: '/shop/web/agentProduct/propertyByProductNo/' + productNo,
    method: 'get',
    params: obj
  })
}

export function purchaseNote(obj) {
  return request({
    url: '/shop/web/agentProduct/note',
    method: 'post',
    data: obj
  })
}

export function upDatePurchaseNote(obj) {
  return request({
    url: '/shop/web/agentProduct/note',
    method: 'put',
    data: obj
  })
}

export function fetchFreightList() {
    return request({
      url: '/shop/web/freight/list',
      method: 'get'
    })
}

export function fetchCkeckList(obj) {
  return request({
    url: '/shop/web/agentProduct/examinePage',
    method: 'get',
    params: obj
  })
}

export function agentProductPass(id) {
  return request({
    url: '/shop/web/agentProduct/pass/' + id,
    method: 'put'
  })
}

export function agentProductRefuse(id, obj) {
  return request({
    url: '/shop/web/agentProduct/refuse/' + id,
    method: 'put',
    params: obj
  })
}

export function agentGetColumns() {
  return request({
    url: '/shop/web/agentProduct/findColumns',
    method: 'get'
  })
}