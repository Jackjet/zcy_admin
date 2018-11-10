import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Select,
  Divider,
  DatePicker,
} from 'antd';
import styles from '../list/style.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const fieldLabels = {
  invoiceName: '开票名称',
  invoiceDate: '开票时间',
  invoiceMoney: '发票金额',
  invoiceType: '开票类型',
  invoiceCompany: '开票公司',
  invoicePersonnel: '开票人员',
  receivablesStatus: ' 收款完成 ',
  invoiceNumber: '发票号码',
};

const formhz11 = {
  wrapperCol: {
    style: {
      width: '55%',
    },
  },
  style: {
    width: '80%',
  },
};

const formhz12 = {
  wrapperCol: {
    style: {
      width: '80%',
    },
  },
  style: {
    width: '40%',
  },
};

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
// PureComponent优化Component的性能
export default class SearchForm extends PureComponent {
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
    const { form, dispatch, submitting, searchFormVisible, handleSearchFormVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          handleSearchFormVisible(false);
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
        title="查找项目开票"
        style={{ top: 20 }}
        visible={searchFormVisible}
        width="60%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleSearchFormVisible(false)}
      >
        <div>
          <Card>
            <Form layout="inline">
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.invoiceName}>
                    {getFieldDecorator('invoiceName', {
                      rules: [{ required: false, message: '请输入开票名称' }],
                    })(<Input placeholder="请输入开票名称" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.invoiceDate}>
                    {getFieldDecorator('invoiceDate', {
                      rules: [{ required: false, message: '请输入开票时间' }],
                    })(<RangePicker style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={12}>
                  <Form.Item {...formhz12} label={fieldLabels.invoiceMoney}>
                    {getFieldDecorator('invoiceMoney', {
                      rules: [{ required: false, message: '请输入发票金额' }],
                    })(
                      <div>
                        <Input placeholder="请输入发票金额" style={{ width: 100 }} />
                        <Input placeholder="请输入发票金额" style={{ width: 100 }} />
                      </div>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.invoiceType}>
                    {getFieldDecorator('invoiceType', {
                      rules: [{ required: false, message: '请选择开票类型' }],
                    })(
                      <Select placeholder="请选择开票类型" style={{ width: 200 }}>
                        <Option value="类型A">类型A</Option>
                        <Option value="类型B">类型B</Option>
                        <Option value="类型C">类型C</Option>
                        <Option value="类型D">类型D</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.invoiceCompany}>
                    {getFieldDecorator('invoiceCompany', {
                      rules: [{ required: false, message: '请输入开票公司' }],
                    })(<Input placeholder="请输入开票公司" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.invoicePersonnel}>
                    {getFieldDecorator('invoicePersonnel', {
                      rules: [{ required: false, message: '请输入开票人员' }],
                    })(<Input placeholder="请输入开票人员" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.receivablesStatus}>
                    {getFieldDecorator('receivablesStatus', {
                      rules: [{ required: false, message: '请选择收款完成' }],
                    })(
                      <Select placeholder="请选择收款完成" style={{ width: 200 }}>
                        <Option value="是">是</Option>
                        <Option value="否">否</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.invoiceNumber}>
                    {getFieldDecorator('invoiceNumber', {
                      rules: [{ required: false, message: '请输入发票号码' }],
                    })(<Input placeholder="请输入发票号码" style={{ width: 200 }} />)}
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
