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
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import {message} from "antd/lib/index";

const { Option } = Select;
const CustomerOption = ['贵宾', '重要客户', '一般客户', '潜在客户'];
const fieldLabels = {
  customerCode: '客户编号',
  customerName: '客户名称',
  contactsNature: '联系人业务性质',
  status: '状态',
  mobilePhone: '移动电话',
  contacts: '联系人',
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

class CustomerApplyAddModal extends PureComponent {
  state = {
    width: '100%',
    levelOptionData: [],
    industryOptionData:[],
    incomeTaxOptionData:[],
    statusOptionData:[],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleLevelChange = () => {
    this.setState({
      levelOptionData: CustomerOption.map((data) => {
        const value = `${data}`;
        return <Option key={value}>{value}</Option>;
      }),
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
    const { form, dispatch, submitting , customerApplyAddVisible, handleCustomerApplyAddVisible} = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { levelOptionData, industryOptionData, incomeTaxOptionData, statusOptionData } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          form.resetFields();
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handleCustomerApplyAddVisible(false);
          message.success('成功申请用户');
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handleCustomerApplyAddVisible(false);
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
        title="客户申请单信息新增"
        style={{ top: 20 }}
        visible={customerApplyAddVisible}
        width="35%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label={fieldLabels.customerCode}>
                    {getFieldDecorator('customerCode', {
                      rules: [{ required: false, message: '请输入客户编码' }],
                    })(<Input readOnly placeholder="新增自动产生" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label={fieldLabels.customerName}>
                    {getFieldDecorator('customerName', {
                      rules: [{ required: false, message: '请输入客户名称' }],
                    })(
                      <Input onMouseEnter={this.handleLevelChange} placeholder="请输入客户名称" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label={fieldLabels.contactsNature}>
                    {getFieldDecorator('contactsNature', {
                      rules: [{ required: false, message: '请选择联系人业务性质' }],
                    })(
                      <Select placeholder="请选择联系人业务性质" style={{ width: 200 }} >
                        <Option key="1" >工程</Option>
                        <Option key="2" >招标</Option>
                        <Option key="3" >采购</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label={fieldLabels.status}>
                    {getFieldDecorator('status', {
                      rules: [{ required: false, message: '请选择状态' }],
                    })(
                      <Select placeholder="请选择状态" style={{ width: 200 }} >
                        <Option key="1" >启用</Option>
                        <Option key="2" >禁用</Option>
                      </Select>
                        )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label={fieldLabels.contacts}>
                    {getFieldDecorator('contacts', {
                      rules: [{ required: false, message: '请输入联系人' }],
                    })(
                      <Input placeholder="请输入联系人" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label={fieldLabels.mobilePhone}>
                    {getFieldDecorator('mobilePhone', {
                      rules: [{ required: false, message: '请输出联系电话' }],
                    })(
                      <Input placeholder="请输出联系电话" style={{ width: 200 }} />
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
}))(Form.create()(CustomerApplyAddModal));
