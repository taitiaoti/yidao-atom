import request from '@/router/axios'

export function fetchList(query) { //获取创客列表
    return request({
        url: '/benefit/web/makerUser/page',
        method: 'get',
        params: query
    })
}

export function add(obj) { //新增创客
    return request({
        url: '/benefit/web/makerUser',
        method: 'post',
        data: obj
    })
}

export function againSubmit(obj) { //重新提交审核
    return request({
      url: '/benefit/web/makerUser/againSubmit',
      method: 'put',
      data: obj
    })
}

export function makerCheckList(obj) { //创客审核列表
    return request({
        url: '/benefit/web/makerUser/examinePage',
        method: 'get',
        params: obj
    })
}

export function findMakerById(id) { //根据ID查找创客
    return request({
        url: '/benefit/web/makerUser/findById/' + id,
        method: 'get'
    })
}

export function makerPass(id) { //通过审核
    return request({
      url: '/benefit/web/makerUser/pass/' + id,
      method: 'put'
    })
}

export function makerRefuse(id, obj) { //拒绝通过审核
    return request({
      url: '/benefit/web/makerUser/refuse/' + id,
      method: 'put',
      params: obj
    })
  }