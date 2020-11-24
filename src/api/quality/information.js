import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/quality/information/page',
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
    url: '/api/quality/information/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/quality/information/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/quality/information/submitAll',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/quality/information/submitAll',
    method: 'post',
    data: row
  })
}
/**
 * 审核
 * @param id
 * @param operation
 */
export const updateInspector = (ids,operation) => {
  return request({
    url: '/api/quality/information/updateInspector',
    method: 'post',
    params:{
      ids,
      operation
    }
  })
}

export function shenfen (rule, value,callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if(value==''||value==undefined||value==null){
    callback();
  }else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的身份证号码'));
    } else {
      callback();
    }
  }
}
