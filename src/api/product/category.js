
import request from '@/router/axios'

export function fetchTree(query) {
  return request({
    url: '/shop/web/category/tree',
    method: 'get',
    params: query
  })
}

export function fetchCas(query) {
  return request({
    url: '/shop/web/category/cas',
    method: 'get',
    params: query
  })
}

export function fetchAgentCas(query) {
  return request({
    url: '/shop/web/category/casForAgent',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/shop/web/category/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/shop/web/category/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/shop/web/category/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/shop/web/category/',
    method: 'put',
    data: obj
  })
}
