import request from '@/router/axios'

export function fetchList(obj) {
  return request({
    url: '/jd/web/rechargeRecord/page',
    method: 'get',
    params: obj
  })
}