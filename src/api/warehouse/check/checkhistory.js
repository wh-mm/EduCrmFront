import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/wh-check-history/checkhistory/page',
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
    url: '/api/wh-check-history/checkhistory/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/wh-check-history/checkhistory/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/wh-check-history/checkhistory/saveInWarehouse',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/wh-check-history/checkhistory/saveInWarehouse',
    method: 'post',
    data: row
  })
}

export const saveCheckHistory = (check) => {
  return request({
    url: '/api/wh-check-history/checkhistory/saveCheckHistory',
    method: 'post',
    data:check
  })
}

