import request from '../utils/request';

// 新建
export async function addUserPerm(params) {
  return request('/api/userPerm/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 删除
export async function removeUserPerm(params) {
  return request('/api/userPerm/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 更新
export async function updateUserPerm(params) {
  return request('/api/userPerm/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 查询
export async function queryUserPerm(params) {
  return request('/api/userPerm/getUserPermByCondition', {
    method: 'POST',
    body: params,
  });
}




