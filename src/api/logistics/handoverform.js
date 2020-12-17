import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/logistics/handoverform/list',
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
    url: '/api/logistics/handoverform/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/logistics/handoverform/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (hospitalId,distributionIds) => {
  return request({
    url: '/api/logistics/handoverform/add',
    method: 'post',
    params: {
      hospitalId,distributionIds
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/logistics/handoverform/update',
    method: 'post',
    data: row
  })
}
