import request from '../utils/request';

// 合伙人指派查询
export async function queryProPartnerRelation(params) {
  return request('/proPartnerRelation/getProPartnerRelationByCondition', {
    method: 'POST',
    body: params,
  });
}

// 合伙人指派新增
export async function addProPartnerRelation(params) {
  return request('/proPartnerRelation/saveProPartnerRelation', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 合伙人指派修改
export async function updateProPartnerRelation(params) {
  return request('/proPartnerRelation/updateProPartnerRelation', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 合伙人指派删除
export async function deleteProPartnerRelation(params) {
  return request('/proPartnerRelation/deleteProPartnerRelation', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


