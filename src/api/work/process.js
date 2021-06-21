import request from '@/router/axios';

// =====================参数===========================

export const historyFlowList = (processInstanceId) => {
  return request({
    url: '/api/blade-flow/process/history-flow-list',
    method: 'get',
    params: {
      processInstanceId
    }
  })
}


// =====================请假流程===========================

export const leaveProcess = (data) => {
  return request({
    url: '/api/blade-desk/process/leave/start-process',
    method: 'post',
    data
  })
}

export const leaveDetail = (businessId) => {
  return request({
    url: '/api/blade-desk/process/leave/detail',
    method: 'get',
    params: {
      businessId
    }
  })
}

// =====================报销流程===========================

export const expenseProcess = (data) => {
  return request({
    url: '/api/blade-desk/process/expense/start-process',
    method: 'post',
    data
  })
}

export const expenseDetail = (businessId) => {
  return request({
    url: '/api/blade-desk/process/expense/detail',
    method: 'get',
    params: {
      businessId
    }
  })
}

// =====================加班流程===========================

export const overtimeProcess = (data) => {
  return request({
    url: '/api/blade-desk/process/overtime/start-process',
    method: 'post',
    data
  })
}

export const overtimeDetail = (businessId) => {
  return request({
    url: '/api/blade-desk/process/overtime/detail',
    method: 'get',
    params: {
      businessId
    }
  })
}

