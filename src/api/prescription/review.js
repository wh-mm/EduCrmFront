import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-prescription/review/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/taocao-prescription/review/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-prescription/review/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-prescription/review/submitNew',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/taocao-prescription/review/submitNew',
    method: 'post',
    data: row
  })
}

export const shenfang = (ids) => {
  return request({
    url: '/api/taocao-prescription/review/shenfang',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const huChi = (ids) => {
  return request({
    url: '/api/parties/orderdrugexclusion/huChi',
    method: 'post',
    params: {
      ids,
    }
  })
}

