import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/shop/web/jdProduct/page',
    method: 'get',
    params: query
  })
}

export function addWarehouse(id) {
  return request({
    url: '/shop/web/jdProduct/addToStorage/' + id,
    method: 'post'
  })
}
// 批量入库
export function addWarehouses(query) {
  return request({
    url: '/shop/web/jdProduct/addMultipleToStorage' ,
    method: 'post',
    params:{ids:query}
    
  })
}
export function getJdList(query) {
  return request({
    url: '/shop/web/jdProduct/queryAlreadyAddStorage',
    method: 'get',
    params: query
  })
}

export function exportList(obj) {
  return request({
    url: '/shop/web/jdProduct/export',
    method: 'get',
    params: obj
  })
}
// 更新京东商品
export function updateJDGoods(obj) {
  return request({
    url: '/jd/api/jdProduct/queryUpdateJdProductBySku',
    method: 'get',
    params: obj
  })
}