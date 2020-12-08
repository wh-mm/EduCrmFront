import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/erp-wms/repertory-expiry-time/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}



