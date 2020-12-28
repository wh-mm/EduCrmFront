import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/logistics/handoverform/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const view = (current, size, id) => {
  return request({
    url: '/api/logistics/handoverform/view',
    method: 'get',
    params: {
      id,
      current,
      size,
    }
  })
}
export const viewList = (id) => {
  return request({
    url: '/api/logistics/handoverform/viewList',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/logistics/handoverform/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/logistics/handoverform/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (hospitalId,distributionIds) => {
  return request({
    url: '/api/logistics/handoverform/add',
    method: 'post',
    params: {
      hospitalId,distributionIds
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/logistics/handoverform/update',
    method: 'post',
    data: row
  })
}

export const submitTransport = (carId, driverId, ids) => {
  return request({
    url: '/api/logistics/handoverform/submitTransport',
    method: 'post',
    params: {
      carId, driverId, ids
    }
  })
}

export const updateById = (id) => {
  return request({
    url: '/api/logistics/handoverform/updateById',
    method: 'post',
    params: {
      id
    }
  })
}

