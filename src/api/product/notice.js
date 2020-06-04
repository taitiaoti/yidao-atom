import request from '@/router/axios'

export function fetchNoticeList(query) {
  return request({
    url: '/shop/web/notice/page',
    method: 'get',
    params: query
  })
}

export function editorNotice(id) {
    return request({
      url: '/shop/web/notice/' + id,
      method: 'put'
    })
}

export function deleteNotice(id) {
    return request({
      url: '/shop/web/notice/' + id,
      method: 'delete'
    })
}