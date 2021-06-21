import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/quality/customer/page',
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
    url: '/api/quality/customer/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/quality/customer/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/quality/customer/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/quality/customer/submit',
    method: 'post',
    data: row
  })
}
/**
 * 审核
 * @param id
 * @param operation
 */
export const updateInspector = (ids,operation) => {
  return request({
    url: '/api/quality/customer/updateInspector',
    method: 'post',
    params:{
      ids,
      operation
    }
  })
}
