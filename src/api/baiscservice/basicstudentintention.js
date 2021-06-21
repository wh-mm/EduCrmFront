import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/basicstudentintention/list',
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
    url: '/api/basicstudentintention/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/basicstudentintention/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}


export const addIntention = (row) => {
  return request({
    url: '/api/basicstudentintention/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/basicstudentintention/submit',
    method: 'post',
    data: row
  })
}
export function timeLine  (id) {
  return request({
    url: '/api/basicstudentintention/timeLine',
    method: 'get',
    params:{id}
  })
}

