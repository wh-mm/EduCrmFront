import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-warehouse/repertory/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


