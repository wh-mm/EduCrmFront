import request from '@/router/axios';
import {ERP_WMS_NAME} from '@/const/YueConst';

export const getList = (current, size, params) => {
  return request({
    url: ERP_WMS_NAME + '/repertory/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
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

export const selectByBatchNumber = (batchNumber,goodsId,id) => {   //根据批号查询商品所在位置
  return request({
    url: ERP_WMS_NAME + '/repertory/selectByBatchNumber',
    method: 'post',
    params: {
      batchNumber,
      goodsId,
      id
    }
  })
}


