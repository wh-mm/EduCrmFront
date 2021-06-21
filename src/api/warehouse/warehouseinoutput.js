import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/page',
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
    url: '/api/taocao-warehouse/warehouseinoutput/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/submit',
    method: 'post',
    data: row
  })
}
export const updateStatus = (id, status) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/updateStatus',
    method: 'post',
    params:{
      id,
      status
    }
  })
}
export const selectByWarehouseInoutputId = (warehouseinoutputId) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/selectByWarehouseInoutputId',
    method: 'post',
    params:{
      warehouseinoutputId
    }
  })
}
// export const selectWarehouseHistory = (type) => {
//   return request({
//     url: '/api/taocao-warehouse/warehouseinoutput/selectWarehouseHistory',
//     method: 'get',
//     params:{
//       type
//     }
//   })
// }

export const selectWarehouseHistory = (current, size, params) => {
  return request({
    url: '/api/taocao-warehouse/warehouseinoutput/selectWarehouseHistory',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
