import request from '@/router/axios'

// 活动列表
export function activityList(obj) {
  return request({
    url: '/shop/web/goods/pcSelectActivity',
    method: 'get',
    params: obj
  })
}
// 添加活动
export function addActivity(obj) {
    return request({
      url: '/shop/web/goods/addActivity',
      method: 'post',
      data: obj
    })
}
// 编辑
export function updateActivity(obj) {
    return request({
      url: '/shop/web/goods/updateActivity',
      method: 'post',
      data: obj
    })
}
// 查询活动商品
export function activityProductList(obj,id) {
  return request({
    url: '/shop/web/goods/selectGoods/' + id,
    method: 'get',
    params: obj
  })
}
// 添加商品
export function addActivityGoods(obj) {
  return request({
    url: '/shop/web/goods/addActivityGoodsType',
    method: 'post',
    data: obj
  })
}
// 编辑商品
export function updateActivityGoods(obj) {
  return request({
    url: '/shop/web/goods/updateActivityGoodsType',
    method: 'post',
    data: obj
  })
}