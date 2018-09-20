import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';
import ProjectsRepository from "../routes/KnowledgeBase/ProjectsRepository";

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

/* 路由记录
 * src/common/router.js
 */
export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/workplace': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/index/Workplace')),
    },
    '/crm/customer': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/crm/list/CustomerList')),
    },
    '/crm/customerApply': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/crm/list/CustomerApplyList')),
    },
    '/crm/business': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/crm/list/BusinessOpportunity')
      ),
    },
    '/crm/visit': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/crm/list/VisitList')),
    },
    '/system/dictType': {
      component: dynamicWrapper(app, [], () => import('../routes/SystemManage/list/DictType')),
      name: '数据字典类型管理',
    },
    '/system/dictManage': {
      component: dynamicWrapper(app, [], () => import('../routes/SystemManage/list/DictManage')),
      name: '数据字典管理',
    },
    '/projectAllow/projectAllocation': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/projectAllow/list/AllocationList')),
      name: '项目指派',
    },
    '/project/projectinfo': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/project/list/projectList')),
      name: '项目信息管理',
    },
    '/contractManager/Contractinfo': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/project/list/ContractList')),
      name: '合同管理',
    },
    '/contractManager/xieyiInfo': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/project/list/ContractList')),
      name: '协议管理',
    },
    '/project/workPlanManage/workPlan': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/project/list/ContractList')),
      name: '项目计划',
    },
    '/project/workPlanManage/workDiary': {
      component: dynamicWrapper(app, [], () => import('../routes/project/list/WorkDiary')),
      name: '工作日记',
    },
    '/schedule/workStatement': {
      component: dynamicWrapper(app, [], () => import('../routes/schedule/WorkStatement')),
      name: '工作报告',
    },
    '/project/workRecord': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/project/list/WorkRecord')),
      name: '项目工作记录',
    },
    '/fi/fiInvoice/businessCirculation': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Finance/list/Circulation')),
      name: '业务流转',
    },
    '/fi/fiInvoice/receivablesMessage': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Finance/list/DetailedInfo')),
      name: '收款管理',
    },
    '/fi/fiInvoice/invoiceApply': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Finance/list/InvoiceApplyList')),
      name: '开票申请',
    },
    '/fi/fiInvoice/invoiceManage': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Finance/list/ReceivablesInfoList')),
      name: '发票管理',
    },
    '/fi/commission/commissionQuery': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Finance/list/CommissionQuery')),
      name: '提成查询',
    },
    '/fi/commission/commissionSetting': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Finance/list/CommissionSetting')),
      name: '提成比例设置',
    },
    '/zhiku/zskgl': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/KnowledgeBase/ProjectsRepository')),
      name: '项目知识库管理',
    },
    '/zhiku/priceIssue': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/KnowledgeBase/list/PriceIssueList')),
      name: '项目知识库管理',
    },
    '/ExpenseReimbursement/ExpenseApply': {
    component: dynamicWrapper(app, [], () => import('../routes/ExpenseReimbursement/list/ExpenseApplyList')),
      name: '费用申请单',
    },
    '/ExpenseReimbursement/ReimbursementList': {
      component: dynamicWrapper(app, [], () => import('../routes/ExpenseReimbursement/list/ReimbursementList')),
      name: '费用报销单',
    },
    '/dangan/dazyj': {
      component: dynamicWrapper(app, [], () => import('../routes/ArchivesManage/list/ArchivesWarehousing')),
      name: '档案入库',
    },
    '/dangan/dajym': {
      component: dynamicWrapper(app, [], () => import('../routes/ArchivesManage/list/BorrowingManage')),
      name: '档案借阅',
      },
    '/dangan/ghdj': {
      component: dynamicWrapper(app, [], () => import('../routes/ArchivesManage/list/RevertManage')),
      name: '归还登记',
    },
    '/dangan/danbqkuj': {
      component: dynamicWrapper(app, [], () => import('../routes/ArchivesManage/list/ArchivesTabsBase')),
      name: '档案标签库架',
    },
    '/schedule/schedulelist': {
      component: dynamicWrapper(app, [], () => import('../routes/schedule/calendarAll')),
    },
    '/schedule/notice': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/notice/NoticeList')),
    },
    '/HR/organize': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/org/list/OrgUnitList')),
    },
    '/HR/department': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/department/list/DepartmentList')),
    },
    '/HR/staff': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/staff/list/UserList')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/reset': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/ResetPassword')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/modify': {
      component: dynamicWrapper(app, [], () => import('../routes/User/ModifyPassword')),
    },
    '/user/reset-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/ResetResult')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/test': {
      component: dynamicWrapper(app, [], () => import('../routes/Test/UploadDemo')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },

    '/system/authorization/Obj': {
      component: dynamicWrapper(app, [], () => import('../routes/Authorization/Obj/ObjManageList')),
      name:"权限对象",
    },
    '/system/authorization/Role': {
      component: dynamicWrapper(app, [], () => import('../routes/Authorization/Role/RoleManageList')),
      name:"角色管理",
    },

  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
