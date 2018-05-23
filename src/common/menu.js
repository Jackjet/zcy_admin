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
    path: 'zhiku',
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
