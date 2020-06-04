import request from '@/router/axios'

// export function fetchList(obj) {
//   return request({
//     url: '/jd/web/app/purchaseRecords',
//     method: 'get',
//     params: obj
//   })
// }

export function fetchList(obj) {
  return request({
    url: '/jd/api/jdProduct/queryOrder',
    method: 'post',
    params: obj
  })
}

export function fetchExport(obj) {
  return request({
    url: '/jd/api/jdProduct/export',
    method: 'get',
    params: obj
  })
}