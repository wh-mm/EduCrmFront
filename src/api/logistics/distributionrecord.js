import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/logistics//distributionrecord/list',
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
    url: '/api/logistics/distributionrecord/detail',
    method: 'get',
    params: {
      id
    }
  })
}


