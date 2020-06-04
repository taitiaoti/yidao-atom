import request from '@/router/axios'

export function fetchSubsidy(obj) {
  return request({
    url: '/benefit/web/subsidy/page',
    method: 'get',
    params: obj
  })
}

export function sendSubsidy(obj) {
  return request({
    url: '/benefit/web/subsidy/sendSubsidy',
    method: 'post',
    data: obj
  })
}

export function fetchUidByPhone(obj) {
  return request({
    url: '/benefit/web/userInfo/findUidByPhone',
    method: 'get',
    params: obj
  })
}

export function batchSendSubsidy(obj) {
  return request({
    url: '/benefit/web/subsidy/batchSendSubsidy',
    method: 'post',
    data: obj
  })
}

export function fetchCountByPosition(obj) {
  return request({
    url: '/benefit/web/subsidy/findCountByPosition',
    method: 'get',
    params: obj
  })
}