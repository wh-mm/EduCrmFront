import request from '@/router/axios';
import {ERP_BASE_NAME} from "@/const/YueConst";

export const getList = (current, size, params) => {
  return request({
    url: '/api/parties/orderpartiescategory/list',
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
    url: '/api/parties/orderpartiescategory/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/parties/orderpartiescategory/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/parties/orderpartiescategory/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/parties/orderpartiescategory/submit',
    method: 'post',
    data: row
  })
}
export const getLazyList = (parentId, params) => {
  return request({
    url: '/api/parties/orderpartiescategory/lazy-list',
    method: 'get',
    params: {
      ...params,
      parentId
    }
  })
}

export const getpartiesTree = (parentId) => {
  return request({
    url: '/api/parties/orderpartiescategory/tree',
    method: 'get',
    params: {
      parentId,
    }
  })
}

