
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/shop/web/banner/page',
    method: 'get',
    params: query
  })
}
// 获取栏目banner
export function getColumnBanner(id) {
  return request({
    url: '/shop/web/column/pages/' + id,
    method: 'get'
  })
}
export function fetchFile(query) {
  return request({
    url: '/shop/web/banner/upload',
    method: 'post',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/shop/web/banner/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/shop/web/banner/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/shop/web/banner/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/shop/web/banner/',
    method: 'put',
    data: obj
  })
}
