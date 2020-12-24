import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/shop/web/discount/page',
    method: 'get',
    params: query,
  })
}

export function updataDiscount(obj) {
  return request({
    url: '/shop/web/discount',
    method: 'put',
    data: obj,
  })
}
