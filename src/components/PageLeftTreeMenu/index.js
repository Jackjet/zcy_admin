import React from 'react';
import { Menu } from 'antd';

const renderMenuItem = item => ( // item.route 菜单单独跳转的路由
  <Menu.Item
    key={item.key}
  >
    <div>
{/*
      {item.icon && <Icon type={item.icon} />}
*/}
      <span className="nav-text">{item.title}</span>
    </div>
  </Menu.Item>
);

const renderSubMenu = item => (
  <Menu.SubMenu
    key={item.key}
    title={
      <span>
{/*
        {item.icon && <Icon type={item.icon} />}
*/}
        <span className="nav-text">{item.title}</span>
      </span>
        }
  >
    {item.children.map(item => renderMenuItem(item))}
  </Menu.SubMenu>
);

export default ({ menus, ...props }) => (
  <Menu {...props}>
    {menus && menus.map(item =>
      item.children ? renderSubMenu(item) : renderMenuItem(item)
    )}
  </Menu>
);
