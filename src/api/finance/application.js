import request from '@/router/axios'

export function fetchList(obj) {
  return request({
    url: '/shop/web/app/page',
    method: 'post',
    data: obj
  })
}

export function add(obj) {
  return request({
    url: '/shop/web/app',
    method: 'post',
    data: obj
  })
}

export function fetchDetailById(id) {
  return request({
    url: '/shop/web/app/' + id,
    method: 'get'
  })
}

export function editor(obj) {
  return request({
    url: '/shop/web/app',
    method: 'put',
    data: obj
  })
}

export function deleteItem(id) {
  return request({
    url: '/shop/web/app/' + id,
    method: 'delete'
  })
}

export function recharge(id, obj) {
  return request({
    url: '/shop/web/app/recharge/' + id,
    method: 'put',
    params: obj
  })
}

export function updateActive(obj) {
  return request({
    url: '/shop/web/app/updateActive',
    method: 'put',
    data: obj
  })
}