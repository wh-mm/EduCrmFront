import request from '@/router/axios';
import {ERP_BASE_NAME} from "@/const/YueConst";

export const getList = (current, size, params) => {
  return request({
    url: '/api/parties/orderparties/page',
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
    url: '/api/parties/orderparties/details',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/parties/orderparties/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/parties/orderparties/submitAll',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/parties/orderparties/submitAll',
    method: 'post',
    data: row
  })
}


