import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/shop/web/indexColumn/page',
    method: 'get',
    params: query
  })
}

export function fetchSingleListById(id) {
    return request({
      url: '/shop/web/indexColumn/' + id,
      method: 'get'
    })
}

export function fetchUpdateList(obj) {
    return request({
      url: '/shop/web/indexColumn',
      method: 'put',
      data: obj
    })
}

export function fetchAdd(obj) {
    return request({
      url: '/shop/web/indexColumn',
      method: 'post',
      data: obj
    })
}

export function fetchDel(id) {
    return request({
      url: '/shop/web/indexColumn/' + id,
      method: 'delete'
    })
}

export function fetchShow(obj) {
    return request({
      url: '/shop/web/indexColumn/updateOnShow',
      method: 'put',
      data: obj
    })
}
