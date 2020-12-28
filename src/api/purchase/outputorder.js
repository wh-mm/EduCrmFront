import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/purchase/outputorder/page',
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
    url: '/api/purchase/outputorder/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/purchase/outputorder/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/purchase/outputorder/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/purchase/outputorder/submit',
    method: 'post',
    data: row
  })
}

export const updateStatus = (id, status,rejectText) => {
  return request({
    url: '/api/purchase/outputorder/updateStatus',
    method: 'post',
    params:{
      id,
      status,
      rejectText
    }
  })
}

export const inventoryToRetrieve = (goodsId) => { //库存检索
  return request({
    url: '/api/purchase/outputorder/inventoryToRetrieve',
    method: 'post',
    params:{
      goodsId
    }
  })
}
export const selectGoodsGross = (goodsId) => { //库存总量
  return request({
    url: '/api/purchase/outputorder/selectGoodsGross',
    method: 'post',
    params:{
      goodsId
    }
  })
}
export const viewReason = (id) => {  //查看驳回理由
  return request({
    url: '/api/purchase/outputorder/viewReason',
    method: 'post',
    params:{
      id
    }
  })
}

export const updaterejectText = (ids,rejectText) => { //填写驳回理由
  return request({
    url: '/api/purchase/outputorder/updaterejectText',
    method: 'post',
    params:{
      ids,
      rejectText
    }
  })
}

export const printOutputorderDetail = (id) => {
  return request({
    url: '/api/purchase/outputorder/printOutputorderDetail',
    method: 'get',
    params:{
      id
    }
  })
}


