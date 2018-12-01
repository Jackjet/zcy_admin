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

export const getProMenuData = () => formatter(menuData);
