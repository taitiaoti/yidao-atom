// 帮购
import request from '@/router/axios'

// 帮购活动列表
export function activityList(obj) {
    return request({
        url: '/shop/tHelpType/selectHelpType',
        method: 'get',
        params: obj
    })
}
// 添加帮购活动
export function addActivity(obj) {
    return request({
        url: '/shop/tHelpType/addHelpType',
        method: 'post',
        data: obj
    })
}
// 修改帮购活动
export function updateActivity(obj) {
    return request({
        url: '/shop/tHelpType/updateHelpType',
        method: 'post',
        data: obj
    })
}
// 查询帮购商品
export function activityProductList(obj) {
    return request({
        url: '/shop/tHelpProduct/selectTHelpProduct',
        method: 'get',
        params: obj
    })
}
// 添加帮购商品
export function addHelpBuyGoods(data) {
    return request({
        url: '/shop/tHelpProduct/addTHelpProduct',
        method: 'post',
        data: data
    })
}
// 编辑帮购商品
export function updateHelpBuyGoods(data) {
    return request({
        url: '/shop/tHelpProduct/updateTHelpProduct',
        method: 'post',
        data: data
    })
}
// 帮购活动记录
export function queryHelpRecord(obj) {
    return request({
        url: '/shop/tHelpRecord/queryHelpRecord',
        method: 'get',
        params: obj
    })
}
// 用户帮购记录
export function shareUserHelpBuy(obj) {
    return request({
        url: '/shop/tHelpShare/selectTHelpShare',
        method: 'get',
        params: obj
    })
}