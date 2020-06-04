import request from '@/router/axios'

export function fetchStoreColumn(obj) {
  return request({
    url: '/shop/web/storeColumn/page',
    method: 'get',
    params: obj
  })
}

export function fetchStoreColumnById(id) {
    return request({
      url: '/shop/web/storeColumn/' + id,
      method: 'get'
    })
}

export function addStoreColumn(obj) {
    return request({
      url: '/shop/web/storeColumn',
      method: 'post',
      data: obj
    })
}

export function editorStoreColumn(obj) {
    return request({
      url: '/shop/web/storeColumn',
      method: 'put',
      data: obj
    })
}

export function deleteStoreColumn(id) {
    return request({
      url: '/shop/web/storeColumn/' + id,
      method: 'delete'
    })
}

export function editorStoreColumnOnshow(obj) {
  return request({
    url: '/shop/web/storeColumn/updateOnShow',
    method: 'put',
    data: obj
  })
}