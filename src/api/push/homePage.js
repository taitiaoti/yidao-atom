import request from '@/router/axios'

export function fetchList(obj) {
    return request({
        url: '/shop/web/homePagePush/page',
        method: 'get',
        params: obj
    })
}

export function addPush(obj) {
    return request({
        url: '/shop/web/homePagePush',
        method: 'post',
        data: obj
    })
}

export function getPushInfoById(id) {
    return request({
        url: '/shop/web/homePagePush/findById/' + id,
        method: 'get'
    })
}

export function editor(obj) {
    return request({
        url: '/shop/web/homePagePush',
        method: 'put',
        data: obj
    })
}

export function delPush(id) {
    return request({
        url: '/shop/web/homePagePush/' + id,
        method: 'delete'
    })
}

export function onShow(obj) {
    return request({
        url: '/shop/web/homePagePush/updateOnShow',
        method: 'put',
        data: obj
    })
}