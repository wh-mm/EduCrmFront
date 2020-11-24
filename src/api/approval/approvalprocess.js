import request from '@/router/axios';
import {ERP_BAP_NAME}  from '@/const/YueConst'

export const getList = (current, size, params,userId) => {
  return request({
    url: ERP_BAP_NAME + '/approvalprocess/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      userId


    }
  })
}

export const getDetail = (id) => {
  return request({
    url: ERP_BAP_NAME + '/approvalprocess/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: ERP_BAP_NAME + '/approvalprocess/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: ERP_BAP_NAME + '/approvalprocess/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: ERP_BAP_NAME + '/approvalprocess/submit',
    method: 'post',
    data: row
  })
}



