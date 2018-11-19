import request from '../utils/request';

// 拜访查询
export async function queryVisit(params) {
  return request('/dept/getDeptInfosByCondition', {
    method: 'POST',
    body: params,
  });
}

// 拜访更新
export async function updateVisit(params) {
  return request('/dept/updateDept', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 拜访新建
export async function addVisit(params) {
  return request('/dept/saveDept', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 拜访删除
export async function removeVisitById(params) {
  return request('/dept/deleteDeptById', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 拜访批量删除
export async function removeVisitByCondition(params) {
  return request('/dept/deleteDeptByList', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 拜访状态启动
export async function statusCancelCancel(params) {
  return request('/dept/cancelCancelStatus', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}







