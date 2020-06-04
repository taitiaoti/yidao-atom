import request from '@/router/axios'

export function fetchBusinessEnterprise(obj) {
  return request({
    url: '/shop/web/samqiColumn/page',
    method: 'get',
    params: obj
  })
}

export function fetchBusinessEnterpriseById(id) {
    return request({
      url: '/shop/web/samqiColumn/' + id,
      method: 'get'
    })
}

export function addBusinessEnterprise(obj) {
    return request({
      url: '/shop/web/samqiColumn',
      method: 'post',
      data: obj
    })
}

export function editorBusinessEnterprise(obj) {
    return request({
      url: '/shop/web/samqiColumn',
      method: 'put',
      data: obj
    })
}

export function deleteBusinessEnterprise(id) {
    return request({
      url: '/shop/web/samqiColumn/' + id,
      method: 'delete'
    })
}

export function editorSamqiColumnOnshow(obj) {
  return request({
    url: '/shop/web/samqiColumn/updateOnShow',
    method: 'put',
    data: obj
  })
}