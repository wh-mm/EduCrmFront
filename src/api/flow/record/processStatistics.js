import request from '@/router/axios';

export const statisticsList = () => {
  return request({
    url: '/api/blade-desk/process-statistics/statisticsList',
    method: 'get',
  })
}
