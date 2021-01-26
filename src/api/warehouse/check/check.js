import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/wh-check/check/page',
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
    url: '/api/wh-check/check/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/wh-check/check/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/wh-check/check/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/wh-check/check/submit',
    method: 'post',
    data: row
  })
}
export const selectCheck = (id) => {
  return request({
    url: '/api/wh-check/check/selectCheck',
    method: 'get',
    params: {
      id
    }
  })
}

