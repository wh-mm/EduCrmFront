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

export const getListjr = (current, size, params) => {
  return request({
    url: '/api/taocao-order/order/jrpage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
};


export const getListHs = (current, size, params) => {
  return request({
    url: '/api/taocao-order/order/hspage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
};

//
export const getListJianyao = (current, size, params) => {
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
export const getListTiaopei = (current, size, params) => {
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

export const orderDelete = (id) => {
  return request({
    url: '/api/taocao-order/order/orderDelete',
    method: 'post',
    params: {
      id,
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
//保存 调配机
export const receiveBlenderSave = (row) => {
  return request({
    url: '/api/taocao-order/order/receiveBlenderSave',
    method: 'post',
    data: row
  })
};

//修改 调配机
export const updateReceiveBlender = (row) => {
  return request({
    url: '/api/taocao-order/order/updateReceiveBlender',
    method: 'post',
    data: row
  })
};
//煎药机修改方法
export const updateReceiveDecocting = (row) => {
  return request({
    url: '/api/taocao-order/order/updateReceiveDecocting',
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
export const updateOrderStatic = (orderId,zt) => {
  return request({
    url: '/api/taocao-order/order/updateOrderStatic',
    params: {
      orderId,
      zt
    }

  })
};

export const updateOrderStaticBh = (orderId,zt,auditorText) => {
  return request({
    url: '/api/taocao-order/order/updateOrderStaticBh',
    params: {
      orderId,
      zt,
      auditorText
    }

  })
};

export const updateOrderStaticH = (orderId) => {
  return request({
    url: '/api/taocao-order/order/updateOrderStaticH',
    params: {
      orderId
    }

  })
};

export const updateApply = (id, status) => {
  return request({
    url: '/api/taocao-order/order/updateApply',
    method: 'post',
    params:{
      id,
      status
    }
  })
}
//颗粒子项删除
export const iBlenderDelete = (id) => {
  return request({
    url: '/api/taocao-order/order/iBlenderDelete',
    method: 'post',
    params: {
      id,
    }
  })
}
//颗粒子项删除
export const selectRecipients = (orderId) => {
  return request({
    url: '/api/taocao-order/order/selectRecipients',
    method: 'post',
    params: {
      orderId,
    }
  })
}

