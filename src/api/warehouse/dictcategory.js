import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/dictCategory/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getParentList = (current, size, params) => {
  return request({
    url: '/api/blade-system/dictCategory/parent-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getChildList = (current, size, parentId, params) => {
  return request({
    url: '/api/blade-system/dictCategory/child-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      parentId: parentId,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/dictCategory/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/dictCategory/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/dictCategory/submit',
    method: 'post',
    data: row
  })
}


export const getDict = (id) => {
  return request({
    url: '/api/blade-system/dictCategory/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
export const getDictTree = () => {
  return request({
    url: '/api/blade-system/dictCategory/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request({
    url: '/api/blade-system/dictCategory/dictionary',
    method: 'get',
    params,
  })
}

export const getDictionaryByParentId = (parentId) => {
  return request({
    url: '/api/blade-system/dictCategory/dictionaryByParentId',
    method: 'get',
    data: parentId
  })
}
