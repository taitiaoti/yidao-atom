import request from '@/router/axios'

export function fetchRecharge(obj) {
  return request({
    url: '/benefit/web/consumptionWallet/recharge',
    method: 'post',
    data: obj
  })
}

export function fetchRechargeRechords(obj) {
    return request({
      url: '/benefit/web/consumptionWallet/rechargeRecords',
      method: 'get',
      params: obj
    })
}