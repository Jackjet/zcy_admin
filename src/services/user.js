import request from '../utils/request';

//查询所有用户
export async function query(params) {
  return request('/api/users');

  return request('/api/user/getUserByCondition', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 查询当前用户
export async function queryCurrent() {
  return request('/api/currentUser');
}

// 用户更新
export async function updateUser (params) {
  return request('/api/user/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 用户新建
export async function addUser(params) {
  return request('/api/user/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 用户删除
export async function deleteUser (params) {
  return request('/api/user/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
