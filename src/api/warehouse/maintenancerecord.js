import request from '@/router/axios';
import {ERP_WMS_NAME} from '@/const/YueConst'

export const getList = (current, size, params) => {
  return request({
    url: ERP_WMS_NAME + '/maintenancerecord/page',
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
    url: ERP_WMS_NAME + '/maintenancerecord/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: ERP_WMS_NAME + '/maintenancerecord/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: ERP_WMS_NAME + '/maintenancerecord/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: ERP_WMS_NAME + '/maintenancerecord/submit',
    method: 'post',
    data: row
  })
}

