import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import logo1 from '../assets/zclogo.png';
import { getRoutes } from '../utils/utils';

const links = [
  {
    key: 'help',
    title: '技术支持：杭州至诚云软件技术有限公司',
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 杭州至诚云软件技术有限公司版权所有
  </Fragment>
);

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '项目管理平台';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 项目管理平台`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.head}>
                <Link to="/">
                  <img alt="logo" className={styles.title} src={logo1} />
                  {/*<span className={styles.title}>浙江至诚会计师事务所</span>*/}
                  <h3>项目管理平台</h3>
                </Link>
              </div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <div className={styles['login-footer']}>
            <GlobalFooter links={links} copyright={copyright} />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
