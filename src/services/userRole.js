import request from '../utils/request';

// 新建
export async function addUserRole(params) {
  return request('/api/userRole/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 删除
export async function removeUserRole(params) {
  return request('/api/userRole/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 更新
export async function updateUserRole(params) {
  return request('/api/userRole/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 查询
export async function queryUserRole(params) {
  return request('/api/userRole/getUserRoleByCondition', {
    method: 'POST',
    body: params,
  });
}

// 查询By ID
export async function getUserRoleById(params) {
  return request('/api/role/getRoleById', {
    method: 'POST',
    body: params,
  });
}


