import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Transfer,
  Modal,
  Icon,
  message,
  Divider,
  Button,
  Popover,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;
const formhz11 = {
  wrapperCol: {
    style: {
      width: '50%',
    },
  },
  style: {
    width: '80%',
  },
};
const fieldLabels = {
  contractTitle: '合同标题',
  invoiceMoney: '开票金额',
  incomeMoneyAlready: '已收入金额',
  contractor: '承办人',
  receivablesDate: '收款日期',
  incomeMoney: '收入金额',
  receivablesType: '收款类型',
  remarks: '备注',
};

class InvoiceListApplyModal extends PureComponent {
  state = {
    width: '90%',
  };
  componentDidMount() {
    this.getMock();
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  };
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting, receivablesAddVisible, handleReceivablesAddVisible } = this.props;
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
          form.resetFields();
          handleReceivablesAddVisible(false);
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
        title="申请开票"
        style={{ top: 150 }}
        // 对话框是否可见
        visible={receivablesAddVisible}
        width="60%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleReceivablesAddVisible()}
      >
        <div>
          <Card>
            <Form layout="inline">
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.contractTitle}>
                    {getFieldDecorator('contractTitle', {
                      rules: [{ required: true, message: '请输入合同标题' }],
                    })(
                      <Input  placeholder="请输入合同标题" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.invoiceMoney}>
                    {getFieldDecorator('invoiceMoney', {
                      rules: [{ required: true, message: '请输入开票金额' }],
                    })(
                      <Input placeholder="请输入开票金额" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>

              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.contractor}>
                    {getFieldDecorator('contractor', {
                      rules: [{ required: true, message: '请输入承办人' }],
                    })(
                      <Input placeholder="请输入承办人" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.receivablesDate}>
                    {getFieldDecorator('receivablesDate', {
                      rules: [{ required: true, message: '请输入收款日期' }],
                    })(
                      <Input placeholder="请输入收款日期" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.incomeMoney}>
                    {getFieldDecorator('incomeMoney', {
                      rules: [{ required: true, message: '请输入收入金额' }],
                    })(<Input placeholder="请输入收入金额" className={styles['ant-input-lg']} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.receivablesType}>
                    {getFieldDecorator('receivablesType', {
                      rules: [{ required: true, message: '请选择收款类型' }],
                    })(
                      <Select placeholder="请选择收款类型" style={{ width: 200 }}>
                        <Option value="现金">现金</Option>
                        <Option value="刷卡">刷卡</Option>
                        <Option value="支付宝">支付宝</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.remarks}>
                    {getFieldDecorator('remarks', {
                      rules: [{ required: true, message: '请输入备注' }],
                    })(<TextArea placeholder="请输入备注" style={{ minHeight: 32 }} rows={4} />)}
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
}))(Form.create()(InvoiceListApplyModal));
