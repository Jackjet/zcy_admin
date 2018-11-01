import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function fakeReset(params) {
  return request('/api/reset', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

// 组织查询
export async function queryCompany(params) {
  return request('/company/getCompanyInfosByCondition', {
    method: 'POST',
    body: params,
  });
}

// 组织更新
export async function updateCompany(params) {
  return request('/company/updateCompany', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 组织新建
export async function addCompany(params) {
  return request('/company/saveCompany', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 组织删除
export async function removeCompanyById(params) {
  return request('/company/deleteCompanyById', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 组织批量删除
export async function removeCompanyByCondition(params) {
  return request('/company/deleteCompanyByList', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 组织状态启动
export async function statusCancelCancel(params) {
  return request('/company/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 组织状态禁用
export async function statusCancel(params) {
  return request('/company/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}





