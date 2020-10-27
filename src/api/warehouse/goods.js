import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-warehouse/goods/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const getPage = (parentId) => {
  return request({
    url: '/api/taocao-warehouse/goods/page',
    method: 'get',
    params: {
     data: parentId
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/taocao-warehouse/goods/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-warehouse/goods/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-warehouse/goods/submit',
    method: 'post',
    data: row
  })
}


export const selectListBycode = (id) => {
  return request({
    url: '/api/taocao-warehouse/goods/selectListBycode',
    method: 'get',
    data: id
  })
}


