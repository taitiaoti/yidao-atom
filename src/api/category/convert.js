import request from '@/router/axios'

export function fetchConvert(obj) {
  return request({
    url: '/shop/web/couponColumn/page',
    method: 'get',
    params: obj
  })
}

export function fetchConvertById(id) {
    return request({
      url: '/shop/web/couponColumn/' + id,
      method: 'get'
    })
}

export function addConvert(obj) {
    return request({
      url: '/shop/web/couponColumn',
      method: 'post',
      data: obj
    })
}

export function editorConvert(obj) {
    return request({
      url: '/shop/web/couponColumn',
      method: 'put',
      data: obj
    })
}

export function deleteConvert(id) {
    return request({
      url: '/shop/web/couponColumn/' + id,
      method: 'delete'
    })
}

export function editorConvertOnshow(obj) {
    return request({
      url: '/shop/web/couponColumn/updateOnShow',
      method: 'put',
      data: obj
    })
}