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
} from 'antd';
import { connect } from 'dva';
// import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
// import TableForm from './TableForm';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
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
  number: '客户编码',
  level: '客户等级',
  industy: '所属行业',
  name: '客户名称',
  dateRange: '生效日期',
  simplename: '简称',
  pinyin: ' 拼 音 码 ',
  url: '网站主页',
  taxcode: '税务登记号',
  mobilephone: '移动手机',
  emial: '电子邮箱',
  phone: '公司电话',
  postalcode: '邮政编码',
  region: '所在区域',
  incometax: '所得税征收方式',
  company: '所属公司',
  address: '详细地址',
  remark: '备注',
  status: '状态',
};

const cnumcol = {
  style: {
    paddingLeft: 10,
  },
};

const cpinyincol = {
  style: {
    paddingLeft: 13,
  },
};

const simplenamecol = {
  style: {
    paddingLeft: 72,
  },
};

const companyphonecol = {
  style: {
    paddingLeft: 37,
  },
};

const addresscol = {
  style: {
    paddingLeft: 10,
  },
};
const urlcol = {
  style: {
    paddingLeft: 10,
  },
};

const remarkcol = {
  style: {
    paddingLeft: 34,
  },
};

const companycol = {
  style: {
    paddingLeft: 10,
  },
};

const statuscol = {
  style: {
    paddingLeft: 27,
  },
};

const formhz11 = {
  wrapperCol: {
    style: {
      width: '91.66666667%',
    },
  },
  style: {
    width: '105%',
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

class CustomerCheck extends PureComponent {
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
              <Col>
                <Form.Item {...formhz11} label={fieldLabels.name}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入客户名称' }],
                  })(<Input placeholder="请输入客户名称" className={styles['ant-input-lg']} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={8}>
                <Form.Item label={fieldLabels.level}>
                  {getFieldDecorator('level', {
                    rules: [{ required: true, message: '请选择客户等级' }],
                  })(
                    <Select placeholder="请选择客户等级" style={{ width: 200 }}>
                      <Option value="0">请选择</Option>
                      <Option value="g">贵宾</Option>
                      <Option value="y">一般客户</Option>
                      <Option value="q">潜在客户</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={fieldLabels.industy}>
                  {getFieldDecorator('industy', {
                    rules: [{ required: true, message: '请选择行业' }],
                  })(
                    <Select placeholder="请选择行业" style={{ width: 200 }}>
                      <Option value="xiao">请选择</Option>
                      <Option value="z">制造业</Option>
                      <Option value="f">服务业</Option>
                      <Option value="fd">房地产建筑</Option>
                      <Option value="sn">三农业务</Option>
                      <Option value="zf">政府购买</Option>
                      <Option value="sy">商业</Option>
                      <Option value="jr">金融</Option>
                      <Option value="fyl">非营利组织</Option>
                      <Option value="other">其他</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={fieldLabels.incometax}>
                  {getFieldDecorator('incometax', {
                    rules: [{ required: true, message: '请选择所得税征收方式' }],
                  })(
                    <Select placeholder="请选择所得税征收方式" style={{ width: 200 }}>
                      <Option value="c">查账征收</Option>
                      <Option value="h">核定征收</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={8}>
                <Form.Item {...cnumcol} label={fieldLabels.number}>
                  {getFieldDecorator('number', {
                    rules: [{ required: false, message: '请输入客户编码' }],
                  })(<Input placeholder="请输入客户编码" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...cpinyincol} label={fieldLabels.pinyin}>
                  {getFieldDecorator('pinyin', {
                    rules: [{ required: false, message: '请输入拼音码' }],
                  })(<Input placeholder="请输入拼音码" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...simplenamecol} label={fieldLabels.simplename}>
                  {getFieldDecorator('simplename', {
                    rules: [{ required: false, message: '请输入简称' }],
                  })(<Input placeholder="请输入简称" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={8}>
                <Form.Item label={fieldLabels.mobilephone}>
                  {getFieldDecorator('mobilephone', {
                    rules: [{ required: true, message: '请输入手机号码' }],
                  })(<Input placeholder="请输入手机号码" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={fieldLabels.emial}>
                  {getFieldDecorator('emial', {
                    rules: [{ required: true, message: '请输入电子邮箱' }],
                  })(<Input placeholder="请输入电子邮箱" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...companyphonecol} label={fieldLabels.phone}>
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: '请输入公司电话' }],
                  })(<Input placeholder="请输入公司电话" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={8}>
                <Form.Item label={fieldLabels.postalcode}>
                  {getFieldDecorator('postalcode', {
                    rules: [{ required: true, message: '请输入邮政编码' }],
                  })(<Input placeholder="请输入邮政编码" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label={fieldLabels.region}>
                  {getFieldDecorator('region', {
                    rules: [{ required: true, message: '请选择所在区域' }],
                  })(
                    <Cascader
                      options={optionshz}
                      onChange={onChange}
                      placeholder="请选择所在区域"
                      style={{ width: 603 }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={8}>
                <Form.Item {...urlcol} label={fieldLabels.url}>
                  {getFieldDecorator('url', {
                    rules: [{ required: false, message: '请输入网站主页' }],
                  })(<Input placeholder="请输入网站主页" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item {...addresscol} label={fieldLabels.address}>
                  {getFieldDecorator('address', {
                    rules: [{ required: false, message: '请输入详细地址' }],
                  })(<Input placeholder="请输入详细地址" style={{ width: 603 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={8}>
                <Form.Item label={fieldLabels.taxcode}>
                  {getFieldDecorator('taxcode', {
                    rules: [{ required: false, message: '请输入税务登记号' }],
                  })(<Input placeholder="请输入税务登记号" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item {...remarkcol} label={fieldLabels.remark}>
                  {getFieldDecorator('remark', {
                    rules: [{ required: false, message: '请输入备注' }],
                  })(<Input placeholder="请输入备注" style={{ width: 603 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={8}>
                <Form.Item {...statuscol} label={fieldLabels.status}>
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '状态' }],
                  })(
                    <Select placeholder="请选择状态" disable style={{ width: 200 }}>
                      <Option value="cancel" selected>
                        启用
                      </Option>
                      <Option value="delete">删除</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item {...companycol} label={fieldLabels.company}>
                  {getFieldDecorator('company', {})(
                    <Input placeholder="所属公司" style={{ width: 603 }} />
                  )}
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
}))(Form.create()(CustomerCheck));
