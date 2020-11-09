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

export const getGoodsDetail = (id) => {
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

export const update = (row) => {
  return request({
    url: '/api/taocao-warehouse/goods/submit',
    method: 'post',
    data: row
  })
}


export const selectGoodsName = (id,name) => {
  return request({
    url: '/api/taocao-warehouse/goods/selectName',
    method: 'get',
    params: {
      id,
      name
    }
  })
}

export const selectGoodsCode = (id, code) => {
  return request({
    url: '/api/taocao-warehouse/goods/selectCode',
    method: 'get',
    params: {
      id,
      code
    }
  })
}
export const dropDowns = (name) => {
  return request({
    url: '/api/taocao-warehouse/goods/dropDowns',
    method: 'post',
    params: {
      name
    }
  })
}





