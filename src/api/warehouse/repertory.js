import request from '@/router/axios';
import {ERP_WMS_NAME} from '@/const/YueConst';

export const getList = (current, size, params) => {
  return request({
    url: ERP_WMS_NAME + '/repertory/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const update = (row) => {
  return request({
    url: ERP_WMS_NAME + '/repertory/submit',
    method: 'post',
    data: row
  })
}

export const saveDate = (row) => {
  return request({
    url: ERP_WMS_NAME + '/repertory/saveDate',
    method: 'post',
    data:row
  })
}
export const saveRepertoryWarning = (repertoryWarnList) => { //保存预警信息
  return request({
    url: ERP_WMS_NAME + '/repertory/saveRepertoryWarning',
    method: 'post',
    data:repertoryWarnList
  })
}

export const selectByBatchNumber = (id) => {   //根据批号查询商品所在位置
  return request({
    url: ERP_WMS_NAME + '/repertory/selectByBatchNumber',
    method: 'post',
    params: {
      id
    }
  })
}
export const selectExpireGoods = (goodsId) => {   //查询即将过期商品
  return request({
    url: ERP_WMS_NAME + '/repertory/selectExpireGoods',
    method: 'post',
    params: {
      goodsId
    }
  })
}
export const deleteRepertory = (id) => {   //查询即将过期商品
  return request({
    url: ERP_WMS_NAME + '/repertory/deleteRepertory',
    method: 'get',
    params: {
      id
    }
  })
}
export const selectWarningGoods = () => {  //查询预警库存
  return request({
    url: ERP_WMS_NAME + '/repertory/selectWarningGoods',
    method: 'post',
  })
}
export const selectRepertoryByGoodsId = (goodsId) => {  //根据商品id查询批号以及库存信息
  return request({
    url: ERP_WMS_NAME + '/repertory/selectRepertoryByGoodsId',
    method: 'post',
    params:{
      goodsId
    }
  })
}
export const selectRepertoryGoods = () => {  //根据商品id查询批号以及库存信息
  return request({
    url: ERP_WMS_NAME + '/repertory/selectRepertoryGoods',
    method: 'post',

  })
}
export const dropDownbatchnumber = (goodsId) => {  //根据商品id查询批号以及库存信息
  return request({
    url: ERP_WMS_NAME + '/repertory/dropDownbatchnumber',
    method: 'post',
    params:{
      goodsId
    }
  })
}

