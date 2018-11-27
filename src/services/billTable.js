import request from '../utils/request';

// 查询所有 业务用表
export async function queryBillTable(params) {
  return request('/api/billTable/getBillTableByCondition', {
    method: 'POST',
    body: params,
  });
}

// 业务用表更新
export async function updateBillTable(params) {
  return request('/api/billTable/updateBillTable', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },

  });
}

// 业务用表新建
export async function addBillTable(params) {
  return request('/api/billTable/addBillTable', {
    method: 'POST',
    body: params,
    //headers:{"Content-Type": "multipart/form-data"}
});
}


// 业务用表删除
export async function deleteBillTable(params) {
  return request('/api/billTable/deleteBillTable', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 所有树菜单数据字典类型
export async function getDictTreeByTypeId(params) {
  return request('/api/dict/getDictTreeByTypeId', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}






