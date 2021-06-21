import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/wh-check/check/page',
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
    url: '/api/wh-check/check/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/wh-check/check/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/wh-check/check/submit',
    method: 'post',
    data: row
  })
}
export const saveCheckOrder = (checkDetailList) => {
  return request({
    url: '/api/wh-check/check/saveCheckOrder',
    method: 'post',
    data:checkDetailList

  })
}

export const update = (row) => {
  return request({
    url: '/api/wh-check/check/submit',
    method: 'post',
    data: row
  })
}
export const selectCheck = (id) => {
  return request({
    url: '/api/wh-check/check/selectCheck',
    method: 'get',
    params: {
      id
    }
  })
}
export const detailNew = (current, size, params) => {
  return request({
    url: '/api/wh-check/check/detailNew',
    method: 'get',
    params:{
      ...params,
      current,
      size,
    }
  })
}

export const updateFatherCheckStatus = (id,checkStatus,rejectText) => {
  return request({
    url: '/api/wh-check/check/updateFatherCheckStatus',
    method: 'post',
    params: {
      id,
      checkStatus,
      rejectText
    }
  })
}
export const checkDetailInWarehouse = (id) => {
  return request({
    url: '/api/wh-check/check/checkDetailInWarehouse',
    method: 'post',
    params: {
      id
    }
  })
}
export const updateRow = (id,realRepertoryQuantity) => {
  return request({
    url: '/api/wh-check/check/updateRow',
    method: 'post',
    params: {
      id,
      realRepertoryQuantity
    }
  })
}
