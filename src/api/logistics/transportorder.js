import request from '@/router/axios';
import {ERP_TMS_NAME} from '@/const/YueConst'

export const getList = (current, size, params) => {
  return request({
    url: '/api/logistics/transport-order/page',
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
    url:  '/api/logistics/transport-order/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/logistics/transport-order/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/logistics/transport-order/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/logistics/transport-order/submit',
    method: 'post',
    data: row
  })
}

export const updateStatus = (id, status) => {
  return request({
    url: '/api/logistics/transport-order/updateStatus',
    method: 'post',
    params:{
      id,
      status
    }
  })
}
