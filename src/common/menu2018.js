import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '工作台',
    icon: 'dashboard',
    path: 'workplace',
    children: [],
  },
  {
    name: 'CRM管理',
    icon: 'team',
    path: 'crm',
    children: [
      {
        key: 'customerAdd',
        name: '客户新增',
        path: 'customerAdd',
      },
      {
        key: 'customerList',
        name: '客户信息管理',
        path: 'customer',
      },
      {
        key: 'businessList',
        name: '商机管理',
        path: 'business',
      },
      {
        key: 'workplaceList',
        name: '拜访管理',
        path: 'workplace',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '项目管理',
    icon: 'folder',
    path: 'project',
    children: [
      {
        key: 'projectinfoList',
        name: '项目信息管理',
        path: 'projectinfo',
      },
      {
        key: 'contractList',
        name: '合同信息管理',
        path: 'contract',
      },
      {
        key: 'workplanList',
        name: '项目工作计划',
        path: 'workplan',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '公告管理',
    icon: 'notification',
    path: 'notice',
    children: [
      {
        key: 'noticeList',
        name: '公告列表',
        path: 'noticelist',
      },
    ],
  },
  {
    name: '财务核算',
    icon: 'red-envelope',
    path: 'fi',
    children: [
      {
        key: 'invoiceList',
        name: '发票管理',
        path: 'invoice',
      },
      {
        key: 'commissionList',
        name: '提成管理',
        path: 'commission',
      },
    ],
  },
  {
    name: '人事管理',
    icon: 'user',
    path: 'person',
    children: [
      {
        key: 'orgunitList',
        name: '组织机构',
        path: 'orgunit',
      },
      {
        key: 'departmentList',
        name: '部门管理',
        path: 'department',
      },
      {
        key: 'personnelList',
        name: '人员管理',
        path: 'personnel',
      },
    ],
  },
  {
    name: '知识库管理',
    icon: 'setting',
    path: 'system',
    children: [],
  },
  {
    name: '系统管理',
    icon: 'setting',
    path: 'system',
    children: [
      {
        key: 'dictList',
        name: '数据字典管理',
        path: 'dict',
      },
      {
        key: 'dicttypeList',
        name: '字典类型管理',
        path: 'dicttype',
      },
      {
        key: 'promissionList',
        name: '权限管理',
        path: 'promission',
      },
    ],
  },

  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        key: 'analysisList',
        name: '分析页',
        path: 'analysis',
      },
      {
        key: 'monitorList',
        name: '监控页',
        path: 'monitor',
      },
      {
        key: 'workplaceList',
        name: '工作台',
        path: 'workplace',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    children: [
      {
        key: 'basic-formList',
        name: '基础表单',
        path: 'basic-form',
      },
      {
        key: 'step-formList',
        name: '分步表单',
        path: 'step-form',
      },
      {
        key: 'advanced-formList',
        name: '高级表单',
        authority: 'admin',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    children: [
      {
        key: 'table-listList',
        name: '查询表格',
        path: 'table-list',
      },
      {
        key: 'basic-listList',
        name: '标准列表',
        path: 'basic-list',
      },
      {
        key: 'card-listList',
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            key: 'articlesList',
            name: '搜索列表（文章）',
            path: 'articles',
          },
          {
            key: 'projectsList',
            name: '搜索列表（项目）',
            path: 'projects',
          },
          {
            key: 'applicationsList',
            name: '搜索列表（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        key: 'basicList',
        name: '基础详情页',
        path: 'basic',
      },
      {
        key: 'advancedList',
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin',
      },
    ],
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        key: 'successdList',
        name: '成功',
        path: 'success',
      },
      {
        key: 'failList',
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        key: '403List',
        name: '403',
        path: '403',
      },
      {
        key: '404List',
        name: '404',
        path: '404',
      },
      {
        key: '500List',
        name: '500',
        path: '500',
      },
      {
        key: 'triggerList',
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    // authority: 'guest',
    children: [
      {
        key: 'loginList',
        name: '登录',
        path: 'login',
      },
      {
        key: 'registerList',
        name: '注册',
        path: 'register',
      },
      {
        key: 'register-resultList',
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
