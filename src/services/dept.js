import request from '../utils/request';

// 部门查询
export async function queryDept(params) {
  return request('/api/dept/getDeptInfosByCondition', {
    method: 'POST',
    body: params,
  });
}

// 部门更新
export async function updateDept(params) {
  return request('/api/dept/updateDept', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 部门新建
export async function addDept(params) {
  return request('/api/dept/saveDept', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 部门删除
export async function removeDeptById(params) {
  return request('/api/dept/deleteDeptById', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 部门批量删除
export async function removeDeptByCondition(params) {
  return request('/api/dept/deleteDeptByList', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 部门状态启动
export async function statusCancelCancel(params) {
  return request('/api/dept/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}







