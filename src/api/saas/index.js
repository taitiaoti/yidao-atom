import request from '@/router/axios'

export function userBenefit(obj) { //个人分润查询
  return request({
    url: '/benefit/web/saas/agentSplitListV2',
    method: 'get',
    params: obj
  })
}

export function agentUserInfo(obj) { //代理商用户查询
    return request({
      url: '/benefit/web/saas/childAgentUserListV2',
      method: 'get',
      params: obj
    })
}

export function agentInfo(obj) { //代理商基本信息查询
    return request({
      url: '/benefit/web/saas/findAgentUserV2',
      method: 'get',
      params: obj
    })
}

export function addAgent(obj) { //二级代理商新增
  return request({
    url: '/benefit/web/saas/saveAgentUserV2',
    method: 'get',
    params: obj
  })
}

export function agentIdValid(obj) { //验证账户是否已被使用
  return request({
    url: '/benefit/web/saas/agentIdValid',
    method: 'get',
    params: obj
  })
}

export function againSubmit(obj) { //重新提交审核
  return request({
    url: '/benefit/web/agentUser/againSubmit',
    method: 'put',
    data: obj
  })
}

export function userCartRecharge(obj) { //用户充值卡查询
    return request({
      url: '/benefit/web/saas/userCardListV2',
      method: 'get',
      params: obj
    })
}

export function agentCartBatch(obj) { //充值卡分配管理
    return request({
      url: '/benefit/web/saas/cardAgentBatchListV2',
      method: 'get',
      params: obj
    })
}

export function cartBatch(obj) { //充值卡分配
    return request({
      url: '/benefit/web/saas/batchAssignAgentV2',
      method: 'get',
      params: obj
    })
}

export function findAgentUserByProAgent(obj) { //根据省代表获取代理商列表
  return request({
    url: '/benefit/web/saas/findAgentUserByProAgent',
    method: 'get',
    data: obj
  })
}

export function checkAgentList(obj) { //审核代理商列表
  return request({
    url: '/benefit/web/agentUser/examinePage',
    method: 'get',
    params: obj
  })
}

export function findAgentById(id) { //根据ID查找代理商
  return request({
    url: '/benefit/web/agentUser/findById/' + id,
    method: 'get'
  })
}

export function agentPass(id) { //通过审核
  return request({
    url: '/benefit/web/agentUser/pass/' + id,
    method: 'put'
  })
}

export function agentRefuse(id, obj) { //拒绝通过审核
  return request({
    url: '/benefit/web/agentUser/refuse/' + id,
    method: 'put',
    params: obj
  })
}

