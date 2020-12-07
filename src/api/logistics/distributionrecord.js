import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/logistics/distributionrecord/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const record = (current, size, params) => {
  return request({
    url:'/api/logistics/distribution-order/record',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}



