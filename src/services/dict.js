import request from '../utils/request';

// 查询所有 数据字典
export async function queryDict(params) {
  return request('/api/dict/getDictByCondition', {
    method: 'POST',
    body: params,
  });
}


// 数据字典更新
export async function updateDict(params) {
  return request('/api/dict/updateDict', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 数据字典新建
export async function addNewDict(params) {
  return request('/api/dict/addNewDict', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 数据字典删除
export async function deleteDict(params) {
  return request('/api/dict/deleteDict', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 所有数据字典类型
export async function getAllDictType(params) {
  return request('/api/dictType/getAllDictTypes', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 所有树菜单数据字典类型
export async function getDictTypeTree(params) {
  return request('/api/dictType/getDictTypeTree', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}






