import React, { PureComponent } from 'react';
import { Tabs, Icon, Form, Modal, message } from 'antd';
import { connect } from 'dva';
import CustomerCheck from '../../crm/select/CustomerCheck.js';
import ContractView from '../../project/select/ContractView.js';
import VisitListCheck from '../../crm/select/VisitListCheck.js';
import ContactsView from '../../crm/select/ContactsView.js';
import Salesman from '../../crm/select/Salesman.js';
import ProjectView from '../../crm/select/ProjectView.js';


class CustomerViewTabs extends PureComponent {
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
    const { form, dispatch, submitting, tabsViewVisible, handleTabsViewVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
          this.setState({
            tabsViewVisible: false,
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    return (
      <Modal
        title="查看"
        style={{ top: 60 }}
        visible={tabsViewVisible}
        width="80%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleTabsViewVisible()}
        footer={null}
      >
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
            <ProjectView />
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
      </Modal>

    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(CustomerViewTabs));
