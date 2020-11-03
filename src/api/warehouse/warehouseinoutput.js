import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/list',
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
    url: '/api/taocao-warehouse/warehouseinoutput/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/submit',
    method: 'post',
    data: row
  })
}
export const updateStatus = (id, status) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/updateStatus',
    method: 'post',
    params:{
      id,
      status
    }
  })
}

