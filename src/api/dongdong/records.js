import request from '@/router/axios'

export function fetchSubsidyRecords(obj) {
  return request({
    url: '/benefit/web/subsidy/recordsPage',
    method: 'get',
    params: obj
  })
}