import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-log/hospitalapi/page',
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
    url: '/api/blade-log/hospitalapi/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const getApiLogs = (id) => {
  return request({
    url: '/api/blade-log/api/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getApiList = (current, size) => {
  return request({
    url: '/api/blade-log/api/list',
    method: 'get',
    params: {
      current,
      size
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-log/hospitalapi/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-log/hospitalapi/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-log/hospitalapi/submit',
    method: 'post',
    data: row
  })
}

