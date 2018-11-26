import request from '../utils/request';

// 人员查询
export async function queryPerson(params) {
  return request('/api/company/getCompanyInfosByCondition', {
    method: 'POST',
    body: params,
  });
}

// 人员更新
export async function updatePerson(params) {
  return request('/api/user/updateUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 人员新建
export async function addPerson(params) {
  return request('/api/user/saveUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 人员删除
export async function removePersonById(params) {
  return request('/api/user/updateUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 人员批量删除
export async function removePersonByCondition(params) {
  return request('/api/user/deletePersonByList', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 人员状态启用
export async function statusCancelCancel(params) {
  return request('/api/user/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 人员状态禁用
export async function statusCancel(params) {
  return request('/api/user/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

