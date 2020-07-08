import request from '@/router/axios'

export function getInitPageList(query) {
  return request({
    url: '/shop/web/initPage/page',
    method: 'get',
    params: query
  })
}

export function addInitPage(obj) {
  return request({
    url: '/shop/web/initPage',
    method: 'post',
    data: obj
  })
}

export function putInitPage(obj) {
  return request({
    url: '/shop/web/initPage',
    method: 'put',
    data: obj
  })
}

export function deleteInitPage(id) {
  return request({
    url: '/shop/web/initPage/' + id,
    method: 'delete'
  })
}
