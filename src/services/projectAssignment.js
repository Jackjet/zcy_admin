import request from '../utils/request';

// 项目指派查询
export async function queryProjectAssignment(params) {
  return request('/projectAssignment/getProjectAssignmentByCondition', {
    method: 'POST',
    body: params,
  });
}

// 项目指派新增
export async function addProjectAssignment(params) {
  return request('/projectAssignment/saveProjectAssignment', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 项目指派修改
export async function updateProjectAssignment(params) {
  return request('/projectAssignment/updateProjectAssignment', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 项目指派删除
export async function deleteProjectAssignment(params) {
  return request('/projectAssignment/deleteProjectAssignment', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


