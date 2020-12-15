import request from '@/router/axios';
import {ERP_WMS_NAME} from '@/const/YueConst';

export const getRepertoryList = (current, size, params,goodsId) => {
  return request({
    url: ERP_WMS_NAME + '/repertory/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      goodsId
    }
  })
}
export const saveDate = (row) => {
  return request({
    url: ERP_WMS_NAME + '/repertory/saveDate',
    method: 'post',
    data:row
  })
}

