import request from '../utils/request';

/*// 组织查询
export async function queryCompany(params) {
  return request('/api/company/getCompanyInfosByCondition', {
    method: 'POST',
    body: params,
  });
}*/
// 报告新增
export async function addReport(params) {
  return request('/api/report/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 生成报告号
export async function generateReportNum(params) {
  return request('/api/report/getReportCode', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


