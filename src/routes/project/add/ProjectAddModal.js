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
  Checkbox,
  Modal,
} from 'antd';
import { connect } from 'dva';
// import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
// import TableForm from './TableForm';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
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

function onChange(value) {
  console.log(value);
}

const fieldLabels = {
  number: '项目编码',
  type: '项目类别',
  years: '年度',
  name: '项目名称',
  dateRange: '生效日期',
  cuslink: '客户联系人',
  customer: '客户',
  url: '网站主页',
  taxcode: '税务登记号',
  fzcompany: '负责公司',
  fzperson: '项目负责人',
  fee: '项目费用',
  startdate: '开始日期',
  enddate: '结束日期',
  biztype: '业务类别',
  content: '项目内容',
  address: '详细地址',
  remark: '备注',
  status: '状态',
  jfw: '交付物',
  demand: '客户需求',
};

const cnumcol = {
  style: {
    paddingLeft: 10,
  },
};

const yearscol = {
  style: {
    paddingLeft: 36,
  },
};

const customercol = {
  style: {
    paddingLeft: 36,
  },
};

const feecol = {
  style: {
    paddingLeft: 13,
  },
};

const addresscol = {
  style: {
    paddingLeft: 10,
  },
};
const enddatecol = {
  style: {
    paddingLeft: 23,
  },
};
const startdatecol = {
  style: {
    paddingLeft: 10,
  },
};

const remarkcol = {
  wrapperCol: {
    style: {
      width: '91.66666667%',
    },
  },
  style: {
    width: '98.66666667%',
    paddingLeft: 24,
  },
};

const demandcol = {
  wrapperCol: {
    style: {
      width: '69%',
    },
  },
  style: {
    width: '90%',
    paddingLeft: 20,
  },
};

const jfwcol = {
  wrapperCol: {
    style: {
      width: '78%',
    },
  },
  style: {
    width: '91%',
    paddingLeft: 12,
  },
};

const companycol = {
  style: {
    paddingLeft: 10,
  },
};

