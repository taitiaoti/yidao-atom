import request from '@/router/axios'

export function fetchColumn(obj) {
  return request({
    url: '/shop/web/column/page',
    method: 'get',
    params: obj
  })
}

export function addColumn(obj) {
  return request({
    url: '/shop/web/column',
    method: 'post',
    data: obj
  })
}

export function getColumnById(id) {
  return request({
    url: '/shop/web/column/' + id,
    method: 'get'
  })
}

export function delColumnIcon(id) {
  return request({
    url: '/shop/web/column/image/' + id,
    method: 'delete'
  })
}

export function editorColumn(obj) {
  return request({
    url: '/shop/web/column',
    method: 'put',
    data: obj
  })
}

export function delColumn(id) {
  return request({
    url: '/shop/web/column/' + id,
    method: 'delete'
  })
}

export function editorColumnOnshow(obj) {
  return request({
    url: '/shop/web/column/updateOnShow',
    method: 'put',
    data: obj
  })
}