import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/materialsDelivery/materialsdelivery/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetails = (id) => {
  return request({
    url: '/api/materialsDelivery/materialsdelivery/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/materialsDelivery/materialsdelivery/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/materialsDelivery/materialsdelivery/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/materialsDelivery/materialsdelivery/submit',
    method: 'post',
    data: row
  })
}
export const viewPurchaseOrder = (purchaseId) => {
  return request({
    url: '/api/materialsDelivery/materialsdelivery/viewPurchaseOrder',
    method: 'post',
    params:{
      purchaseId
    }
  })
}

