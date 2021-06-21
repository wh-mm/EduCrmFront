import request from '@/router/axios';
import {ERP_BASEE_NAME} from '@/const/YueConst'

export const getList = (current, size, params) => {
  return request({
    url: ERP_BASEE_NAME + '/order-number/list',
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
    url: ERP_BASEE_NAME + '/order-number/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: ERP_BASEE_NAME + '/order-number/remove',
    method: 'get',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: ERP_BASEE_NAME + '/order-number/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: ERP_BASEE_NAME + '/order-number/submit',
    method: 'post',
    data: row
  })
}

