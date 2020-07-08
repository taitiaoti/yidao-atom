import request from '@/router/axios'

export function fetchExpress(query) {
  return request({
    url: '/shop/web/express/page',
    method: 'get',
    params: query
  })
}

export function updateLogistics(obj) {
  return request({
    url: '/shop/web/express',
    method: 'put',
    data: obj
  })
}

export function fetchDeleteLogistics(id) {
  return request({
    url: '/shop/web/express/' + id,
    method: 'delete'
  })
}

export function fetchExpressInfoById(id) {
    return request({
        url: '/shop/web/express/' + id,
        method: 'get'
    })
}
