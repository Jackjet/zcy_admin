import React, { PureComponent } from 'react';
import { Card, Form, Icon, Col, Row, DatePicker, Input, Select, Popover, Modal, Tabs } from 'antd';
import { connect } from 'dva';

import styles from './style.less';

const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class RoleManageViewModal extends PureComponent {
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
    const {
      form,
      dispatch,
      RoleManageViewVisible,
      handleRoleManageViewVisible,
      rowInfo,
    } = this.props;
    const { getFieldDecorator } = form;
    const validate = () => {
      handleRoleManageViewVisible(false);
    };
    const cancelDate = () => {
      handleRoleManageViewVisible(false);
    };
    return (
      <Modal
        title="查看权限"
        style={{ top: 20 }}
        visible={RoleManageViewVisible}
        width="35%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText="提交"
      >
        <Card>
          <Form layout="horizontal">
            <Row className={styles['fn-mb-15']}>
              <Col span={23} push={2}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入组织名称' }],
                  })(
                    <Tabs type="card">
                      <TabPane tab="可转授" key="1">
                        1
                      </TabPane>
                      <TabPane tab="已分配" key="2">
                        2
                      </TabPane>
                      <TabPane tab="已禁止" key="3">
                        3
                      </TabPane>
                    </Tabs>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(RoleManageViewModal));
