import request from '@/router/axios';
import {ERP_BASE_NAME} from "@/const/YueConst";

export const getList = (current, size, params) => {
  return request({
    url: ERP_BASE_NAME + '/specification/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getSpecificationListAll = () => {
  return request({
    url: ERP_BASE_NAME + '/specification/list-all',
    method: 'get',
  })
}

export const getDetail = (id) => {
  return request({
    url: ERP_BASE_NAME + '/specification/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: ERP_BASE_NAME + '/specification/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: ERP_BASE_NAME + '/specification/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: ERP_BASE_NAME + '/specification/submit',
    method: 'post',
    data: row
  })
}

