import request from '@/router/axios'

export function addActivityProduct(id,obj) {
    return request({
        url: '/shop/web/seckillActivity/addSeckillProduct/'+id,
        method: 'post',
        data: obj
    })
}

export function delActivityProduct(id) {
    return request({
        url: '/shop/web/seckillActivity/delSeckillProduct/'+id,
        method: 'delete'
    })
}

export function editorActivityProduct(obj) {
    return request({
        url: '/shop/web/seckillActivity/editSeckillProduct',
        method: 'put',
        data: obj
    })
}

export function getActivityProductById(id, obj) {
    return request({
        url: '/shop/web/seckillActivity/selectSeckillProduct/' + id,
        method: 'get',
        params: obj
    })
}
// 获取秒杀商品
export function getHolidayProduct(id, obj) {
    return request({
        url: '/shop/web/holidaySeckillActivity/selectHolidaySeckillProduct/' + id,
        method: 'get',
        params: obj
    })
}
// 添加秒杀商品
export function addHolidayProduct(id,obj) {
    return request({
        url: '/shop/web/holidaySeckillActivity/addholidaySeckillProduct/'+id,
        method: 'post',
        data: obj
    })
}
// 编辑秒杀商品
export function editorHolidayProduct(obj) {
    return request({
        url: '/shop/web/holidaySeckillActivity/editholidaySeckillProduct',
        method: 'put',
        data: obj
    })
}
// 删除秒杀商品
export function delHolidayProduct(id) {
    return request({
        url: '/shop/web/holidaySeckillActivity/delholidaySeckillProduct/'+id,
        method: 'delete'
    })
}