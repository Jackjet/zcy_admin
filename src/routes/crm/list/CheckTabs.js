import React, { PureComponent } from 'react';
import { Tabs, Icon, Form } from 'antd';
import { connect } from 'dva';

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
    const TabPane = Tabs.TabPane;
    return (
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={<span><Icon type="team" />客户</span>
        }
          key="1"
        >
          Tab 1
        </TabPane>
        <TabPane
          tab={
            <span><Icon type="api" />项目</span>
        }
          key="2"
        >
          Tab 2
        </TabPane>
        <TabPane
          tab={
            <span><Icon type="switcher" />合同</span>
        }
          key="3"
        >
          Tab 1
        </TabPane>
        <TabPane
          tab={
            <span><Icon type="line-chart" />商机</span>
        }
          key="4"
        >
          Tab 1
        </TabPane>
        <TabPane
          tab={
            <span><Icon type="eye" />拜访</span>
        }
          key="5"
        >
          Tab 1
        </TabPane>
      </Tabs>
    );
  };
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(CheckTabs));
