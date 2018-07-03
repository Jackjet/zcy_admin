import React, { PureComponent } from 'react';
import { Tabs, Icon, Form } from 'antd';
import { connect } from 'dva';
import ProjectInfo from '../select/ProjectInfo.js';
import ProjectPlanList from '../../project/ProjecetPlan/ProjectPlanList.js';
import WorkDiaryView from '../select/WorkDiaryView.js';
import ContractForProject from '../select/ContractForProject.js';
import ReportList from '../list/ReportList.js';
import ProcedureList from '../procedure/ProcedureList.js';
import ProjectMemberList from '../projectMember/ProjectMemberList.js';

class ProjectCheckTabs extends PureComponent {
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
          <ProjectInfo />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="api" />流程图
            </span>
          }
          key="2"
        >
          <ProcedureList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="team" />项目组员
            </span>
          }
          key="3"
        >
          <ProjectMemberList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="switcher" />所属合同
            </span>
          }
          key="4"
        >
          <ContractForProject />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="line-chart" />计划
            </span>
          }
          key="5"
        >
          <ProjectPlanList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="calendar" />项目日记
            </span>
          }
          key="6"
        >
          <WorkDiaryView />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="exception" />报告
            </span>
          }
          key="7"
        >
          <ReportList />
        </TabPane>
      </Tabs>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ProjectCheckTabs));
