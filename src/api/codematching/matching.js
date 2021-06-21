import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-codematching/matching/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const zremove = (ids) => {
  return request({
    url: '/api/taocao-codematching/matching/zremove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/taocao-codematching/matching/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-codematching/matching/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-codematching/matching/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/taocao-codematching/matching/submit',
    method: 'post',
    data: row
  })
}

