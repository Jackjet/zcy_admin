import React, { PureComponent } from 'react';
import { Tabs, Icon, Form } from 'antd';
import { connect } from 'dva';
import VisitListCheck from '../../crm/select/VisitListCheck.js';
import ContractInfo from '../ContractSelect/ContractInfo.js';
import ProjectListView from '../ContractSelect/ProjectListView.js';
import ReceivablesPlanList from '../Receivables/ReceivablesPlanList.js';
import ReceivablesManageList from '../Receivables/ReceivablesManageList.js';
import InvoiceManageList from '../invoice/InvoiceManageList.js';
import ProcedureList from '../procedure/ProcedureList.js';

class ContractViewTabs extends PureComponent {
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
              <Icon type="copy" />基本信息
            </span>
          }
          key="1"
        >
          <ContractInfo />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="copy" />流程图
            </span>
          }
          key="6"
        >
          <ProcedureList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="api" />所含项目
            </span>
          }
          key="2"
        >
          <ProjectListView />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="team" />收款计划
            </span>
          }
          key="3"
        >
          <ReceivablesPlanList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="switcher" />收款信息
            </span>
          }
          key="4"
        >
          <ReceivablesManageList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="line-chart" />发票信息
            </span>
          }
          key="5"
        >
          <InvoiceManageList />
        </TabPane>
      </Tabs>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ContractViewTabs));
