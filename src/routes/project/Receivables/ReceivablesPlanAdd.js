import React, { PureComponent } from 'react';
import { Card, Form, Icon, Col, Row, DatePicker, Input, Select, Popover, Checkbox } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  receivablesName: '收款阶段名称',
  receivablesType: '收款方式',
  reportion: '名称收款比例',
  receivablesDate: '收款日期',
  paymentCondition: '支付条件说明',
};

const formhz12 = {
  wrapperCol: {
    style: {
      width: '92%',
    },
  },
  style: {
    width: '96.66666667%',
  },
};

const formhz11 = {
  wrapperCol: {
    style: {
      width: '90.2%',
    },
  },
  style: {
    width: '96.66666667%',
  },
};

class ReceivablesPlanAdd extends PureComponent {
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
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
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
      <div>
        <Card>
          <Form layout="inline">
            <Row className={styles['fn-mb-15']}>
              <Col span={8}>
                <Form.Item {...formhz11} label={fieldLabels.receivablesName}>
                  {getFieldDecorator('receivablesName', {
                    rules: [{ required: true, message: '请输入收款阶段名称' }],
                  })(<Input placeholder="请输入收款阶段名称" className={styles['ant-input-lg']} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formhz11} label={fieldLabels.receivablesType}>
                  {getFieldDecorator('receivablesType', {
                    rules: [{ required: true, message: '请选择收款方式' }],
                  })(
                    <Select placeholder="请选择收款方式" style={{ width: 200 }}>
                      <Option value="0">A</Option>
                      <Option value="g">B</Option>
                      <Option value="y">C</Option>
                      <Option value="q">D</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col>
                <Form.Item {...formhz11} label={fieldLabels.reportion}>
                  {getFieldDecorator('reportion', {
                    rules: [{ required: true, message: '请输入名称收款比例' }],
                  })(<Input placeholder="请输入名称收款比例" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col>
                <Form.Item {...formhz11} label={fieldLabels.receivablesDate}>
                  {getFieldDecorator('receivablesDate', {
                    rules: [{ required: true, message: '请选择收款日期' }],
                  })(
                    <Select placeholder="请选择收款日期" style={{ width: 200 }}>
                      <Option value="c">启用</Option>
                      <Option value="h">禁用</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col>
                <Form.Item {...formhz11} label={fieldLabels.paymentCondition}>
                  {getFieldDecorator('paymentCondition', {
                    rules: [{ required: false, message: '请输入支付条件说明' }],
                  })(<Input placeholder="请输入支付条件说明" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ReceivablesPlanAdd));
