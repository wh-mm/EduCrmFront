import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-order/order/list',
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
    url: '/api/taocao-order/order/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-order/order/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-order/order/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/taocao-order/order/submit',
    method: 'post',
    data: row
  })
}
export const getInfo = (par) => {
  return request({
    url: par.url,
    method: 'post',
    params: par.params
  })
}

export const selectListBydrugCategory = (current, size, params) => {
  return request({
    url: '/api/taocao-warehouse/goods/selectListBydrugCategory',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const receiveDecoctingSave = (row) => {
  return request({
    url: '/api/taocao-order/order/receiveDecoctingSave',
    method: 'post',
    data: row
  })
}
export const receiveBlenderSave = (row) => {
  return request({
    url: '/api/taocao-order/order/receiveBlenderSave',
    method: 'post',
    data: row
  })
}

