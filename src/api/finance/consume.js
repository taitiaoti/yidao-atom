import request from '@/router/axios'

export function fetchList(obj) {
  return request({
    url: '/shop/web/app/purchaseRecords',
    method: 'get',
    params: obj
  })
}