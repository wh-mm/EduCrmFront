import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/business_repertory_warn/repertorywarn/page',
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
    url: '/api/business_repertory_warn/repertorywarn/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/business_repertory_warn/repertorywarn/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/business_repertory_warn/repertorywarn/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/business_repertory_warn/repertorywarn/submit',
    method: 'post',
    data: row
  })
}
export const selctRepertoryWarnQuantity = (goodsId) => {
  return request({
    url: '/api/business_repertory_warn/repertorywarn/selctRepertoryWarnQuantity',
    method: 'post',
    params:{
      goodsId
    }
  })
}
export const ScanWarning = () => {
  return request({
    url: '/api/business_repertory_warn/repertorywarn/ScanWarning',
    method: 'post',

  })
}

