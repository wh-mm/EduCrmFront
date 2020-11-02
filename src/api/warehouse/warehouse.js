import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-warehouse/warehouse/list',
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
    url: '/api/taocao-warehouse/warehouse/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-warehouse/warehouse/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-warehouse/warehouse/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/taocao-warehouse/warehouse/submit',
    method: 'post',
    data: row
  })
}

export const  testingOnlyCode = (id,code) => {
  return request({
    url: '/api/taocao-warehouse/warehouse/testingOnlyCode',
    method: 'get',
    params: {
      id,
      code
    }
  })
}
export const selectWarehouseName = (name) => {
  return request({
    url: '/api/taocao-warehouse/warehouse/selectName',
    method: 'get',
    params: {
      name,
    }
  })
}
export const warehousename = (name) => {
  return request({
    url: '/api/taocao-warehouse/warehouse/selectName',
    method: 'get',
    params: {
      name,
    }
  })
}
