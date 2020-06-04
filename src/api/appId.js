import request from '@/router/axios'

export function fetchAppIdList() {
  return request({
    url: '/admin/developApp/list',
    method: 'get'
  })
}

export function bindApp() {
    return request({
      url: '/admin/developApp/userApps',
      method: 'get'
    })
}