import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-warehouse/outputorder/page',
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
    url: '/api/taocao-warehouse/outputorder/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-warehouse/outputorder/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-warehouse/outputorder/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/taocao-warehouse/outputorder/submit',
    method: 'post',
    data: row
  })
}

export const updateStatus = (id, status) => {
  return request({
    url: '/api/taocao-warehouse/outputorder/updateStatus',
    method: 'post',
    params:{
      id,
      status
    }
  })
}


