import request from '@/router/axios';
import {ERP_WMS_NAME} from "@/const/YueConst";

export const getList = (current, size, params) => {
  return request({
    url: '/api/taocao-order/order/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
};
//
export const getListsd = (current, size, params) => {
  return request({
    url: '/api/taocao-order/order/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
};

//
export const getLists = (current, size, params) => {
  return request({
    url: '/api/taocao-order/order/pageJianyao',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
};
export const getListd = (current, size, params) => {
  return request({
    url: '/api/taocao-order/order/pagetiaopei',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
};

export const getDetail = (id) => {
  return request({
    url: '/api/taocao-order/order/detail',
    method: 'get',
    params: {
      id
    }
  })
};

export const remove = (ids) => {
  return request({
    url: '/api/taocao-order/order/remove',
    method: 'post',
    params: {
      ids,
    }
  })
};

export const add = (row) => {
  return request({
    url: '/api/taocao-order/order/submit',
    method: 'post',
    data: row
  })
};

export const update = (row) => {
  return request({
    url: '/api/taocao-order/order/submit',
    method: 'post',
    data: row
  })
}
export const getInfo = (url, orderId) => {
  return request({
    url: url,
    method: 'post',
    params: {
      orderId: orderId
    }
  })
};

export const dictionaryByName = (name) => {
  return request({
    url: '/api/blade-system/dictCategory/dictionaryByName',
    method: 'get',
    params: {
      name
    }
  })
};

export const selectListByDrugCategory = (current, size, params) => {
  return request({
    url: ERP_WMS_NAME + '/goods/selectListBydrugCategory',

    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
};
export const selecListGoodsByTypeKL = (current, size, params) => {
  return request({
    url: ERP_WMS_NAME + '/goods/selecListGoodsByTypeKL',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
};


export const receiveDecoctingSave = (row) => {
  return request({
    url: '/api/taocao-order/order/receiveDecoctingSave',
    method: 'post',
    data: row
  })
};
export const receiveBlenderSave = (row) => {
  return request({
    url: '/api/taocao-order/order/receiveBlenderSave',
    method: 'post',
    data: row
  })
};

//调配机诊所保存方法
export const clinicReceiveBlender = (row) => {
  return request({
    url: '/api/taocao-order/order/clinicReceiveBlender',
    method: 'post',
    data: row
  })
};
//煎药机诊所保存方法
export const clinicReceiveDecoctingSave = (row) => {
  return request({
    url: '/api/taocao-order/order/clinicReceiveDecoctingSave',
    method: 'post',
    data: row
  })
};
export const selectByOrderId = (orderId) => {
  return request({
    url: '/api/taocao-order/order/selectByOrderId',
    method: 'post',
    params: {
      orderId
    }

  })
};
export const updateOrderStatic = (orderId) => {
  return request({
    url: '/api/taocao-order/order/updateOrderStatic',
    params: {
      orderId
    }

  })
};


