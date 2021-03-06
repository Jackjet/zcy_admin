import React, { PureComponent } from 'react';
import { Card, Form, Icon, Col, Row, Input, Popover, Modal, Cascader, Collapse } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const industry = [
  '制造业',
  '服务业',
  '房地产建筑',
  '三农业务',
  '政府购买',
  '商业',
  '非营利组织',
  '其他',
];
const statusMap = ['default', 'processing', 'success', 'error'];
const cusStatus = ['启用', '禁用'];

const { TextArea } = Input;
const { Panel } = Collapse;
const optionshz = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
const fieldLabels = {
  cusCode: '客户编码',
  cusLevel: '客户等级',
  industry: '所属行业',
  cusName: '客户名称',
  dateRange: '生效日期',
  simpleName: '简称',
  pinyin: ' 拼 音 码 ',
  url: '网站主页',
  taxCode: '税务登记号',
  cusMobilePhone: '移动手机',
  email: '电子邮箱',
  cusCompanyPhone: '公司电话',
  postalCode: '邮政编码',
  region: '所在区域',
  incomeTax: '所得税征收方式',
  cusCompany: '所属公司',
  address: '详细地址',
  remark: '备注',
  cusStatus: '状态',
  cusCompanyName: '单位名称',
  cusCompanyAddress: '单位地址',
  taxNumber: '税号',
  openAccountBank: '开户银行',
  bankAccount: '银行账户',
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

class CustomerEditModal extends PureComponent {
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
      submitting,
      customerEditVisible,
      handleCustomerEditVisible,
      rowInfo,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          form.resetFields();
          handleCustomerEditVisible(false);
        }
      });
    };
    const cancelDate = () => {
      form.resetFields();
      handleCustomerEditVisible(false);
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
        destroyOnClose="true"
        keyboard={false}
        title="客户基本信息编辑"
        style={{ top: 20 }}
        visible={customerEditVisible}
        width="90%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Collapse defaultActiveKey={['1', '2']}>
                <Panel header="客户基本信息" key="1">
                  <div>
                    <Card>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusName}>
                            {getFieldDecorator('name', {
                              rules: [{ required: true, message: '请输入客户名称' }],
                              initialValue: rowInfo.name,
                            })(<Input placeholder="请输入客户名称" />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.industry}>
                            {getFieldDecorator('industry', {
                              rules: [{ required: true, message: '请选择行业' }],
                            })(<Input placeholder="请选择行业" />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusCompany}>
                            {getFieldDecorator('company', {
                              rules: [{ required: true, message: '所属公司' }],
                              initialValue: rowInfo.company,
                            })(<Input placeholder="所属公司" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.incomeTax}>
                            {getFieldDecorator('incomeTax', {
                              rules: [{ required: false, message: '请选择所得税征收方式' }],
                            })(<Input placeholder="请选择所得税征收方式" />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.taxCode}>
                            {getFieldDecorator('taxCode', {
                              rules: [{ required: false, message: '请输入税务登记号' }],
                            })(<Input placeholder="请输入税务登记号" />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusStatus}>
                            {getFieldDecorator('status', {
                              rules: [{ required: true, message: '状态' }],
                            })(<Input placeholder="请选择状态" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusCode}>
                            {getFieldDecorator('cusCode', {
                              rules: [{ required: false, message: '请输入客户编码' }],
                            })(<Input placeholder="请输入客户编码" />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.pinyin}>
                            {getFieldDecorator('pinyin', {
                              rules: [{ required: false, message: '请输入拼音码' }],
                            })(<Input placeholder="请输入拼音码" />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.simpleName}>
                            {getFieldDecorator('simpleName', {
                              rules: [{ required: false, message: '请输入简称' }],
                            })(<Input placeholder="请输入简称" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusMobilePhone}>
                            {getFieldDecorator('cusMobilePhone', {
                              rules: [{ required: true, message: '请输入手机号码' }],
                            })(<Input placeholder="请输入手机号码" />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.email}>
                            {getFieldDecorator('email', {
                              rules: [{ required: false, message: '请输入电子邮箱' }],
                            })(<Input placeholder="请输入电子邮箱" />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusCompanyPhone}>
                            {getFieldDecorator('cusCompanyPhone', {
                              rules: [{ required: false, message: '请输入公司电话' }],
                            })(<Input placeholder="请输入公司电话" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.postalCode}>
                            {getFieldDecorator('postalCode', {
                              rules: [{ required: false, message: '请输入邮政编码' }],
                            })(<Input placeholder="请输入邮政编码" />)}
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item {...formItemLayout} label={fieldLabels.region}>
                            {getFieldDecorator('region', {
                              rules: [{ required: true, message: '请选择所在区域' }],
                            })(<Cascader options={optionshz} placeholder="请选择所在区域" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.url}>
                            {getFieldDecorator('url', {
                              rules: [{ required: false, message: '请输入网站主页' }],
                            })(<Input placeholder="请输入网站主页" />)}
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item {...formItemLayout} label={fieldLabels.address}>
                            {getFieldDecorator('address', {
                              rules: [{ required: false, message: '请输入详细地址' }],
                            })(<Input placeholder="请输入详细地址" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={23} pull={5}>
                          <Form.Item {...formItemLayout} label={fieldLabels.remark}>
                            {getFieldDecorator('remark', {
                              rules: [{ required: false, message: '请输入备注' }],
                            })(<TextArea placeholder="请输入备注" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                </Panel>
                <Panel header="开票信息" key="2">
                  <Card>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label={fieldLabels.cusCompanyName}>
                          {getFieldDecorator('cusCompanyName', {
                            rules: [{ required: false, message: '请输入单位名称' }],
                          })(<Input placeholder="请输入单位名称" className={styles['fn-mb-15']} />)}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label={fieldLabels.cusCompanyAddress}>
                          {getFieldDecorator('cusCompanyAddress', {
                            rules: [{ required: false, message: '请输入单位地址' }],
                          })(<Input placeholder="请输入单位地址" className={styles['fn-mb-15']} />)}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label={fieldLabels.taxNumber}>
                          {getFieldDecorator('taxNumber', {
                            rules: [{ required: false, message: '请输入税号' }],
                          })(<Input placeholder="请输入税号" className={styles['fn-mb-15']} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label={fieldLabels.openAccountBank}>
                          {getFieldDecorator('openAccountBank', {
                            rules: [{ required: false, message: '请输入开户银行' }],
                          })(<Input placeholder="请输入开户银行" className={styles['fn-mb-15']} />)}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label={fieldLabels.bankAccount}>
                          {getFieldDecorator('bankAccount', {
                            rules: [{ required: false, message: '请输入银行账户' }],
                          })(<Input placeholder="请输入银行账户" className={styles['fn-mb-15']} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Panel>
              </Collapse>
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
}))(Form.create()(CustomerEditModal));
