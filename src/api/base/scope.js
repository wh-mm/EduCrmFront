import request from '@/router/axios';
import {ERP_BASE_NAME} from "@/const/YueConst";

export const getList = (current, size, params) => {
  return request({
    url: ERP_BASE_NAME + '/scope/list',
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
    url: ERP_BASE_NAME + '/scope/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: ERP_BASE_NAME + '/scope/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: ERP_BASE_NAME + '/scope/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: ERP_BASE_NAME + '/scope/submit',
    method: 'post',
    data: row
  })
}

export const getLazyList = (parentId, params) => {
  return request({
    url: ERP_BASE_NAME + '/scope/lazy-list',
    method: 'get',
    params: {
      ...params,
      parentId
    }
  })
}

export const getScopeTree = (parentId) => {
  return request({
    url: ERP_BASE_NAME + '/scope/tree',
    method: 'get',
    params: {
      parentId,
    }
  })
}

