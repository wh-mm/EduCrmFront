import request from '@/router/axios';

export const getList = (current, size, params,warehouseId) => {
  return request({
    url: '/api/taocao-warehouse/storage/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      warehouseId
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/taocao-warehouse/storage/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-warehouse/storage/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-warehouse/storage/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/taocao-warehouse/storage/submit',
    method: 'post',
    data: row
  })
}

export const getLazyList = (parentId,warehouseId, params) => {
  return request({
    url: '/api/taocao-warehouse/storage/lazy-list',
    method: 'get',
    params: {
      ...params,
      parentId,
      warehouseId
    }
  })
}
export const getStorageTree = (warehouseId) => {
  return request({
    url: '/api/taocao-warehouse/storage/tree',
    method: 'get',
    params: {
      warehouseId
    }
  })
}
