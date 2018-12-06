import request from '../utils/request';

// 项目查询
export async function queryProInfo(params) {
  return request('/api/project/getProjectByCondition', {
    method: 'POST',
    body: params,
  });
}

// 项目更新
export async function updateProInfo(params) {
  return request('/api/user/updateUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 项目新建
export async function addProInfo(params) {
  return request('/api/project/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 项目删除
export async function removeProInfoById(params) {
  return request('/api/user/updateUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 项目批量删除
export async function removeProInfoByCondition(params) {
  return request('/api/user/deletePersonByList', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 项目状态启用
export async function statusCancelCancel(params) {
  return request('/api/user/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 项目状态禁用
export async function statusCancel(params) {
  return request('/api/user/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 树形
export async function getDictByCondition(params) {
  return request('/api/dict/getDictByCondition', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
