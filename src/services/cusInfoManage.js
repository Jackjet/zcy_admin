import request from '../utils/request';

// 客户查询
export async function queryCusInfoManage(params) {
  return request('/cusInfoManage/getCusInfoManageByCondition', {
    method: 'POST',
    body: params,
  });
}

// 客户新增
export async function addCusInfoManage(params) {
  return request('/cusInfoManage/saveCusInfoManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 客户修改
export async function updateCusInfoManage(params) {
  return request('/cusInfoManage/updateCusInfoManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 客户删除
export async function deleteCusInfoManage(params) {
  return request('/cusInfoManage/deleteCusInfoManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 客户状态启动
export async function statusCancelCancel(params) {
  return request('/cusInfoManage/statusCancelCancel', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


