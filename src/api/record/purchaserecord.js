import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/record/purchaserecord/page',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/record/purchaserecord/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/record/purchaserecord/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/record/purchaserecord/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/record/purchaserecord/submit',
    method: 'post',
    data: row
  })
}

