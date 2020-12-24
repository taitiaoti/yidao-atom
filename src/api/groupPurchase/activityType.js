import request from '@/router/axios'

// 活动类型列表
export function activityTypeList(obj) {
  return request({
    url: '/shop/web/goods/selectActivityType',
    method: 'get',
    params: obj
  })
}
// 添加活动类型
export function addActivityType(obj) {
    return request({
      url: '/shop/web/goods/addActivityType',
      method: 'post',
      data: obj
    })
}
// 编辑活动类型
export function editorActivityType(obj) {
    return request({
      url: '/shop/web/goods/updateActivityType',
      method: 'post',
      data: obj
    })
}
