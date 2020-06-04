import request from '@/router/axios'
// 基本信息
export function queryUserInfo(obj) {
  return request({
    url: '/benefit/web/gasuserbase/queryUserInfo',
    method: 'post',
    params: obj
  })
}
// 提现申请
export function gasCashwith(obj) {
  return request({
    url: '/benefit/web/gasuserbase/putGasCashwith',
    method: 'put',
    data: obj
  })
}
// 提现记录
export function queryCashwithList(obj) {
  return request({
    url: '/benefit/web/gasuserbase/queryCashwithList',
    method: 'get',
    params: obj
  })
}
// 审核提现
export function updataCashwith(obj) {
  return request({
    url: '/benefit/web/gasuserbase/updateExamineStateToCashwith',
    method: 'put',
    data: obj
  })
}
// 银行卡新增/修改
export function putGasBank(obj) {
  return request({
    url: '/benefit/web/gasuserbase/putGasBank',
    method: 'put',
    data: obj
  })
}
// 银行信息审核
export function queryBankInfoList(obj) {
  return request({
    url: '/benefit/web/gasuserbase/queryBankInfoList',
    method: 'get',
    params: obj
  })
}
// 审核银行操作
export function updataBankStatus(obj) {
  return request({
    url: '/benefit/web/gasuserbase/updateExamineStateToBank',
    method: 'put',
    data: obj
  })
}
// 油站列表
export function queryGasInfoList(obj) {
  return request({
    url: '/benefit/web/gasuserbase/queryGasInfoList',
    method: 'get',
    params: obj
  })
}
// 充值记录
export function queryRechargeList(obj) {
  return request({
    url: '/benefit/web/gasManagement/queryRechargeList',
    method: 'get',
    params: obj
  })
}
// 充值管理
export function queryRechargeManagerList(obj) {
  return request({
    url: '/benefit/web/gasManagement/queryRechargeManagerList',
    method: 'get',
    params: obj
  })
}
// 充值
export function rechargeBy(obj) {
  return request({
    url: '/benefit/web/gasManagement/addRechargeBy',
    method: 'put',
    data: obj
  })
}
// 加油订单
export function queryGasOrder(obj) {
  return request({
    url: '/benefit/web/gasManagement/queryGasOrderByRoleList',
    method: 'get',
    params: obj
  })
}
// 查询智能提现规则
export function queryInterule(obj) {
  return request({
    url: '/benefit/web/gasuserbase/queryInterule',
    method: 'get',
    params: obj
  })
}
// 更新只能提现规则
export function updateInterule(obj) {
  return request({
    url: '/benefit/web/gasuserbase/addAndUpInterule',
    method: 'put',
    data: obj
  })
}

// 油站管理模块
// 新增油站规格
export function addSpecifications(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/addSpecifications',
    method: 'put',
    data: obj
  })
}
// 修改油站规格
export function updateSpecifications(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/updateSpecifications',
    method: 'put',
    data: obj
  })
}
// 删除油站规格
export function delSpecifications(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/delSpecifications',
    method: 'put',
    data: obj
  })
}
//查询油站规格列表
export function querySpecificationsList(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/querySpecificationsList',
    method: 'get',
    params: obj
  })
}
// 新增加油站信息
export function addGasStation(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/addGasStation',
    method: 'put',
    data: obj
  })
}
// 修改加油站信息
export function updateGasStation(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/updateGasStation',
    method: 'put',
    data: obj
  })
}
// 新增加油站详情
export function addGasStationBaseInfo(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/addGasStationBaseInfo',
    method: 'put',
    data: obj
  })
}
// 修改加油站详情
export function updateGasStationBaseInfo(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/updateGasStationBaseInfo',
    method: 'put',
    data: obj
  })
}
// 获取油站列表
export function queryOilStationInfoList(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/queryOilStationInfoList',
    method: 'get',
    params: obj
  })
}
// 获取加盟商--油站列表
export function queryFranchiseeGasList(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/selectGasList',
    method: 'get',
    params: obj
  })
}
// 审核油站列表
export function auditGasList(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/auditList',
    method: 'get',
    params: obj
  })
}
// 删除油站
export function deleteGasStation(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/deleteGasStation',
    method: 'delete',
    data: obj
  })
}
// 获取加油站基本信息
export function queryGasStationInfo(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/queryGasStationInfo',
    method: 'get',
    params: obj
  })
}
// 审核加油站基本信息
export function auditGasInfo(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/queryGasStationAuditInfo',
    method: 'get',
    params: obj
  })
}
// 审核加油站详情信息
export function auditGasDateils(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/queryOilNoBaseInfoAuditList',
    method: 'get',
    params: obj
  })
}
// 获取加油站详情信息
export function queryOilNoBaseInfoList(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/queryOilNoBaseInfoList',
    method: 'get',
    params: obj
  })
}
// 加油站上下架操作
export function framesState(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/updateFramesState',
    method: 'put',
    data: obj
  })
}
// 审核加油站
export function updateAuditStatus(obj) {
  return request({
    url: '/benefit/web/oilStationManagement/updateAuditStatus',
    method: 'put',
    data: obj
  })
}
// 导出加油订单
export function exportGasOrder(obj) {
  return request({
    url: '/benefit/web/gasManagement/export',
    method: 'get',
    params: obj
  })
}


// 我要合作模块Promoters
  // 加油站加盟列表
  export function gasJoining(obj) {
    return request({
      url: '/shop/web/tGasStationCooperation/page',
      method: 'get',
      params: obj
    })
  }
  // 推广人
  export function cityPromoters(obj) {
    return request({
      url: '/shop/web/tCityPromoter/page',
      method: 'get',
      params: obj
    })
  }
  // 导出加油站合作信息
  export function exportGasPromoters(obj) {
    return request({
      url: '/shop/web/tGasStationCooperation/export',
      method: 'get',
      params: obj
    })
  }
  // 导出城市合伙人信息
  export function exportCityPromoters(obj) {
    return request({
      url: '/shop/web/tCityPromoter/export',
      method: 'get',
      params: obj
    })
  }