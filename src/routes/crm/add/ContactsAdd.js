import React, { PureComponent } from 'react';
import { Card, Form, Row, Col, Input, Select, Cascader, Checkbox } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;
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
  affiliatedCustomers: '所属客户',
  contactName: '客户名称',
  code: '编号',
  mobilephone: '移动手机',
  phoneNumber: '手机号码',
  region: '所在区域',
  remark: '备注',
  status: '状态',
  mailBox: '电子邮箱',
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

const remarkcol = {
  style: {
    paddingLeft: 34,
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
      width: '50%',
    },
  },
  style: {
    width: '80%',
    paddingLeft: 24,
  },
};

const formhz12 = {
  wrapperCol: {
    style: {
      width: '50%',
    },
  },
  style: {
    width: '80%',
  },
};

class ContactsAdd extends PureComponent {
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
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Card>
          <Form layout="inline">
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formhz11} label={fieldLabels.code}>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入编号' }],
                  })(<Input placeholder="请输入编号" className={styles['ant-input-lg']} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formhz11} label={fieldLabels.affiliatedCustomers}>
                  {getFieldDecorator('affiliatedCustomers', {
                    rules: [{ required: true, message: '请输入所属客户' }],
                  })(
                    <Select placeholder="请输入所属客户" style={{ width: 200 }}>
                      <Option value="0">杭州客户</Option>
                      <Option value="g">新昌客户</Option>
                      <Option value="y">诸暨客户</Option>
                      <Option value="q">河南客户</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={8}>
                <Form.Item {...formhz12} label={fieldLabels.contactName}>
                  {getFieldDecorator('contactName', {
                    rules: [{ required: true, message: '请选择客户名称' }],
                  })(<Input placeholder="请选择客户名称" className={styles['ant-input-lg']} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator({
                    rules: [{ required: true, message: '请选择是否法人' }],
                  })(<Checkbox>是否法人</Checkbox>)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator({
                    rules: [{ required: true, message: '请选择是否主联系人' }],
                  })(<Checkbox>是否主联系人</Checkbox>)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...cnumcol} label={fieldLabels.phoneNumber}>
                  {getFieldDecorator('phoneNumber', {
                    rules: [{ required: false, message: '请输入移动手机' }],
                  })(<Input placeholder="请输入移动手机" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...cpinyincol} label={fieldLabels.mailBox}>
                  {getFieldDecorator('mailBox', {
                    rules: [{ required: false, message: '请输入电子邮箱' }],
                  })(<Input placeholder="请输入电子邮箱" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col>
                <Form.Item label={fieldLabels.region}>
                  {getFieldDecorator('region', {
                    rules: [{ required: true, message: '请选择所在区域' }],
                  })(
                    <Cascader
                      options={optionshz}
                      onChange={onChange}
                      placeholder="请选择所在区域"
                      style={{ width: 400 }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...remarkcol} label={fieldLabels.remark}>
                  {getFieldDecorator('remark', {
                    rules: [{ required: false, message: '请输入备注' }],
                  })(<Input placeholder="请输入备注" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
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
}))(Form.create()(ContactsAdd));
