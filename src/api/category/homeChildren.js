import request from '@/router/axios'

export function fetchList(obj) {
  return request({
    url: '/shop/web/childColumn/listV2',
    method: 'get',
    params: obj
  })
}

export function add(obj) {
    return request({
      url: '/shop/web/childColumn',
      method: 'post',
      data: obj
    })
}

export function fetchItemById(id) {
    return request({
      url: '/shop/web/childColumn/' + id,
      method: 'get'
    })
}

export function editorItem(obj) {
    return request({
      url: '/shop/web/childColumn',
      method: 'put',
      data: obj
    })
}

export function deleteItem(id) {
    return request({
      url: '/shop/web/childColumn/' + id,
      method: 'delete'
    })
}

export function fetchParentList(obj) {
    return request({
      url: '/shop/web/childColumn/parentList',
      method: 'get',
      params: obj
    })
}

export function editorIsShow(obj) {
    return request({
      url: '/shop/web/childColumn/updateOnShow',
      method: 'put',
      data: obj
    })
}

export function getChildrenColumn(obj) {
  return request({
    url: '/shop/web/childColumn/list',
    method: 'get',
    params: obj
  })
}

export function getChildrenColumnData(id, obj) {
  return request({
    url: '/shop/web/childColumn/selectDataByColumn/' + id,
    method: 'get',
    params: obj
  })
}
// 导出接口
export function exportDataBychildColumn(id, obj) {
  return request({
    url: '/shop/web/childColumn/exportDataByColumn/' + id,
    method: 'get',
    params: obj
  })
}
// 删除选中数据接口
export function deleteByChildColumn(id, obj) {
  return request({
    url: '/shop/web/childColumn/deleteByColumn/' + id,
    method: 'post',
    params: obj
  })
}

export function addDataByColumn(columnId, obj) {
  return request({
    url: '/shop/web/childColumn/addDataByColumn/' + columnId,
    method: 'post',
    data: obj
  })
}

export function delColumnsData(id) {
  return request({
    url: '/shop/web/childColumn/delColumnsData/' + id,
    method: 'delete'
  })
}

export function childColumnEditor(obj) {
  return request({
    url: '/shop/web/childColumn/editData',
    method: 'put',
    data: obj
  })
}