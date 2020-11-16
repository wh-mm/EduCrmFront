import request from '@/router/axios';
import {ERP_WMS_NAME} from '@/const/YueConst';

export const getList = (current, size, params) => {
  return request({
    url: ERP_WMS_NAME + '/goods-type/list',
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
    url: ERP_WMS_NAME + '/goods-type/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: ERP_WMS_NAME + '/goods-type/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: ERP_WMS_NAME + '/goods-type/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: ERP_WMS_NAME + '/goods-type/submit',
    method: 'post',
    data: row
  })
}

export const getLazyList = (parentId, params) => {
  return request({
    url: ERP_WMS_NAME + '/goods-type/lazy-list',
    method: 'get',
    params: {
      ...params,
      parentId
    }
  })
}

export const getGoodsTypeTree = (parentId) => {
  return request({
    url: ERP_WMS_NAME + '/goods-type/tree',
    method: 'get',
    params: {
      parentId,
    }
  })
}
