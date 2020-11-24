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


