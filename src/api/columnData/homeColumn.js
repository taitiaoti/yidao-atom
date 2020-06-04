import request from '@/router/axios'

export function fetchColumnList(obj) {
  return request({
    url: '/shop/web/column/list',
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

export function fetchColumnData(id, obj) {
    return request({
      url: '/shop/web/column/selectDataByColumn/' + id,
      method: 'get',
      params: obj
    })
}

export function  exportDataByColumn(id, obj) {
  return request({
    url: '/shop/web/column/exportDataByColumn/' + id,
    method: 'get',
    params: obj
  })
}

export function addDataForColumn(columnId, obj) {
    return request({
      url: '/shop/web/column/addDataByColumn/' + columnId,
      method: 'post',
      data: obj
    })
}

export function deleteDataForColumn(id) {
  return request({
    url: '/shop/web/column/delColumnsData/' + id,
    method: 'delete'
  })
}

export function fetchEditorColumnData(obj) {
  return request({
    url: '/shop/web/column/editData',
    method: 'put',
    data: obj
  })
}

export function auotSort(id, obj) {
  return request({
    url: '/shop/web/column/autoSort/' + id,
    method: 'get',
    params: obj
  })
}

export function toReorder(id, obj) {
  return request({
    url: '/shop/web/column/autoSortOnStaggeredRepeat/' + id,
    method: 'get',
    params: obj
  })
}

export function auotSortStagger(id, obj) {
  return request({
    url: '/shop/web/column/autoSortOnStaggeredRepeat/' + id,
    method: 'get',
    params: obj
  })
}

// 删除选中数据
export function deleteByColumn(id, obj) {
  return request({
    url: '/shop/web/column/deleteByColumn/' + id,
    method: 'post',
    params: obj
  })
}