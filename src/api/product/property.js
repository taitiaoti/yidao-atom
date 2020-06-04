
import request from '@/router/axios'

export function fetchListProperty(query) {
  return request({
    url: '/shop/web/property/page',
    method: 'get',
    params: query
  })
}

export function addObjProperty(obj) {
  return request({
    url: '/shop/web/property/',
    method: 'post',
    data: obj
  })
}

export function getObjProperty(id) {
  return request({
    url: '/shop/web/property/' + id,
    method: 'get'
  })
}

export function delObjProperty(id) {
  return request({
    url: '/shop/web/property/' + id,
    method: 'delete'
  })
}

export function putObjProperty(obj) {
  return request({
    url: '/shop/web/property/',
    method: 'put',
    data: obj
  })
}

export function getStoreName(params) {
  return request({
    url: '/shop/web/store/findByStoreName',
    method: 'get',
    params: params
  })
}

export function delValProperty(id) {
  return request({
    url: '/shop/web/property/delVal/' + id,
    method: 'delete'
  })
}

