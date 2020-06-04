import request from '@/router/axios'

export function fetchStore(obj) {
  return request({
    url: '/shop/web/store/page',
    method: 'get',
    params: obj
  })
}

export function fetchStoreInfoById(id) {
  return request({
    url: '/shop/web/store/' + id,
    method: 'get'
  })
}

// 修改店铺信息
export function editorStoreInfo(obj) {
  return request({
    url: '/shop/web/store',
    method: 'put',
    data: obj
  })
}

export function fetchCity() {
  return request({
    url: '/shop/web/region/get',
    method: 'get'
  })
}

export function editorStoreDesc(obj) {
  return request({
    url: '/shop/web/store/desc',
    method: 'put',
    data: obj
  })
}

export function addStore(obj) {
  return request({
    url: '/shop/web/store',
    method: 'post',
    data: obj
  })
}

export function deleteStore(id) {
  return request({
    url: '/shop/web/store/' + id,
    method: 'delete'
  })
}

// 店铺所属用户
export function findUserLikeUsername(params) {
  return request({
    url: '/admin/user/findUserLikeUsername',
    method: 'get',
    params: params
  })
}

// 导入店铺
export function autoUpdate(params) {
  return request({
    url: '/shop/web/store/autoUpdate',
    method: 'get',
    params: params
  })
}