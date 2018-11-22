import request from '../utils/request';

// 查询所有 业务用表
export async function queryBillTable(params) {
  return request('/api/billTable/getBillTableByCondition', {
    method: 'POST',
    body: params,
  });
}


// 业务用表更新
export async function updateDict(params) {
  return request('/api/dict/updateDict', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 业务用表新建
export async function addNewDict(params) {
  return request('/api/dict/addNewDict', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 业务用表删除
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
export async function getDictTreeByTypeId(params) {
  return request('/api/dict/getDictTreeByTypeId', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}






