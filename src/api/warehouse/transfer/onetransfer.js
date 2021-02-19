import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/wh-one-transfer/onetransfer/page',
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
    url: '/api/wh-one-transfer/onetransfer/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/wh-one-transfer/onetransfer/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/wh-one-transfer/onetransfer/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/wh-one-transfer/onetransfer/submit',
    method: 'post',
    data: row
  })
}
export const saveOneTransfer = (id,oneTransfer) => {
  return request({
    url: '/api/wh-one-transfer/onetransfer/saveOneTransfer',
    method: 'post',
    params:{
      id,
      ...oneTransfer
    }
  })
}

