import request from '@/router/axios'

export function fetchList(obj) {
  return request({
    url: '/shop/web/jpush/page',
    method: 'get',
    params: obj
  })
}

export function addAuroraPush(obj) {
  return request({
    url: '/shop/web/jpush',
    method: 'post',
    data: obj
  })
}

export function getAuroraInfoById(id) {
  return request({
    url: '/shop/web/jpush/findById/' + id,
    method: 'get'
  })
}

export function editorAurora(obj) {
  return request({
    url: '/shop/web/jpush',
    method: 'put',
    data: obj
  })
}

export function delAurora(id) {
  return request({
    url: '/shop/web/jpush/' + id,
    method: 'delete'
  })
}

export function sendAurora(id) {
  return request({
    url: '/shop/web/jpush/send/' + id,
    method: 'post'
  })
}