const statuscol = {
  style: {
    paddingLeft: 35,
  },
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

class ProjectAddModal extends PureComponent {
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
    const { form, dispatch, submitting, projectVisible, handleProjectVisible  } = this.props;
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
      <Modal
        title="项目基本信息新增"
        visible={projectVisible}
        width='90%'
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleProjectVisible()}
      >
        <div>
          <Card>
            <Form layout="inline">
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入项目名称' }],
                    })(<Input placeholder="请输入项目名称" className={styles['ant-input-lg']} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.type}>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '请选择项目类别' }],
                    })(
                      <Select placeholder="请选择项目类别" style={{ width: 200 }}>
                        <Option value="0">请选择</Option>
                        <Option value="g">工程造价业务项目</Option>
                        <Option value="y">咨询报告</Option>
                        <Option value="q">招标</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...yearscol} label={fieldLabels.years}>
                    {getFieldDecorator('years', {
                      rules: [{ required: true, message: '请选择年度' }],
                    })(
                      <Select placeholder="请选择年度" style={{ width: 200 }}>
                        <Option value="xiao">请选择</Option>
                        <Option value="z">2018</Option>
                        <Option value="f">2019</Option>
                        <Option value="fd">2020</Option>
                        <Option value="sn">2021</Option>
                        <Option value="zf">2022</Option>
                        <Option value="sy">2023</Option>
                        <Option value="jr">2024</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...statuscol} label={fieldLabels.status}>
                    {getFieldDecorator('status', {
                      rules: [{ required: true, message: '请选择项目状态' }],
                    })(
                      <Select placeholder="请选择项目状态" style={{ width: 200 }}>
                        <Option value="c">启用</Option>
                        <Option value="h">禁用</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item {...cnumcol} label={fieldLabels.number}>
                    {getFieldDecorator('number', {
                      rules: [{ required: false, message: '请输入项目编码' }],
                    })(<Input placeholder="请输入项目编码" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...customercol} label={fieldLabels.customer}>
                    {getFieldDecorator('customer', {
                      rules: [{ required: true, message: '请选择客户' }],
                    })(
                      <Select placeholder="请选择客户" style={{ width: 200 }}>
                        <Option value="xiao">请选择</Option>
                        <Option value="z">客户A</Option>
                        <Option value="f">客户B</Option>
                        <Option value="fd">客户C</Option>
                        <Option value="sn">客户D</Option>
                        <Option value="zf">客户E</Option>
                        <Option value="sy">客户F</Option>
                        <Option value="jr">客户H</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.cuslink}>
                    {getFieldDecorator('cuslink', {
                      rules: [{ required: true, message: '请选择客户联系人' }],
                    })(
                      <Select placeholder="请选择客户联系人" style={{ width: 200 }}>
                        <Option value="xiao">请选择</Option>
                        <Option value="z">客户联系人A</Option>
                        <Option value="f">客户联系人B</Option>
                        <Option value="fd">客户联系人C</Option>
                        <Option value="sn">客户联系人D</Option>
                        <Option value="zf">客户联系人E</Option>
                        <Option value="sy">客户联系人F</Option>
                        <Option value="jr">客户联系人H</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.fzcompany}>
                    {getFieldDecorator('fzcompany', {
                      rules: [{ required: true, message: '负责公司' }],
                    })(
                      <Select placeholder="负责公司" style={{ width: 200 }}>
                        <Option value="xiao">请选择</Option>
                        <Option value="z">公司A</Option>
                        <Option value="f">公司B</Option>
                        <Option value="fd">公司C</Option>
                        <Option value="sn">公司D</Option>
                        <Option value="zf">公司E</Option>
                        <Option value="sy">公司F</Option>
                        <Option value="jr">公司H</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.fzperson}>
                    {getFieldDecorator('fzperson', {
                      rules: [{ required: true, message: '项目负责人' }],
                    })(
                      <Select placeholder="负责公司" style={{ width: 200 }}>
                        <Option value="xiao">请选择</Option>
                        <Option value="z">公司A</Option>
                        <Option value="f">公司B</Option>
                        <Option value="fd">公司C</Option>
                        <Option value="sn">公司D</Option>
                        <Option value="zf">公司E</Option>
                        <Option value="sy">公司F</Option>
                        <Option value="jr">公司H</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...feecol} label={fieldLabels.fee}>
                    {getFieldDecorator('fee', {
                      rules: [{ required: true, message: '请输入项目费用' }],
                    })(<Input placeholder="请输入项目费用" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item {...startdatecol} label={fieldLabels.startdate}>
                    {getFieldDecorator('startdate')(
                      <DatePicker style={{ width: 200 }} placeholder="请输入开始日期" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...enddatecol} label={fieldLabels.enddate}>
                    {getFieldDecorator('enddate')(
                      <DatePicker style={{ width: 200 }} placeholder="请输入结束日期" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} />
              </Row>

              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.biztype}>
                    {getFieldDecorator('biztype')(
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                          <Col span={8}>
                            <Checkbox value="A">预算编制</Checkbox>
                          </Col>
                          <Col span={8}>
                            <Checkbox value="B">结算编制</Checkbox>
                          </Col>
                          <Col span={8}>
                            <Checkbox value="C">建设工程招标代理</Checkbox>
                          </Col>
                          <Col span={8}>
                            <Checkbox value="D">咨询审核</Checkbox>
                          </Col>
                          <Col span={8}>
                            <Checkbox value="E">预算审核</Checkbox>
                          </Col>
                          <Col span={8}>
                            <Checkbox value="F">结算审核</Checkbox>
                          </Col>
                          <Col span={8}>
                            <Checkbox value="G">政府采购招标代理</Checkbox>
                          </Col>
                          <Col span={8}>
                            <Checkbox value="H">咨询报告</Checkbox>
                          </Col>
                        </Row>
                      </Checkbox.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formhz12} label={fieldLabels.content}>
                    {getFieldDecorator('content')(<TextArea placeholder="请输入项目内容" rows={4} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['row-h']}>
                <Col span={12}>
                  <Form.Item {...jfwcol} label={fieldLabels.jfw}>
                    {getFieldDecorator('jfw')(
                      <TextArea placeholder="请输入项目结束时的交付物" rows={4} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...demandcol} label={fieldLabels.demand}>
                    {getFieldDecorator('demand')(<TextArea placeholder="请输入客户需求" rows={4} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...remarkcol} label={fieldLabels.remark}>
                    {getFieldDecorator('remark')(<TextArea placeholder="请输入备注信息" rows={4} />)}
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
}))(Form.create()(ProjectAddModal));
