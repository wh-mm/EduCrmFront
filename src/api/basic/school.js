import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/school/list',
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
    url: '/api/school/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/school/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const deleteByIdzs = (id) => {
  return request({
    url: '/api/school/deleteByIdzs',
    method: 'post',
    params: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/school/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/school/submit',
    method: 'post',
    data: row
  })
}
export const importSchool = (row) => {
  return request({
    url: '/api/school/import-school',
    method: 'post',
    data: row
  })
}



