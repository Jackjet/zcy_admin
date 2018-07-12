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
        path: 'visit',
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
        name: '协议（合同）管理',
        path: 'contract',
      },
      {
        key: 'workplanList',
        name: '工时计划管理',
        path: 'workplan',
        children: [
          {
            key: 'workplanlist1',
            name: '项目计划',
            path: 'workplan12',
          },
          {
            key: 'pworkquery',
            name: '项目工时查询',
            path: 'workquery',
          },
        ],
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        key: 'workrocord',
        name: '项目工作记录',
        path: 'workplan1',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        key: 'kaopingp',
        name: '项目考评管理',
        path: 'workplan2',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '项目财务',
    icon: 'red-envelope',
    path: 'fi',
    children: [
      {
        name: '发票管理',
        path: 'fiInvoice',
        children: [
          {
            key: 'invoiceManage',
            name: '开票管理',
            path: 'invoiceManage',
          },
          {
            key: 'receivablesMessage',
            name: '收款信息',
            path: 'receivablesMessage',
          },
        ],
      },
      {
        name: '提成管理',
        path: 'commission',
        children: [
          {
            key: 'tijfa',
            name: '提成计发',
            path: 'tichengjf01',
          },
          {
            key: 'commissionQuery',
            name: '提成查询',
            path: 'commissionQuery',
          },
          {
            key: 'commissionSetting',
            name: '提成比例设置',
            path: 'commissionSetting',
          },
        ],
      },
    ],
  },
  {
    name: '人事管理',
    icon: 'user',
    path: 'HR',
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
        path: 'staff',
      },
    ],
  },
  {
    name: '日常管理',
    icon: 'user',
    path: 'schedule',
    children: [
      {
        key: 'owenschedule',
        name: '日程管理',
        path: 'schedulelist',
      },
      {
        key: 'noticelist',
        name: '公告管理',
        path: 'notice',
      },
    ],
  },
  {
    name: '知识库管理',
    icon: 'setting',
    path: 'zhiku',
    children: [
      {
        key: 'pzskm',
        name: '项目知识库管理',
        path: 'zskgl',
      },
      {
        key: 'zskjfm',
        name: '知识库积分管理',
        path: 'zskjfma',
      },
    ],
  },
  {
    name: '档案管理',
    icon: 'setting',
    path: 'dangan',
    children: [
      {
        key: 'danganjyue',
        name: '档案借阅管理',
        path: 'dajym',
      },
      {
        key: 'danganyij',
        name: '档案入库',
        path: 'dazyj',
      },
      {
        key: 'guihuandj',
        name: '归还登记',
        path: 'ghdj',
      },
      {
        key: 'dangankujabq',
        name: '档案标签库架',
        path: 'danbqkuj',
      },
    ],
  },

  {
    name: '合伙人管理',
    icon: 'setting',
    path: 'hehuorenmanager',
    children: [
      {
        key: 'hehuorenseting',
        name: '合伙人设置',
        path: 'hehuorsetting',
      },
      {
        key: 'fenxipingtai',
        name: '分析平台',
        path: 'fxpt',
      },
    ],
  },

  {
    name: '系统管理',
    icon: 'setting',
    path: 'system',
    children: [
      {
        key: 'dictList',
        name: '数据字典管理',
        path: 'dictManage',
      },
      {
        key: 'dicttypeList',
        name: '字典类型管理',
        path: 'dictType',
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
