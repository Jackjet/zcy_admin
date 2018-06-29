import React, { PureComponent } from 'react';
import { Tabs, Icon, Form } from 'antd';
import { connect } from 'dva';
import CustomerCheck from '../../crm/select/CustomerCheck.js';
import ContractView from '../../project/select/ContractView.js';
import VisitListCheck from '../../crm/select/VisitListCheck.js';
import ContactsView from '../../crm/select/ContactsView.js';
import Salesman from '../../crm/select/Salesman.js';
import ProjectListView from '../../project/ContractSelect/ProjectListView.js';

class CheckTabs extends PureComponent {
  state = {
    width: '100%',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { TabPane } = Tabs;
    return (
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <Icon type="team" />基本信息
            </span>
          }
          key="1"
        >
          <CustomerCheck />
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <Icon type="api" />客户联系人
                </span>
              }
              key="1"
            >
              <ContactsView />
            </TabPane>
          </Tabs>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="api" />所属业务员
            </span>
          }
          key="2"
        >
          <Salesman />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="switcher" />所属项目
            </span>
          }
          key="3"
        >
          <ProjectListView />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="line-chart" />所属合同
            </span>
          }
          key="4"
        >
          <ContractView />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="eye" />客户拜访信息
            </span>
          }
          key="5"
        >
          <VisitListCheck />
        </TabPane>
      </Tabs>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(CheckTabs));
