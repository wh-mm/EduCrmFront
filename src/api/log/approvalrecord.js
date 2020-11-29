import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/erp-log/approvalrecord/page',
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
    url: '/api/erp-log/approvalrecord/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/erp-log/approvalrecord/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/erp-log/approvalrecord/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/erp-log/approvalrecord/submit',
    method: 'post',
    data: row
  })
}
export function timeLine(type,id) {
  return request({
    url: '/api/erp-log/approvalrecord/timeLine',
    method: 'get',
    params: {
      type,
      id
    }
  })
}

