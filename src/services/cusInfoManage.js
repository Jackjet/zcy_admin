import request from '../utils/request';

// 客户查询
export async function queryCustomerInfo(params) {
  return request('/api/customerInfo/getCustomerInfoByCondition', {
    method: 'POST',
    body: params,
  });
}

// 客户新增
export async function addCustomerInfo(params) {
  return request('/api/customerInfo/saveCustomerInfo', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 客户修改
export async function updateCustomerInfo(params) {
  return request('/api/customerInfo/updateCustomerInfo', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 客户删除
export async function deleteCustomerInfo(params) {
  return request('/api/customerInfo/deleteCustomerInfo', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 客户状态启动
export async function statusCancelCancel(params) {
  return request('/api/customerInfo/statusCancelCancel', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


