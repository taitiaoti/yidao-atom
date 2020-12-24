import request from '@/router/axios'
// 所有员工
export function queryAllUser(obj) {
  return request({
    url: '/benefit/web/tEmployees/employess',
    method: 'get',
    params: obj
  })
}
// 员工管理
export function addStaff(obj) {
    return request({
        url: '/benefit/web/tEmployees',
        method: 'post',
        data: obj
    })
}
// 删除员工
export function deleteStaff(id) {
    return request({
        url: '/benefit/web/tEmployees/' + id,
        method: 'delete'
    })
}
// 当前上班的员工和时间
export function queryNowStaff(name) {
  return request({
    url: '/benefit/web/tSuccessionOrder/oneDutyName?gasUserName=' + name,
    method: 'get'
  })
}
// 开始上班接口
export function startWork(obj) {
  return request({
      url: '/benefit/web/tSuccessionOrder',
      method: 'post',
      data: obj
  })
}
// 查询生成交接班流水
export function queryWorkFlow(obj) {
  return request({
    url: '/benefit/web/tSuccessionOrder/params',
    method: 'get',
    params: obj
  })
}
// 分页查询交接班记录
export function queryList(obj) {
  return request({
    url: '/benefit/web/tSuccessionOrder/page',
    method: 'get',
    params: obj
  })
}
// 导出
export function exportBill(obj) {
  return request({
    url: '/benefit/web/tSuccessionOrder/export',
    method: 'get',
    params: obj
  })
}
