import request from '@/router/axios';

export const getLists = (current, size, params) => {
  return request({
    url: '/api/purchase/input-order/page',
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
    url: '/api/purchase/input-order/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/purchase/input-order/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/purchase/input-order/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/purchase/input-order/submit',
    method: 'post',
    data: row
  })
}

export const updateStatus = (id, status) => {
  return request({
    url: '/api/purchase/input-order/updateStatus',
    method: 'post',
    params:{
      id,
      status
    }
  })
}
export const inventoryToRetrieve = (warehouseId) => { //库存检索
  return request({
    url: '/api/purchase/input-order/inventoryToRetrieve',
    method: 'post',
    params:{
      warehouseId
    }
  })
}
export const viewReason = (id) => {  //查看驳回理由
  return request({
    url: '/api/purchase/input-order/viewReason',
    method: 'post',
    params:{
      id
    }
  })
}

export const updaterejectText = (ids,rejectText) => { //填写驳回理由
  return request({
    url: '/api/purchase/input-order/updaterejectText',
    method: 'post',
    params:{
      ids,
      rejectText
    }
  })
}

export const printInputorderDetail = (id) => {
  return request({
    url: '/api/purchase/input-order/printInputOrderDetail',
    method: 'get',
    params:{
      id
    }
  })
}

