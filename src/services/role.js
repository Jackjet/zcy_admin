import request from '../utils/request';

// 新建
export async function addRole(params) {
  return request('/api/role/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 删除
export async function removeRole(params) {
  return request('/api/role/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 更新
export async function updateRole(params) {
  return request('/api/role/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 查询
export async function queryRole(params) {
  return request('/api/role/getRoleByCondition', {
    method: 'POST',
    body: params,
  });
}

// 查询By ID
export async function getRoleById(params) {
  return request('/api/role/getRoleById', {
    method: 'POST',
    body: params,
  });
}




// 状态启动
export async function statusCancelCancel(params) {
  return request('/api/role/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 状态禁用
export async function statusCancel(params) {
  return request('/api/role/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

