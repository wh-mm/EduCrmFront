import request from '@/router/axios';

export const getOrderTotal = (params) => {
    return request({
        url: '/api/orderStatisticsController/orderTotal',
        method: 'get',
        params: params,
    })
}