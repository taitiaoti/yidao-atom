
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/shop/web/product/page',
    method: 'get',
    params: query
  })
}

export function fetchExport(query) {
  return request({
    url: '/shop/web/product/export',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/shop/web/product/',
    method: 'post',
    data: obj
  })
}

export function putOnSale(obj) {
  return request({
    url: '/shop/web/product/updateOnSale',
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/shop/web/product/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/shop/web/product/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/shop/web/product/',
    method: 'put',
    data: obj
  })
}

export function addObjDesc(obj) {
  return request({
    url: '/shop/web/product/desc',
    method: 'post',
    data: obj
  })
}

export function putObjDesc(obj) {
  return request({
    url: '/shop/web/product/desc',
    method: 'put',
    data: obj
  })
}

export function addObjPrama(obj) {
  return request({
    url: '/shop/web/product/spec',
    method: 'post',
    data: obj
  })
}

export function getObjPrama(productNo) {
  return request({
    url: '/shop/web/product/spec/' + productNo,
    method: 'get'
  })
}
export function deleteObjPrama(id) {
  return request({
    url: '/shop/web/product/spec/' + id,
    method: 'delete'
  })
}

export function getpropertyByCategoryId(categoryId, obj) {
  return request({
    url: '/shop/web/product/propertyByCategoryId/' + categoryId,
    method: 'get',
    params: obj
  })
}

export function getGoodsPic(productNo) {
  return request({
    url: '/shop/web/product/image/' + productNo,
    method: 'get'
  })
}

export function delectGoodsPic(id) {
  return request({
    url: '/shop/web/product/image/' + id,
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
    url: '/shop/web/product/inventory',
    method: 'post',
    data: obj
  })
}

export function updateInventory(obj) {
  return request({
    url: '/shop/web/product/inventory',
    method: 'put',
    data: obj
  })
}

export function deleteInventory(id) {
  return request({
    url: '/shop/web/product/inventory/' + id,
    method: 'delete'
  })
}

export function propertyByProductNo(productNo, obj) {
  return request({
    url: '/shop/web/product/propertyByProductNo/' + productNo,
    method: 'get',
    params: obj
  })
}

export function purchaseNote(obj) {
  return request({
    url: '/shop/web/product/note',
    method: 'post',
    data: obj
  })
}

export function upDatePurchaseNote(obj) {
  return request({
    url: '/shop/web/product/note',
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

// 更新京东商品
export function updateJDGoods(obj) {
  return request({
    url: '/shop/web/jdProduct/update',
    method: 'post',
    params: obj
  })
}