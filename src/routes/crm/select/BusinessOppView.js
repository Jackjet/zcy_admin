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
  businessCode: '编码',
  businessName: '商机名称',
  customerForBusinessName: '客户名称',
  customerContact: '客户联系人',
  mobilePhone: '联系电话',
  businessState: '商机状态',
  customerDemand: '客户需求',
  remarks: '备注',
  platform:'商机平台',
  executor:'执行人',
  submissionPerson:'商机提供人',
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
        title="商机信息查看"
        style={{ top: 20 }}
        visible={businessViewVisible}
        width="55%"
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleBusinessViewVisible()}
        footer={
          (null,
            (
              <Button onClick={okHandle} type="primary">
                关闭
              </Button>
            ))
        }
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.businessCode}>
                    {getFieldDecorator('businessCode', {
                      rules: [{ required: true, message: '请输入编码' }],
                      initialValue:`${rowInfo.businessCode}`,
                    })(<Input readOnly placeholder="自动生成带出" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.businessName}>
                    {getFieldDecorator('businessName', {
                      rules: [{ required: true, message: '请输入商机名称' }],
                      initialValue:`${rowInfo.businessName}`,
                    })(<Input readOnly placeholder="自动生成带出" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.businessState}>
                    {getFieldDecorator('businessState', {
                      rules: [{ required: true, message: '请选择商机状态' }],
                      initialValue:`新建`,
                    })(
                      <Select disabled placeholder="请选择商机状态" style={{ width: 150 }}>
                        <Option value="1">新建</Option>
                        <Option value="2">已分配</Option>
                        <Option value="3">成功</Option>
                        <Option value="4">失败</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.customerForBusinessName}>
                    {getFieldDecorator('customerForBusinessNameName', {
                      rules: [{ required: false, message: '请输入客户名称' }],
                      initialValue:`${rowInfo.customerForBusinessName}`,
                    })(<Input readOnly placeholder="请输入客户名称" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.mobilePhone}>
                    {getFieldDecorator('mobilePhone', {
                      rules: [{ required: false, message: '请输入联系电话' }],
                      initialValue:`${rowInfo.mobilePhone}`,
                    })(<Input readOnly placeholder="请输入联系电话" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.platform}>
                    {getFieldDecorator('platform', {
                      rules: [{ required: false, message: '请选择商机平台' }],
                    })(
                      <Select readOnly placeholder="请选择商机平台" style={{ width: 150 }}>
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
                      <Input readOnly placeholder="执行人" style={{ width: 150 }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.submissionPerson}>
                    {getFieldDecorator('submissionPerson', {
                    })(
                      <Input readOnly placeholder="商机提供人" style={{ width: 150 }} />
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
                      <TextArea readOnly placeholder="请输入客户需求" />
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
                      <TextArea readOnly placeholder="请输入备注" />
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
