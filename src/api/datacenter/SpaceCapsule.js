import request from '@/router/axios';
//
export const getOrderTotal = (params) => {
  return request({
    url: '/api/SpaceCapsuleController/selectGrain',
    method: 'get',
    params: params,
  })
}

