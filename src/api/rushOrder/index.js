import request from '@/router/axios'

export function selectNper(query) {
    return request({
        url: '/shop/web/nper/selectNper',
        method: 'get',
        params: query
    })
}

export function selectUserOrder(query) {
    return request({
        url: '/shop/web/activityOrder/selectUserOrder',
        method: 'get',
        params: query
    })
}

export function selectUserPhone(query) {
    return request({
        url: '/shop/web/nper/selectUserPhone',
        method: 'get',
        params: query
    })
}

export function selectUserDelivery(id) {
    return request({
        url: '/shop/web/activityOrder/selectSendOrder?orderId=' + id,
        method: 'get'
    })
}
// 发货
export function handSendGood(data) {
    return request({
        url: '/shop/web/activityOrder/updateSendOrder',
        method: 'post',
        data: data
    })
}
// 拼单订单详情
export function rushOrderInfo(orderId) {
    return request({
        url: '/shop/web/activityOrder/order?orderId=' + orderId,
        method: 'get'
    })
}
// 订单退货
export function returnGoods(transactionId, money) {
    return request({
        url: '/shop/web/activityOrder/refund?transactionId=' + transactionId + '&money=' + money,
        method: 'get'
    })
}
// 导出
export function fetchOrderExport(query) {
    return request({
        url: '/shop/web/activityOrder/export',
        method: 'get',
        params: query
    })
}
// 取消拼团
export function canelNper(data) {
    return request({
        url: '/shop/web/nper/stopNper',
        method: 'put',
        params: data
    })
}
