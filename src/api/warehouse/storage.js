import request from '@/router/axios';
import {ERP_WMS_NAME} from '@/const/YueConst';

export const getList = (current, size, params,warehouseId) => {
  return request({
    url: ERP_WMS_NAME + '/storage/list',
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
    url: ERP_WMS_NAME + '/storage/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: ERP_WMS_NAME + '/storage/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: ERP_WMS_NAME + '/storage/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: ERP_WMS_NAME + '/storage/submit',
    method: 'post',
    data: row
  })
}

export const getLazyList = (parentId,warehouseId, params) => {
  return request({
    url: ERP_WMS_NAME + '/storage/lazy-list',
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
    url: ERP_WMS_NAME + '/storage/tree',
    method: 'get',
    params: {
      warehouseId
    }
  })
}

export const dropDown = (warehouseId,type) => {
  return request({
    url: ERP_WMS_NAME + '/storage/dropDown',
    method: 'post',
    params: {
      warehouseId,
      type
    }
  })
}
