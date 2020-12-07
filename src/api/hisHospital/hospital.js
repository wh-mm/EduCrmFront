import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-hisHospital/hospital/list',
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
    url: '/api/taocao-hisHospital/hospital/detail',
    method: 'get',
    params: {
      id
    }
  })
}
export const getHospitalDetail = (id) => {
  return request({
    url: '/api/taocao-hisHospital/hospital/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/taocao-hisHospital/hospital/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/taocao-hisHospital/hospital/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/taocao-hisHospital/hospital/submit',
    method: 'post',
    data: row
  })
}
export const selectHosptalByHospintl = (id,name) => {
  return request({
    url: '/api/taocao-hisHospital/hospital/selectHosptalByHospintl',
    method: 'get',
    params: {
      id,
      name
    }
  })
}
