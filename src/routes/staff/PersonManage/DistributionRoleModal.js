import React, { PureComponent } from 'react';
import {
  Form,
  Icon,
  Col,
  Row,
  Input,
  Select,
  Popover,
  Modal,
  Card,
  message,
  Transfer,
  Button,
} from 'antd';
import { connect } from 'dva';
import AuthorityView from './AuthorityView';
import styles from './style.less';

const mockData = [];
for (let i = 0; i < 20; i+=1) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
  });
}

const oriTargetKeys = mockData
  .filter(item => +item.key % 3 > 1)
  .map(item => item.key);
const { Search } = Input;
const { Option } = Select;
const fieldLabels = {
  cusApplyCode: '客户编号',
  cusApplyName: '客户名称',
  cusApplyNature: '联系人业务性质',
  cusApplyStatus: '状态',
  cusApplyMobilePhone: '移动电话',
  cusApplyContacts: '联系人',
};
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

class DistributionRoleModal extends PureComponent {
  state = {
    width: '100%',
    targetKeys: oriTargetKeys,
    selectedKeys: [],
    AuthorityViewVisible: false,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  handleChange = (nextTargetKeys, direction) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleAuthorityViewVisible = flag => {
    this.setState({
      AuthorityViewVisible: !!flag,
    });
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { form, dispatch, submitting , DistributionRoleVisible, handleDistributionRoleVisible} = this.props;
    const { targetKeys, selectedKeys, AuthorityViewVisible } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handleDistributionRoleVisible(false);
          form.resetFields();
          message.success('成功申请用户');
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handleDistributionRoleVisible(false);
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
    const parentMethods = {
      handleAuthorityViewVisible: this.handleAuthorityViewVisible,
    };
    return (
      <Modal
        title="分配角色"
        style={{ top: 20 }}
        visible={DistributionRoleVisible}
        width="55%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={16}>
                  <Form.Item {...formItemLayout} label="用户">
                    {getFieldDecorator('cusApplyCode', {
                      rules: [{ required: false, message: '请输入用户' }],
                    })(
                      <Input readOnly placeholder="默认当前" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button
                    type="primary"
                    onClick={() => this.handleAuthorityViewVisible(true)}
                  >
                    查看权限
                  </Button>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Transfer
                    listStyle={{
                      width: 150,
                      height: 150,
                    }}
                    dataSource={mockData}
                    titles={['可分配角色', '已分配角色']}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    onChange={this.handleChange}
                    onSelectChange={this.handleSelectChange}
                    onScroll={this.handleScroll}
                    render={item => item.title}
                  />
                </Col>
              </Row>
            </Form>
          </Card>
          <AuthorityView {...parentMethods} AuthorityViewVisible={AuthorityViewVisible} />
        </div>
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(DistributionRoleModal));
