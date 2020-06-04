import request from '@/router/axios'
// 骑手审核列表
export function fetchList(obj) {
  return request({
    url: '/benefit/web/tRiderUser/page',
    method: 'get',
    params: obj
  })
}
// 骑手审核
export function updateRiderStatus(obj) {
  return request({
    url: '/benefit/web/tRiderUser',
    method: 'put',
    data: obj
  })
}
// 获取所有城市列表
export function getCityList() {
  return request({
    url: '/shop/web/tCitiesRider/get',
    method: 'get'
  })
}
// 添加城市
export function addCitys(obj) {
  return request({
    url: '/shop/web/tCitiesRider',
    method: 'post',
    data: obj
  })
}
// 查询骑手账户
export function getRiderAcount(obj) {
  return request({
    url: '/benefit/web/TRiderIncomeWebController/page',
    method: 'get',
    params: obj
  })
}
// 查询骑手收入金额
export function getRiderIncome(obj) {
  return request({
    url: '/benefit/web/TRiderIncomeDetailsWebController/page',
    method: 'get',
    params: obj
  })
}
// 骑手收入导出
export function riderExport(obj) {
  return request({
    url: '/benefit/web/TRiderIncomeDetailsWebController/export',
    method: 'get',
    params: obj
  })
}
// 查询骑手提现
export function getRiderWithdrawal(obj) {
  return request({
    url: '/benefit/web/TRiderIncomeWithdrawalWebController/page',
    method: 'get',
    params: obj
  })
}
// 骑手手动提现
export function riderCash(obj) {
  return request({
    url: '/benefit/web/TRiderIncomeWithdrawalWebController',
    method: 'post',
    data: obj
  })
}
// 查询商家账户
export function getMerchatsAcount(obj) {
  return request({
    url: '/benefit/web/TMerchantsIncomeWebController/page',
    method: 'get',
    params: obj
  })
}
// 查询商家收入记录
export function incomeDetails(obj) {
  return request({
    url: '/benefit/web/TMerchantsIncomeDetailsWebController/page',
    method: 'get',
    params: obj
  })
}
// 导出商家收入明细
export function exportDetails(obj) {
  return request({
    url: '/benefit/web/TMerchantsIncomeDetailsWebController/export',
    method: 'get',
    params: obj
  })
}
// 查询商家提现明细
export function cashDetails(obj) {
  return request({
    url: '/benefit/web/TMerchantsIncomeWithdrawalWebController/page',
    method: 'get',
    params: obj
  })
}
// 商家手动提现
export function merchantCashPost(obj) {
  return request({
    url: '/benefit/web/TMerchantsIncomeWithdrawalWebController',
    method: 'post',
    data: obj
  })
}
// 骑手位置
export function riderAddress(id) {
  return request({
    url: '/benefit/web/tRiderAddress/' + id,
    method: 'get'
  })
}