import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/quality/commodity/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getCommodityDetail = (id,goodsId) => {
  return request({
    url: '/api/quality/commodity/detail',
    method: 'get',
    params: {
      id,
      goodsId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/quality/commodity/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/quality/commodity/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/quality/commodity/submit',
    method: 'post',
    data: row
  })
}
//发起
export const submitInspector = (id) => {
  return request({
    url: '/api/quality/commodity/submitInspector',
    method: 'post',
    params:{
      id
    }
  })
}

/**
 * 审核
 * @param id
 * @param operation
 */
export const updateInspector = (ids,operation,rejectText) => {
  return request({
    url: '/api/quality/commodity/updateInspector',
    method: 'post',
    params:{
      ids,
      operation,
      rejectText
    }
  })
}
export function isInteger(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    }
  }, 0);
}

