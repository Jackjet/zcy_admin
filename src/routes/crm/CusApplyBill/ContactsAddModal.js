import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  Input,
  Select,
  Popover,
  Cascader,
  Checkbox,
  Modal,
  message,
  Button,
  Table,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import EditableCell from '../../EditableTable/EditableCell';
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
  affiliatedCustomers: '客户名称',
  contactName: '客户名称',
  code: '客户编号',
  mobilephone: '移动手机',
  phoneNumber: '手机号码',
  region: '所在区域',
  remark: '备注',
  status: '状态',
  mailBox: '电子邮箱',
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

class ContactsAddModal extends PureComponent {
  state = {
    width: '100%',
    dataSource: [
      {
        key: '0',
        name: '汪工',
        phone: '123456',
        remarks: 'aaa',
      },
      {
        key: '1',
        name: '申工',
        phone: '456789',
        remarks: 'bbb',
      },
    ],
    count: 2,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  onCellChange = (key, dataIndex) => {
    return value => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({
          dataSource,
        })
        ;
      }
    };
  };
  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `小杨 ${count}`,
      phone: 18,
      remarks: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
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
    const { form, dispatch, submitting, contactsVisible, handleContactsVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功');
          handleContactsVisible(false);
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
    const { dataSource } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'name')} />
        ),
      },
      {
        title: '联系人类型',
        dataIndex: 'type',
        render: (text, record) => (
          <div>
            <Select style={{ width: 130 }}>
              <Option value="0">主联系人</Option>
              <Option value="1">法人</Option>
            </Select>
          </div>
        ),
      },
      {
        title: '联系电话',
        dataIndex: 'mobilePhone',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'remarks')} />
        ),
      },
      {
        title: '办公电话',
        dataIndex: 'officePhone',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'remarks')} />
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return this.state.dataSource.length > 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <a href=" ">Delete</a>
            </Popconfirm>
          ) : null;
        },
      },
    ];
    return (
      <Modal
        title="联系人基本信息设置"
        style={{ top: 20 }}
        visible={contactsVisible}
        width="80%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleContactsVisible()}
      >
        <div>
          <Card>
            {/*<Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.code}>
                    {getFieldDecorator('code', {
                      rules: [{ required: true, message: '请输入编号' }],
                    })(<Input placeholder="自动带出编号" style={{ width: 200 }}  />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.affiliatedCustomers}>
                    {getFieldDecorator('affiliatedCustomers', {
                      rules: [{ required: false, message: '请输入所属客户' }],
                    })(
                      <Select placeholder="自动带出名称" style={{ width: 200 }}>
                        <Option value="0">杭州客户</Option>
                        <Option value="g">新昌客户</Option>
                        <Option value="y">诸暨客户</Option>
                        <Option value="q">河南客户</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} >
                    {getFieldDecorator('lagalperson', {
                      rules: [{ required: false, message: '请选择是否法人' }],
                    })(<Checkbox>是否法人</Checkbox>)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} >
                    {getFieldDecorator('mainperson', {
                      rules: [{ required: false, message: '请选择是否主联系人' }],
                    })(<Checkbox>是否主联系人</Checkbox>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.phoneNumber}>
                    {getFieldDecorator('phoneNumber', {
                      rules: [{ required: false, message: '请输入移动手机' }],
                    })(<Input placeholder="请输入移动手机" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.mailBox}>
                    {getFieldDecorator('mailBox', {
                      rules: [{ required: false, message: '请输入电子邮箱' }],
                    })(<Input placeholder="请输入电子邮箱" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.region}>
                    {getFieldDecorator('region', {
                      rules: [{ required: false, message: '请选择所在区域' }],
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
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.remark}>
                    {getFieldDecorator('remark', {
                      rules: [{ required: false, message: '请输入备注' }],
                    })(<Input placeholder="请输入备注" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.status}>
                    {getFieldDecorator('status', {
                      rules: [{ required: false, message: '状态' }],
                      initialValue:'启用',
                    })(
                      <Select placeholder="请选择状态" disable style={{ width: 200 }}>
                        <Option value="启用">
                          启用
                        </Option>
                        <Option value="禁用">禁用</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>*/}
            <div>
              <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                新增联系人
              </Button>
              <Table
                dataSource={dataSource}
                columns={columns}
              />
            </div>
          </Card>
        </div>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ContactsAddModal));
