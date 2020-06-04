import request from '@/router/axios'

export function fetchStoreColumnList(obj) {
  return request({
    url: '/shop/web/storeColumn/list',
    method: 'get',
    params: obj
  })
}

export function searchStore(obj) {
    return request({
      url: '/shop/web/store/page',
      method: 'get',
      params: obj
    })
}

export function fetchStoreColumnData(id, obj) {
    return request({
      url: '/shop/web/storeColumn/selectDataByColumn/' + id,
      method: 'get',
      params: obj
    })
}

export function addDataForStoreColumn(columnId, obj) {
    return request({
      url: '/shop/web/storeColumn/addDataByColumn/' + columnId,
      method: 'post',
      data: obj
    })
}

export function deleteDataForStoreColumn(id) {
  return request({
    url: '/shop/web/storeColumn/delColumnsData/' + id,
    method: 'delete'
  })
}

export function fetchEditorStoreColumnData(obj) {
  return request({
    url: '/shop/web/storeColumn/editData',
    method: 'put',
    data: obj
  })
}