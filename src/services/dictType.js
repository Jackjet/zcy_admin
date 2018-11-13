import request from '../utils/request';

// 查询所有 数据字典类型
export async function queryDictType(params) {
  return request('/api/dictType/getAllDictTypes', {
    method: 'POST',
    body: params,
  });
}


// 数据字典类型更新
export async function updateDictType(params) {
  return request('/api/dictType/updateDictType', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 数据字典类型新建
export async function addDictType(params) {
  return request('/api/dictType/addDictType', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 数据字典类型删除
export async function removeDictTypeById(params) {
  return request('/api/dictType/deleteDictType', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}




