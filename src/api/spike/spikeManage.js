import request from '@/router/axios'

export function fetchList(obj) {
    return request({
        url: '/shop/web/seckillActivity/page',
        method: 'get',
        params: obj
    })
}

export function add(obj) {
    return request({
        url: '/shop/web/seckillActivity',
        method: 'post',
        data: obj
    })
}

export function getDataById(id) {
    return request({
        url: '/shop/web/seckillActivity/' + id,
        method: 'get'
    })
}

export function editor(obj) {
    return request({
        url: '/shop/web/seckillActivity',
        method: 'put',
        data: obj
    })
}

export function delActivity(id) {
    return request({
        url: '/shop/web/seckillActivity/'+id,
        method: 'delete'
    })
}
// 分页查询秒杀活动
export function getHolidaySeckillActivity(obj) {
    return request({
        url: '/shop/web/holidaySeckillActivity/page',
        method: 'get',
        params: obj
    })
}
// 根据id获取活动信息
export function getHolidayInfo(id) {
    return request({
        url: '/shop/web/holidaySeckillActivity/' + id,
        method: 'get'
    })
}
// 添加秒杀活动
export function addHolidaySeckillActivity(obj) {
    return request({
        url: '/shop/web/holidaySeckillActivity',
        method: 'post',
        data: obj
    })
}
// 修改秒杀活动
export function editorHolidaySeckillActivity(obj) {
    return request({
        url: '/shop/web/holidaySeckillActivity',
        method: 'put',
        data: obj
    })
}
// 删除秒杀活动
export function delHolidaySeckillActivity(id) {
    return request({
        url: '/shop/web/holidaySeckillActivity/'+id,
        method: 'delete'
    })
}