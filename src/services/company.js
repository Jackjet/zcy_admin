import request from '../utils/request';

// 组织查询
export async function queryCompany(params) {
  return request('/api/company/getCompanyByCondition', {
    method: 'POST',
    body: params,
  });
}
// 组织树形
export async function getLeftTreeMenu() {
  return request('/api/company/getLeftTreeMenu', {
    method: 'POST',
  });
}

export async function getInfoById(params) {
  return request('/api/company/getCompanyById', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 组织更新
export async function updateCompany(params) {
  return request('/api/company/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 组织新建
export async function addCompany(params) {
  return request('/api/company/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 组织删除
export async function removeCompanyById(params) {
  return request('/api/company/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 组织批量删除
export async function removeCompanyByCondition(params) {
  return request('/api/company/deleteCompanyByList', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 组织状态启动
export async function statusCancelCancel(params) {
  return request('/api/company/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 组织状态禁用
export async function statusCancel(params) {
  return request('/api/company/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

