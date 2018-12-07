import request from '../utils/request';

// 查询
export async function queryRolePerm(params) {
  return request('/api/rolePerm/getRolePermByCondition', {
    method: 'POST',
    body: params,
  });
}

// 更新
export async function updateRolePerm(params) {
  return request('/api/rolePerm/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 新建
export async function addRolePerm(params) {
  return request('/api/rolePerm/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

