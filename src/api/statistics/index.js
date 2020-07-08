import request from '@/router/axios'

export function getGoodsStatistics(obj) {
    return request({
        url: '/shop/web/statistic/productSaleByPage',
        method: 'get',
        params: obj
    })
}

export function getDayReport(obj) {
    return request({
        url: '/charge/web/call/dayReport',
        method: 'get',
        params: obj
    })
}

export function getMonthReport(obj) {
    return request({
        url: '/charge/web/call/monthReport',
        method: 'get',
        params: obj
    })
}