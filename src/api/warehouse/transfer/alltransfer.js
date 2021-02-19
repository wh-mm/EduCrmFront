import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/wh-all-transfer/alltransfer/page',
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
    url: '/api/wh-all-transfer/alltransfer/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/wh-all-transfer/alltransfer/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/wh-all-transfer/alltransfer/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/wh-all-transfer/alltransfer/submit',
    method: 'post',
    data: row
  })
}

export const saveALLTransfer = (id,allTransfer) => {
  return request({
    url: '/api/wh-all-transfer/alltransfer/saveALLTransfer',
    method: 'post',
    params:{
      id,
      ...allTransfer
    }
  })
}
