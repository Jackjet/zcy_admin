import request from '../utils/request';

// 新建
export async function addPermItem(params) {
  return request('/api/permItem/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 删除
export async function removePermItem(params) {
  return request('/api/permItem/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 更新
export async function updatePermItem(params) {
  return request('/api/permItem/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 查询
export async function queryPermItem(params) {
  return request('/api/permItem/getPermItemByCondition', {
    method: 'POST',
    body: params,
  });
}

// 查询By ID
export async function getPermItemById(params) {
  return request('/api/permItem/getRoleById', {
    method: 'POST',
    body: params,
  });
}
