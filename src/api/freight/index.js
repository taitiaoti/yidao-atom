import request from '@/router/axios'

export function addFreightTemplate(obj) {
  return request({
    url: '/shop/web/freight',
    method: 'post',
    data: obj
  })
}

export function getTemplateList(query) {
  return request({
    url: '/shop/web/freight/page',
    method: 'get',
    params: query
  })
}

export function fetchTempalteInfoById(id) {
  return request({
    url: '/shop/web/freight/' + id,
    method: 'get'
  })
}

export function delFreight(id) {
  return request({
    url: '/shop/web/freight/delFreight/' + id,
    method: 'delete'
  })
}

export function delCondition(id) {
  return request({
    url: '/shop/web/freight/delCondition/' + id,
    method: 'delete'
  })
}

export function delSpecify(id) {
  return request({
    url: '/shop/web/freight/delSpecify/' + id,
    method: 'delete'
  })
}

export function seachTemplateList(query) {
  return request({
    url: '/shop/web/freight/page/search',
    method: 'get',
    params: query
  })
}