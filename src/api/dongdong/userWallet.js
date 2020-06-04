import request from '@/router/axios'

export function fetchUserWallet(obj) {
  return request({
    url: '/benefit/web/userWallet/page',
    method: 'get',
    params: obj
  })
}

export function updateUserWallet(obj) {
    return request({
      url: '/benefit/web/userWallet/change',
      method: 'post',
      data: obj
    })
}
  
export function fetchUserWalletRecords(obj) {
    return request({
        url: '/benefit/web/userWallet/walletRecords',
        method: 'get',
        params: obj
    })
}

export function fetchUserLog(obj) {
  return request({
      url: '/benefit/web/userLog/page',
      method: 'get',
      params: obj
  })
}
// 用户红包明细
export function fetchUserRecords(obj) {
  return request({
      url: '/benefit/web/userWallet/insertUserLog',
      method: 'get',
      params: obj
  })
}

export function fetchLogExport(obj) {
  return request({
      url: '/benefit/web/userLog/logExport',
      method: 'get',
      params: obj
  })
}