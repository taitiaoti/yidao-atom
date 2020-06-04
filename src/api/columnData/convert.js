import request from '@/router/axios'

export function fetchConvert(obj) {
  return request({
    url: '/shop/web/couponColumn/list',
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

export function fetchConvertData(id, obj) {
    return request({
      url: '/shop/web/couponColumn/selectDataByColumn/' + id,
      method: 'get',
      params: obj
    })
}

export function addDataForConvert(columnId, obj) {
    return request({
      url: '/shop/web/couponColumn/addDataByColumn/' + columnId,
      method: 'post',
      data: obj
    })
}

export function deleteDataForConvert(id) {
    return request({
      url: '/shop/web/couponColumn/delColumnsData/' + id,
      method: 'delete'
    })
}

export function fetchEditorConvert(obj) {
    return request({
      url: '/shop/web/couponColumn/editData',
      method: 'put',
      data: obj
    })
}