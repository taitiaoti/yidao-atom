import request from '@/router/axios'

export function fecthCouponWallet(obj) {
  return request({
    url: '/benefit/web/couponWallet/page',
    method: 'get',
    params: obj
  })
}

export function fecthRecharge(obj) {
  return request({
    url: '/benefit/web/couponWallet/recharge',
    method: 'post',
    data: obj
  })
}

export function fecthRechargeRecords(obj) {
  return request({
    url: '/benefit/web/couponWallet/rechargeRecords',
    method: 'get',
    params: obj
  })
}