import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-warehouse/goods/list',
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
export const dictionaryByParentId = (parentId) => {
  return request({
    url: '/api/blade-system/dictCategory/dictionaryByParentId',
    method: 'get',
    data: parentId
  })
}
export const selectGoodsName = (goodsName) => {
  return request({
    url: '/api/taocao-warehouse/goods/selectGoodsName',
    method: 'get',
    params: {
      goodsName,
    }
  })
}




