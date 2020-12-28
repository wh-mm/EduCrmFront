import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/tao-transfer/transfer/page',
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
    url: '/api/tao-transfer/transfer/page',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/tao-transfer/transfer/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/tao-transfer/transfer/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/tao-transfer/transfer/submit',
    method: 'post',
    data: row
  })
}

export const updateTransfer = (id,updateStatus) => {
  return request({
    url: '/api/tao-transfer/transfer/updateTransfer',
    method: 'post',
    params: {
      id,
      updateStatus
    }
  })
}

