import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/shop/web/indexColumn/list',
    method: 'get',
    params: query
  })
}

export function fetchSelectListByColumnId(id, obj) {
    return request({
      url: '/shop/web/indexColumn/selectDataByColumn/' + id,
      method: 'get',
      params: obj
    })
}

export function fetchAdd(columnId, obj) {
    return request({
      url: '/shop/web/indexColumn/addDataByColumn/' + columnId,
      method: 'post',
      data: obj
    })
}

export function fetchEditor(query) {
    return request({
      url: '/shop/web/indexColumn/editData',
      method: 'put',
      data: query
    })
}

export function fetchDelete(id) {
    return request({
      url: '/shop/web/indexColumn/delColumnsData/' + id,
      method: 'delete'
    })
}

export function searchGoods(obj) {
    return request({
      url: '/shop/web/product/pageForColumn',
      method: 'get',
      params: obj
    })
}
