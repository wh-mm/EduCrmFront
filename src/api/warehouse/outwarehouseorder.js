import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/warehouse/outwarehouseorder/page',
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
    url: '/api/warehouse/outwarehouseorder/details',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/warehouse/outwarehouseorder/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/warehouse/outwarehouseorder/submits',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/warehouse/outwarehouseorder/submits',
    method: 'post',
    data: row
  })
}
export const printOutWarehouseDetail = (id) => {
  return request({
    url: '/api/warehouse/outwarehouseorder/printOutWarehouseDetail',
    method: 'post',
    params:{
      id
    }
  })
}
