import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/express/sendinfo/page',
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
    url: '/api/express/sendinfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/express/sendinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/express/sendinfo/submit',
    method: 'post',
    data: row
  })
}
// export const add = (row) => {
//   return request({
//     url: '/api/express/sendinfo/submitSendInfoVO',
//     method: 'post',
//     data: row
//   })
// }

export const update = (row) => {
  return request({
    url: '/api/express/sendinfo/submit',
    method: 'post',
    data: row
  })
}
export const Test = (sendInfoVO) => {
  return request({
    url: '/api/express/sendinfo/Test',
    method: 'post',
    data: sendInfoVO
  })
}

