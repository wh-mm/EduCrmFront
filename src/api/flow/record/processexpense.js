import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-desk/process/expense/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
