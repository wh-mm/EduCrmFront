import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/business_reported_loss/reportedloss/page',
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
    url: '/api/business_reported_loss/reportedloss/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/business_reported_loss/reportedloss/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/business_reported_loss/reportedloss/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/business_reported_loss/reportedloss/submit',
    method: 'post',
    data: row
  })
}
export const updateCheckStatusOfRepertored = (id,checkStatus) => {
  return request({
    url: '/api/business_reported_loss/reportedloss/updateCheckStatusOfRepertored',
    method: 'get',
    params:{
      id,
      checkStatus
    }
  })
}
export const updateRepertoryRepertored = (id,repertoryId,checkStatus) => {
  return request({
    url: '/api/business_reported_loss/reportedloss/updateRepertoryRepertored',
    method: 'get',
    params:{
      id,
      repertoryId,
      checkStatus
    }
  })
}

