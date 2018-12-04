export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        path: '/workplace',
        icon: 'desktop',
        name: 'workplace',
        routes: [],
        component: './Index/Workplace',
      },
      {
        path: '/PartnerWorkplace',
        icon: 'desktop',
        name: '合伙人工作台',
        routes: [],
        component: './Index/PartnerWorkplace',
      },
      {
        path: '/WorkplacePerson',
        icon: 'desktop',
        name: '员工工作台',
        routes: [],
        component: './Index/WorkplacePerson',
      },
      {
        path: '/ProManageWorkplace',
        icon: 'desktop',
        name: '项目经理工作台',
        routes: [],
        component: './Index/ProManageWorkplace',
      },
      {
        path: '/DeptWorkplace',
        icon: 'desktop',
        name: '部门经理工作台',
        routes: [],
        component: './Index/DeptWorkplace',
      },
      {
        path: '/crm',
        icon: 'team',
        name: 'CRM',
        routes: [
          {
            path: '/crm/customerApply',
            name: 'customerApply',
            component: './Crm/CusApplyBill/CusApplyBill',
          },
          {
            path: '/crm/customer',
            name: '客户信息管理',
            component: './Crm/CusInfoManage/CusBill',
          },
          {
            path: '/crm/business',
            name: '商机管理',
            component: './Crm/OpportunityManage/OpportunityBill',
          },
          {
            path: '/crm/visit',
            name: '拜访管理',
            component: './Crm/VisitManage/VisitList',
          },

        ],
      },
      {
        path: '/contractManager',
        icon: 'folder',
        name: '合同(协议)管理',
        routes: [
          {
            path: '/contractManager/ContractInfo',
            name: '合同管理',
            component: './Contract/ContractList',
          },
          {
            path: '/contractManager/xieyiInfo',
            name: '协议管理',
            component: './Contract/ContractList',
          },
        ],
      },
      {
        path: '/projectAllow',
        icon: 'folder-open',
        name: '项目指派',
        routes: [
          {
            path: '/projectAllow/projectAllocation',
            name: '项目指派',
            component: './ProjectAssign/ProAssignList',
          },
          {
            path: '/projectAllow/projectAssign',
            name: '跨部门跨公司指派单 ',
            component: '/CooperationProject/CooperationProList',
          },
        ],
      },
      {
        path: '/project',
        icon: 'folder-add',
        name: '项目管理',
        routes: [
          {
            path: '/project/projectInfoMange',
            name: '项目信息管理',
            component: '/Project/ProInfoManage/ProjectList',
          },
        ],
      },
      {
        path: '/performTarget',
        icon: 'folder-add',
        name: '考评管理',
        routes: [
          {
            path: '/performTarget/TypeList',
            name: '指标库',
            component: './PerformTarget/TypeList',
          },
          {
            path: '/performTarget/projectPerformTarget',
            name: '项目考评',
            component: '/PerformTarget/project/ProjectEvaluationBill',
          },
          {
            path: '/performTarget/YearPerformTarget',
            name: '年度考评',
            component: '/PerformTarget/year/YearEvaluationBill',
          },
        ],
      },
      {
        path: '/fi',
        icon: 'red-envelope',
        name: '项目财务',
        routes: [
          {
            path: '/fi/fiInvoice',
            name: '应收款管理',
            routes: [
              {
                path: '/fi/fiInvoice/invoiceApply',
                name: '开票申请',
                component:'./Finance/list/InvoiceApplyList',
              },
              {
                path: '/fi/fiInvoice/invoiceManage',
                name: '发票管理',
                component:'./Finance/list/ReceivablesInfoList',
              },
              {
                path: '/fi/fiInvoice/receivablesMessage',
                name: '收款管理',
                component:'./Finance/list/DetailedInfo',
              },
            ],
          },
          {
            path: '/fi/fiInvoiceMange',
            name: '应付款管理',
            routes: [
              {
                path: '/fi/fiInvoiceMange/invoiceManage',
                name: '发票管理',
                component:'./Finance/list/ReceivablesInfoList',
              },
              {
                path: '/fi/fiInvoiceMange/receivablesMessage',
                name: '付款管理',
                component: '/Finance/list/DetailedInfo',
              },
            ],
          },
          {
            path: '/fi/commission',
            name: '提成管理',
            routes: [
              {
                path: '/fi/commission/commissionQuery',
                name: '提成查询',
                component: './Finance/list/CommissionQuery',
              },
              {
                path: '/fi/commission/commissionSetting',
                name: '提成比例设置',
                component:'./Finance/list/CommissionSetting',
              },
            ],
          },
        ],
      },
      {
        path: '/ExpenseReimbursement',
        icon: 'pay-circle-o',
        name: '费用报销',
        routes: [
          {
            path: '/ExpenseReimbursement/ExpenseApply',
            name: '费用申请单',
            component: './ExpenseReimbursement/list/ExpenseApplyList',
          },
          {
            path: '/ExpenseReimbursement/ReimbursementList',
            name: '费用报销单',
            component: './ExpenseReimbursement/list/ReimbursementList',
          },
        ],
      },
      {
        path: '/HR',
        icon: 'user',
        name: '人事管理',
        routes: [
          {
            path: '/HR/organize',
            name: '组织机构',
            component:'./Staff/OrgManage/list/OrgUnitList',
          },
          {
            path: '/HR/department',
            name: '部门管理',
            component:'./Staff/Department/DepartmentList',
          },
          {
            path: '/HR/staff',
            name: '人员管理',
            component: './Staff/PersonManage/PersonManageList',
          },
        ],
      },
      {
        path: '/schedule',
        icon: 'calendar',
        name: '日常管理',
        routes: [
          {
            path: '/schedule/schedulelist',
            name: '日程管理',
            component: './Schedule/calendarAll',
          },
          {
            path: '/schedule/notice',
            name: '公告管理',
            component: './Notice/NoticeList',
          },
          {
            path: '/schedule/workStatement',
            name: '工作报告',
            component: './Schedule/WorkStatement',
          },
        ],
      },
      {
        path: '/zhiku',
        icon: 'zhihu',
        name: '知识库管理',
        routes: [
          {
            path: '/zhiku/zskgl',
            name: '项目知识库管理',
            component:'./KnowledgeBase/ProjectsRepository',
          },
          {
            path: 'zskjfma', // 没找到
            name: '知识库积分管理',

          },
          {
            path: '/zhiku/priceIssue',
            name: '价格格库',
            component: './KnowledgeBase/price/PriceIssueList',
          },
          {
            path: '/zhiku/ContractTemplate',
            name: '合同模版',
            component: './KnowledgeBase/ContractTemplate',
          },
        ],
      },
      {
        path: '/dangan',
        icon: 'book',
        name: '档案管理',
        routes: [
          {
            path: '/dangan/dazyj',
            name: '档案入库',
            component: './ArchivesManage/list/BorrowingManage',
          },
          {
            path: '/dangan/dajym',
            name: '档案借阅',
            component: './ArchivesManage/list/BorrowingManage',
          },
          {
            path: '/dangan/ghdj',
            name: '归还登记',
            component:'./ArchivesManage/list/RevertManage',
          },
          {
            path: '/dangan/danbqkuj',
            name: '档案标签库架',
            component:'./ArchivesManage/list/ArchivesTabsBase',
          },
          {
            path: '/dangan/ArchivesDestroy',
            name: '销毁档案',
            component:'./ArchivesManage/ArchivesDestroy/ArchivesDestroy',
          },
        ],
      },
      {
        path: '/partnermanager',
        icon: 'usergroup-add',
        name: '合伙人管理',
        routes: [
          {
            path: '/partnermanager/PartnerType',
            name: '合伙人类别',
            component: './Partner/type/PartnerType',
          },
          {
            path: '/partnermanager/PartnerScope',
            name: '分管合伙人范围查询',
            component: './Partner/scope/PartnerScope',
          },
          {
            path: 'hehuorsetting2', // 没找到
            name: '报表查询',
          },
        ],
      },
      {
        path: '/report',
        icon: 'dashboard',
        name: '分析平台',
        routes: [
          {
            path: '/report/reportInfo',
            name: '报表分析',
          },
          {
            path: '/report/partnertotal',
            name: '合伙人项目统计',
          },
          {
            path: '/report/moveintotal',
            name: '调入项目统计，别的合伙人团队给我做的项目统计',
          },
          {
            path: '/report/moveouttotal',
            name: '调出项目统计，我帮别的合伙人团队做的项目统计',
          },
        ],
      },
      {
        path: '/system',
        icon: 'setting',
        name: '系统管理',
        routes: [
          {
            path: '/system/dictManage',
            name: '数据字典管理',
            component: './SystemManage/list/Dict',
          },
          {
            path: '/system/dictType',
            name: '字典类型管理',
            component: './SystemManage/list/DictType',
          },
          {
            path: '/system/CodeRule',
            name: '编码规则',
            component: './CodeRule/CodeRuleList',
          },
          {
            path: '/system/billTable',
            name: '业务用表',
            component: './BillTable/list/BillTable',
          },

          {
            path: '/system/userManage',
            name: '用户管理',
            component: './SystemManage/UserManage/UserList',
          },

          {
            path: '/system/authorization',
            name: '权限管理',
            routes: [
              {
                path: '/system/authorization/Obj',
                name: '权限对象',
                component: './Authorization/Obj/ObjManageList',
              },
              {
                path: '/system/authorization/Role',
                name: '角色管理',
                component: './Authorization/Role/RoleManageList',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },



    ],
  },
];
