import { isUrl } from '../utils/utils';
import ProManageWorkplace from "../routes/index/ProManageWorkplace";
import LogisticsWorkplace from "../routes/index/LogisticsWorkplace";

const menuData = [
  {
    name: '工作台',
    icon: 'desktop',
    path: 'workplace',
    children: [],
  },
  {
    name: '合伙人工作台',
    icon: 'desktop',
    path: 'PartnerWorkplace',
    children: [],
  },
  {
    name: '员工工作台',
    icon: 'desktop',
    path: 'WorkplacePerson',
    children: [],
  },
  {
    name: '项目经理工作台',
    icon: 'desktop',
    path: 'ProManageWorkplace',
    children: [],
  },
  {
    name: '部门经理工作台',
    icon: 'desktop',
    path: 'DeptWorkplace',
    children: [],
  },
  {
    name: '后勤工作台',
    icon: 'desktop',
    path: 'LogisticsWorkplace',
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
        key: 'contractInfoList',
        name: '合同管理',
        path: 'ContractInfo',
      },
      {
        key: 'xieyiList',
        name: '协议管理',
        path: 'xieyiInfo',
      },
     ],
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
      {
        key: 'projectAssign',
        name: '跨部门跨公司指派单 ',
        path: 'projectAssign',
      },
    ],
  },
  {
    name: '项目管理',
    icon: 'folder-add',
    path: 'project',
    children: [
      /*{
        key: 'projectStart',
        name: '项目启动',
        path: 'projectStart',
      },*/
      {
        key: 'projectInfoMange',
        name: '项目信息管理',
        path: 'projectInfoMange',
      },
      /*{
        key: 'signatureInfoManage',
        name: '签章信息管理',
        path: 'signatureInfoManage',
      },*/
      /* {
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
      },*/
      /* {
        key: 'workrocord',
        name: '项目工作记录',
        path: 'workplan1',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },*/
      /* {
        key: 'projectDestroy',
        name: '项目销毁',
        path: 'projectDestroy',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },*/
    ],
  },
  /*{
    name: '项目管理备份',
    icon: 'folder-add',
    path: 'projectBAK',
    children: [
      {
        key: 'projectStartBAK',
        name: '项目启动',
        path: 'projectStartBAK',
      },
      {
        key: 'projectInfoManageBAK',
        name: '项目信息管理',
        path: 'projectInfoManageBAK',
      },
      /!*{
        key: 'signatureInfoManage',
        name: '签章信息管理',
        path: 'signatureInfoManage',
      },*!/
      /!* {
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
       },*!/
      /!* {
         key: 'workrocord',
         name: '项目工作记录',
         path: 'workplan1',
         // hideInBreadcrumb: true,
         // hideInMenu: true,
       },*!/
      /!* {
         key: 'projectDestroy',
         name: '项目销毁',
         path: 'projectDestroy',
         // hideInBreadcrumb: true,
         // hideInMenu: true,
       },*!/
    ],
  },*/
  {
    name: '考评管理',
    icon: 'folder-add',
    path: 'PerformTarget',
    children: [
      {
        key: 'PerformTargetTypeList',
        name: '指标库',
        path: 'TypeList',
      },
      {
        key: 'projectPerformTarget',
        name: '项目考评',
        path: 'projectPerformTarget',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        key: 'YearPerformTarget',
        name: '年度考评',
        path: 'YearPerformTarget',
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
        key: 'organizeList',
        name: '组织机构',
        path: 'organize',
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
      {
        key: 'workStatement',
        name: '工作报告',
        path: 'workStatement',
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
        path: 'priceIssue',
      },
      {
        key: 'cljgku',
        name: '合同模版',
        path: 'ContractTemplate',
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
      {
        key: 'ArchivesDestroy',
        name: '销毁档案',
        path: 'ArchivesDestroy',
      },
    ],
  },
  {
    name: '合伙人管理',
    icon: 'usergroup-add',
    path: 'Partnermanager',
    children: [
      {
        key: 'PartnerType',
        name: '合伙人类别',
        path: 'PartnerType',
      },
      {
        key: 'PartnerScope',
        name: '分管合伙人范围查询',
        path: 'PartnerScope',
      },
      {
        key: 'hehuorenseting2',
        name: '报表查询',
        path: 'hehuorsetting2',
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
      {
        key: 'partnertotal',
        name: '合伙人项目统计',
        path: 'partnertotal',

      },
      {
        key: 'moveintotal',
        name: '调入项目统计，别的合伙人团队给我做的项目统计',
        path: 'moveintotal',

      },
      {
        key: 'moveouttotal',
        name: '调出项目统计，我帮别的合伙人团队做的项目统计',
        path: 'moveouttotal',

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
        key: 'CodeRule',
        name: '编码规则',
        path: 'CodeRule',
      },
      {
        key: 'billTable',
        name: '业务用表',
        path: 'billTable',
      },

      {
        key: 'userList',
        name: '用户管理',
        path: 'userManage',
      },

      {
        key: 'authorization',
        name: '权限管理',
        path: 'authorization',
        children: [
          {
            key: 'Obj',
            name: '权限对象',
            path: 'Obj',
          },
          {
            key: 'Role',
            name: '角色管理',
            path: 'Role',
          },

        ],
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
