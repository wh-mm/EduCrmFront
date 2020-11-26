import request from '@/router/axios';
import {ERP_WMS_NAME} from "@/const/YueConst"
export const getList = (current, size, params) => {
  return request({
    url: ERP_WMS_NAME + '/goods/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const getPage = (parentId) => {
  return request({
    url: ERP_WMS_NAME + '/goods/page',
    method: 'get',
    params: {
     data: parentId
    }
  })
}

export const getGoodsDetail = (id) => {
  return request({
    url: ERP_WMS_NAME + '/goods/detail',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: ERP_WMS_NAME + '/goods/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: ERP_WMS_NAME + '/goods/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: ERP_WMS_NAME + '/goods/submit',
    method: 'post',
    data: row
  })
}


export const selectGoodsName = (id,name) => {
  return request({
    url: ERP_WMS_NAME + '/goods/selectName',
    method: 'get',
    params: {
      id,
      name
    }
  })
}

export const  selectGoodsCode = (id,code) => {
  return request({
    url: ERP_WMS_NAME + '/goods/selectCode',
    method: 'get',
    params: {
      id,
      code
    }
  })
}
export const dropDowns = (name) => {
  return request({
    url: ERP_WMS_NAME + '/goods/dropDowns',
    method: 'post',
    params: {
      name
    }
  })
}

export const  selecListGoodsName = (id) => {
  return request({
    url: ERP_WMS_NAME + '/goods/selecListGoodsName',
    method: 'get',
    params: {
      id
    }
  })
}




