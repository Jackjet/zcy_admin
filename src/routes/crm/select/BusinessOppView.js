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
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;
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

class BusinessOppView extends PureComponent {
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
    const { form, dispatch, submitting, handleBusinessViewVisible, businessViewVisible, rowInfo } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const okHandle = () => handleBusinessViewVisible();
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
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
        visible={businessViewVisible}
        width="55%"
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleBusinessViewVisible()}
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
                        <Option value="0">杭州工程平台</Option>
                        <Option value="1">义务工程平台</Option>
                        <Option value="2">杭州审计平台</Option>
                        <Option value="3">义务审计平台</Option>
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
                        <Option value="0">杭州工程平台</Option>
                        <Option value="1">义务工程平台</Option>
                        <Option value="2">杭州审计平台</Option>
                        <Option value="3">义务审计平台</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.executor}>
                    {getFieldDecorator('executor', {
                    })(
                      <Input placeholder="执行人" style={{ width: 150 }} />
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
}))(Form.create()(BusinessOppView));
