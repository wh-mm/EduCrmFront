import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/parties/orderpartiesdrug/list',
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
    url: '/api/parties/orderpartiesdrug/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/parties/orderpartiesdrug/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/parties/orderpartiesdrug/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/parties/orderpartiesdrug/submit',
    method: 'post',
    data: row
  })
}

export const getSelectListByDrug = ( partiesDrugId) => {
  return request({
    url: '/api/parties/orderpartiesdrug/selectListByDrug',
    method: 'get',
    params: {
      partiesDrugId,
    }
  })
}
