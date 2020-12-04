import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/purchase/purchaseorder/page',
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
    url: '/api/purchase/purchaseorder/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/purchase/purchaseorder/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/purchase/purchaseorder/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/purchase/purchaseorder/submit',
    method: 'post',
    data: row
  })
}
/**
 * 1.采购经理修改状态
 * @param id
 * @param status
 */
export const updateApply = (id, status) => {
  return request({
    url: '/api/purchase/purchaseorder/updateApply',
    method: 'post',
    params:{
      id,
      status
    }
  })
}
/**
 * 2.合同主管修改状态
 * @param id
 * @param status
 */
export const updateContract = (id, status) => {
  return request({
    url: '/api/purchase/purchaseorder/updateContract',
    method: 'post',
    params:{
      id,
      status
    }
  })
}
/**
 * 3.财务部修改状态
 * @param id
 * @param status
 */
export const updateFinancing = (id, status) => {
  return request({
    url: '/api/purchase/purchaseorder/updateFinancing',
    method: 'post',
    params:{
      id,
      status
    }
  })
}
/**
 * 4.经理修改状态
 * @param id
 * @param status
 */
export const updateManager = (id, status) => {
  return request({
    url: '/api/purchase/purchaseorder/updateManager',
    method: 'post',
    params:{
      id,
      status
    }
  })
}
/**
 * 5.仓储运输部收货员修改状态
 * @param id
 * @param status
 */
export const updateGoodsClerk = (id, status) => {
  return request({
    url: '/api/purchase/purchaseorder/updateGoodsClerk',
    method: 'post',
    params:{
      id,
      status
    }
  })
}
/**
 * 6.验收员修改状态
 * @param id
 * @param status
 */
export const updateInspector = (id, status) => {
  return request({
    url: '/api/purchase/purchaseorder/updateInspector',
    method: 'post',
    params:{
      id,
      status
    }
  })
}

/**
 * 7.保管员修改状态入库
 * @param id
 * @param status
 */
export const updateStatus = (id, status) => {
  return request({
    url: '/api/purchase/purchaseorder/updateStatus',
    method: 'post',
    params:{
      id,
      status
    }
  })
}
export const viewAcceptanceRecord = (id) => { //查看验收记录
  return request({
    url: '/api/purchase/purchaseorder/viewAcceptanceRecord',
    method: 'post',
    params:{
      id
    }
  })
}

export const viewCommodity = (goodsId) => { //查看商品资质
  return request({
    url: '/api/purchase/purchaseorder/viewCommodity',
    method: 'post',
    params:{
      goodsId
    }
  })
}
export const viewReason = (id) => { //查看驳回理由
  return request({
    url: '/api/purchase/purchaseorder/viewReason',
    method: 'post',
    params:{
      id
    }
  })
}
export const updaterejectText = (ids,rejectText) => { //填写驳回理由
  return request({
    url: '/api/purchase/purchaseorder/updaterejectText',
    method: 'post',
    params:{
      ids,
      rejectText
    }
  })
}


