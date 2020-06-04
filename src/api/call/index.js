import request from '@/router/axios'

export function fetchList(obj) {
    return request({
      url: '/charge/web/app/page',
      method: 'get',
      params: obj
    })
}

export function fetchAppById(id) {
    return request({
      url: '/charge/web/app/' + id,
      method: 'get',
    })
}

export function fetchUpdate(obj) {
    return request({
      url: '/charge/web/app',
      method: 'put',
      data: obj
    })
}

export function fetchAdd(obj) {
    return request({
      url: '/charge/web/app',
      method: 'post',
      data: obj
    })
}

export function fetchAppDelete(id) {
    return request({
      url: '/charge/web/app/' + id,
      method: 'delete',
    })
}

export function fetchCallList(obj) {
    return request({
      url: '/charge/web/call/page',
      method: 'get',
      params: obj
    })
}

export function fetchRechargeList(obj) {
  return request({
    url: '/charge/web/recharge/page',
    method: 'get',
    params: obj
  })
}

export function fetchBalanceList(obj) {
  return request({
    url: '/charge/web/balance/page',
    method: 'get',
    params: obj
  })
}

export function fetchBalanceById(id) {
  return request({
    url: '/charge/web/balance/' + id,
    method: 'get'
  })
}

export function fetchRechargeMoney(obj) {
  return request({
    url: '/charge/web/balance/recharge',
    method: 'put',
    data: obj
  })
}