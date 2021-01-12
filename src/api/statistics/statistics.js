import request from '@/router/axios';

export const getOrderTotal = (params) => {
    return request({
        url: '/api/orderStatisticsController/orderTotal',
        method: 'get',
        params: params,
    })
}
/*医院钱查询*/
export const getselectOrderListMoneyByTime = (params) => {
  return request({
    url: '/api/orderStatisticsController/selectOrderListMoneyByTime',
    method: 'get',
    params: params,
  })
}
/*医院订单数量查询*/
export const selectOrderListNumberByTime = (params) => {
  return request({
    url: '/api/orderStatisticsController/selectOrderListNumberByTime',
    method: 'get',
    params: params,
  })
}

