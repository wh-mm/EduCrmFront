import request from '@/router/axios';
import {ERP_WMS_NAME} from "@/const/YueConst";

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
    url: '/api/quality/information/getDetail',
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
export const updateInspector = (ids,operation,rejectText) => {
  return request({
    url: '/api/quality/information/updateInspector',
    method: 'post',
    params:{
      ids,
      operation,
      rejectText
    }
  })
}

export const  selectGoodsCode = (id,code) => {
  return request({
    url: '/api/quality/information/selectCode',
    method: 'get',
    params: {
      id,
      code
    }
  })
}
export const submitInspector = (id) => {
  return request({
    url: '/api/quality/information/submitInspector',
    method: 'post',
    params:{
      id
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

export const validateContacts = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入中文'))
  }
  if (!/^[\u0391-\uFFE5A-Za-z]+$/.test(value)) {
    callback(new Error('不可输入特殊字符'))
  } else {
    callback()
  }
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

/**
 * 查重名字
 * @param id
 * @param name
 * @returns {AxiosPromise}
 */
export const selectName = (id,name) => {
  return request({
    url: '/api/quality/information/selectName',
    method: 'get',
    params: {
      id,
      name
    }
  })
}
