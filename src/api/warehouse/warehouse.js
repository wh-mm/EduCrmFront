import request from '@/router/axios';
import {ERP_WMS_NAME} from '@/const/YueConst';

export const getList = (current, size, params) => {
  return request({
    url: ERP_WMS_NAME + '/warehouse/list',
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
    url: ERP_WMS_NAME + '/warehouse/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: ERP_WMS_NAME + '/warehouse/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: ERP_WMS_NAME + '/warehouse/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: ERP_WMS_NAME + '/warehouse/submit',
    method: 'post',
    data: row
  })
}

export const  testingOnlyCode = (id,code) => {
  return request({
    url: ERP_WMS_NAME + '/warehouse/testingOnlyCode',
    method: 'get',
    params: {
      id,
      code
    }
  })
}
export const selectName = (id,name) => {
  return request({
    url: ERP_WMS_NAME + '/warehouse/selectName',
    method: 'get',
    params: {
      id,
      name
    }
  })
}
export const warehousename = (name) => {
  return request({
    url: ERP_WMS_NAME + '/warehouse/selectName',
    method: 'get',
    params: {
      name,
    }
  })
}
export const getLazyList = (parentId, params) => {
  return request({
    url: ERP_WMS_NAME + '/warehouse/lazy-list',
    method: 'get',
    params: {
      ...params,
      parentId
    }
  })
}
export const getWarehouseTree = (parentId) => {
  return request({
    url: ERP_WMS_NAME + '/warehouse/tree',
    params: {
      parentId,
    }
  })
}
export const getWarehouseLazyTree = (parentId) => {
  return request({
    url: ERP_WMS_NAME + '/warehouse/lazy-tree',
    params: {
      parentId
    }
  })
};
