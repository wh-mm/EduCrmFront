import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url:'/api/logistics/distribution-order/page',
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
    url:'/api/logistics/distribution-order/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url:'/api/logistics/distribution-order/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/logistics/distribution-order/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url:'/api/logistics/distribution-order/submit',
    method: 'post',
    data: row
  })
}

export const updateStatus = (id, status) => {
  return request({
    url: '/api/logistics/distribution-order/updateStatus',
    method: 'post',
    params:{
      id,
      status
    }
  })
}

export const scanOrder = (orderId) => {
  return request({
    url: '/api/logistics/distribution-order/scanOrder',
    method: 'post',
    params:{
      orderId
    }
  })
}

