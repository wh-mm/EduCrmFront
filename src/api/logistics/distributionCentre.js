import request from '@/router/axios';


export const getList = (current, size, params) => {
  return request({
    url:  '/api/logistics/distribution-centre/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const submitTransport = (carId, driverId, ids) => {
  return request({
    url: '/api/logistics/distribution-centre/submitTransport',
    method: 'post',
    params: {
      carId, driverId, ids
    }
  })
}
