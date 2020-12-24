import request from '@/router/axios'

export function fetchList(obj) {
  return request({
    url: '/benefit/web/invitaion/page',
    method: 'get',
    params: obj
  })
}

export function sendToDraw(id) {
    return request({
      url: '/benefit/web/invitaion/send/'+ id,
      method: 'post'
    })
}

export function userInviteRedPackList(obj) {
  return request({
    url: '/benefit/web/invitaion/walletPage',
    method: 'get',
    params: obj
  })
}

export function fetchLogPage(obj) {
  return request({
    url: '/benefit/web/invitaion/logPage',
    method: 'get',
    params: obj
  })
}

export function fetchLogExport(obj) {
  return request({
    url: '/benefit/web/invitaion/logExport',
    method: 'get',
    params: obj
  })
}

export function fetchFrawExport(obj) {
  return request({
    url: '/benefit/web/invitaion/drawExport',
    method: 'get',
    params: obj
  })
}

export function fetchWalletExport(obj) {
  return request({
    url: '/benefit/web/invitaion/walletExport',
    method: 'get',
    params: obj
  })
}