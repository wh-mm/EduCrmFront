import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-warehouse/unit/list',
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
    url: '/api/taocao-warehouse/unit/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-warehouse/unit/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-warehouse/unit/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/taocao-warehouse/unit/submit',
    method: 'post',
    data: row
  })
}

