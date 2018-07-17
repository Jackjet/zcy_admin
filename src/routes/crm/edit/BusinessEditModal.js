import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  // TimePicker,
  Input,
  InputNumber,
  Select,
  Popover,
  Cascader,
  Modal,
  Transfer,
  Menu,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { SubMenu, MenuItemGroup } = Menu;
const { TextArea } = Input;
const { Option } = Select;

const mockData = [];
for (let i = 0; i < 10; i++) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
};
const fieldLabels = {
  number: '编码',
  businessName: '商机名称',
  customerName: '客户名称',
  customerContact: '客户联系人',
  mobilePhone: '联系电话',
  businessState: '商机状态',
  customerDemand: '客户需求',
  remarks: '备注',
  platform:'商机平台',
  submissionPerson:'商机提供人',
  executor:'执行人',
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
const formItemLayout2 = {
  style:{
    paddingRight: 135,
    width: '130%',
  },
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
    xl: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 },
    xl: { span: 20 },
  },
};
const formItemLayoutTextArea = {
  style:{
    paddingRight: 150,
    width: '110%',
  },
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

class BusinessEditModal extends PureComponent {
  state = {
    width: '100%',
    targetKeys:[],
    selectedKeys: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleClick = (e) => {
    console.log('click ', e);
  }

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { form, dispatch, submitting, handleBusinessEditVisible, businessEditVisible, rowInfo } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedKeys } = this.state;
    const okHandle = () => handleBusinessEditVisible();
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          handleBusinessEditVisible(false);
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
        title="编辑"
        style={{ top: 60 }}
        visible={businessEditVisible}
        width="55%"
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleBusinessEditVisible()}
        footer={
          (null,
            (
              <Button onClick={okHandle} type="primary">
                知道了
              </Button>
            ))
        }
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.number}>
                    {getFieldDecorator('number', {
                      rules: [{ required: true, message: '请输入编码' }],
                    })(<Input placeholder="不重复的数字" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.businessName}>
                    {getFieldDecorator('businessName', {
                      rules: [{ required: true, message: '请输入商机名称' }],
                    })(<Input placeholder="商机描述" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.businessState}>
                    {getFieldDecorator('businessState', {
                      rules: [{ required: true, message: '请选择商机状态' }],
                    })(
                      <Select placeholder="请选择商机状态" style={{ width: 150 }}>
                        <Option value="1">提交审核</Option>
                        <Option value="2">跟进中</Option>
                        <Option value="3">成功</Option>
                        <Option value="4">失败</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.customerName}>
                    {getFieldDecorator('customerName', {
                      rules: [{ required: false, message: '请输入客户名称' }],
                    })(<Input placeholder="请输入客户名称" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.mobilePhone}>
                    {getFieldDecorator('mobilePhone', {
                      rules: [{ required: false, message: '请输入联系电话' }],
                    })(<Input placeholder="请输入联系电话" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.platform}>
                    {getFieldDecorator('platform', {
                      rules: [{ required: false, message: '请选择商机平台' }],
                    })(
                      <Select placeholder="请选择商机平台" style={{ width: 150 }}>
                        <Option value="0">AA平台</Option>
                        <Option value="1">BB平台</Option>
                        <Option value="2">CCAA平台</Option>
                        <Option value="3">DD平台</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.submissionPerson}>
                    {getFieldDecorator('submissionPerson', {
                    })(
                      <Input placeholder="商机提供人" style={{ width: 150 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={8}>
                  <Form.Item>
                    {getFieldDecorator('personal', {
                    })(
                      <div>
                        <Transfer
                          dataSource={mockData}
                          titles={['备选人员', '已选人员']}
                          targetKeys={this.state.targetKeys}
                          selectedKeys={selectedKeys}
                          onChange={this.handleChange}
                          onSelectChange={this.handleSelectChange}
                          render={item => item.title}
                        />
                      </div>

                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayoutTextArea} label={fieldLabels.customerDemand}>
                    {getFieldDecorator('customerDemand', {
                      rules: [{ required: true, message: '请输入客户需求' }],
                    })(
                      <TextArea placeholder="请输入客户需求" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayoutTextArea} label={fieldLabels.remarks}>
                    {getFieldDecorator('remarks', {
                      rules: [{ required: false, message: '请输入备注' }],
                    })(
                      <TextArea placeholder="请输入备注" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(BusinessEditModal));
