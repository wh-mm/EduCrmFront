import request from '@/router/axios';

export const getListTemporary = (current, size, params) => {
  return request({
    url: '/api/business_check_temporary/checktemporary/page',
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
    url: '/api/business_check_temporary/checktemporary/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/business_check_temporary/checktemporary/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/business_check_temporary/checktemporary/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/business_check_temporary/checktemporary/submit',
    method: 'post',
    data: row
  })
}
export const saveImportExcelData = (checkDetailList) => {
  return request({
    url: '/api/business_check_temporary/checktemporary/saveImportExcelData',
    method: 'post',
    data: checkDetailList
  })
}
export const deleteCheckTemporary = (id) => {
  return request({
    url: '/api/business_check_temporary/checktemporary/deleteCheckTemporary',
    method: 'get',
    params:{
      id
    }
  })
}
export const deleteCheck = () => {
  return request({
    url: '/api/business_check_temporary/checktemporary/deleteCheck',
    method: 'get',

  })
}

