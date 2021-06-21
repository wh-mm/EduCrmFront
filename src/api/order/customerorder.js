import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/business/order/list',
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
    url: '/api/business/order/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/business/order/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/business/order/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/business/order/submit',
    method: 'post',
    data: row
  })
}

export const getInfo = (par) => {
  return request({
    url: par.url,
    method: 'get',
    params: par.params
  })
}

