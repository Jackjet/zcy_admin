import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '工作台',
    icon: 'desktop',
    path: 'workplace',
    children: [],
  },
  {
    name: 'CRM管理',
    icon: 'team',
    path: 'crm',
    children: [
      {
        key: 'customerApply',
        name: '客户申请单',
        path: 'customerApply',
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
        path: 'visit',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '合同(协议)管理',
    icon: 'folder',
    path: 'contractManager',
    children: [
      {
        key: 'contractinfoList',
        name: '合同管理',
        path: 'Contractinfo',
      },
      {
        key: 'xieyiList',
        name: '协议管理',
        path: 'xieyiInfo',
      },
     ],
        // hideInBreadcrumb: true,
        // hideInMenu: true,
   },
  {
    name: '项目指派',
    icon: 'folder-open',
    path: 'projectAllow',
    children: [
      {
        key: 'projectInfoAllow',
        name: '项目指派',
        path: 'projectAllocation',
      },
    ],
  },
  {
    name: '项目管理',
    icon: 'folder-add',
    path: 'project',
    children: [
      {
        key: 'projectinfoList',
        name: '项目信息管理',
        path: 'projectinfo',
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
        name: '应收款管理',
        path: 'fiInvoice',
        children: [
          {
            key: 'invoiceManage',
            name: '开票申请',
            path: 'invoiceApply',
          },
          {
            key: 'invoiceManage',
            name: '发票管理',
            path: 'invoiceManage',
          },
          {
            key: 'receivablesMessage',
            name: '收款管理',
            path: 'receivablesMessage',
          },
        ],
      },
      {
        name: '应付款管理',
        path: 'fiInvoiceMange',
        children: [
          {
            key: 'invoiceManage',
            name: '发票管理',
            path: 'invoiceManage',
          },
          {
            key: 'receivablesMessage',
            name: '付款管理',
            path: 'receivablesMessage',
          },
        ],
      },
      {
        name: '提成管理',
        path: 'commission',
        children: [
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
    name: '费用报销',
    icon: 'pay-circle-o',
    path: 'ExpenseReimbursement',
    children: [
      {
        key: 'ExpenseApply',
        name: '费用申请单',
        path: 'ExpenseApply',
      },
      {
        key: 'ReimbursementList',
        name: '费用报销单',
        path: 'ReimbursementList',
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
    icon: 'calendar',
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
    icon: 'zhihu',
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
      {
        key: 'cljgku',
        name: '价格格库',
        path: 'priceissue',
      },

    ],
  },
  {
    name: '档案管理',
    icon: 'book',
    path: 'dangan',
    children: [
      {
        key: 'danganyij',
        name: '档案入库',
        path: 'dazyj',
      },
      {
        key: 'danganjyue',
        name: '档案借阅',
        path: 'dajym',
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
    icon: 'usergroup-add',
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
    name: '分析平台',
    icon: 'dashboard',
    path: 'report',
    children: [
      {
        key: 'reportlist',
        name: '报表分析',
        path: 'reportInfo',
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
