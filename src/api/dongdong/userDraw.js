import request from '@/router/axios'

export function fetchUserDraw(obj) {
  return request({
    url: '/benefit/web/userDraw/page',
    method: 'get',
    params: obj
  })
}

export function sendUserDraw(id) {
    return request({
      url: '/benefit/web/userDraw/send/' + id,
      method: 'post'
    })
}