import request from '@/router/axios';


export const getList = (current, size, params) => {
  return request({
    url:  '/api/logistics/distribution-centre/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const submitTransport = (carId, driverId, distributionIds) => {
  return request({
    url: '/api/logistics/distribution-centre/submitTransport',
    method: 'post',
    params: {
      carId, driverId, distributionIds
    }
  })
}
