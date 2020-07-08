import request from '@/router/axios'

export function fetchSamqiColumn(obj) {
  return request({
    url: '/shop/web/samqiColumn/list',
    method: 'get',
    params: obj
  })
}

export function searchGoods(obj) {
    return request({
      url: '/shop/web/product/pageForColumn',
      method: 'get',
      params: obj
    })
}

export function fetchSamqiColumnData(id, obj) {
    return request({
      url: '/shop/web/samqiColumn/selectDataByColumn/' + id,
      method: 'get',
      params: obj
    })
}

export function addDataForSamqiColumn(columnId, obj) {
    return request({
      url: '/shop/web/samqiColumn/addDataByColumn/' + columnId,
      method: 'post',
      data: obj
    })
}

export function deleteDataForSamqiColumn(id) {
  return request({
    url: '/shop/web/samqiColumn/delColumnsData/' + id,
    method: 'delete'
  })
}

export function fetchEditorSamqyColumnData(obj) {
  return request({
    url: '/shop/web/samqiColumn/editData',
    method: 'put',
    data: obj
  })
}