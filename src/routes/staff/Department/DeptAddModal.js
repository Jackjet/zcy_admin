import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Popover,
  Modal,
  Button,
  Table,
  Popconfirm,
  message,
} from 'antd';
import { connect } from 'dva';
import PartnerType from './PartnerType';
import EditableCell from '../EditableTable/EditableCell';
import styles from './style.less';


const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
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

class DepartmentAddModal extends PureComponent {
  state = {
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
    partnerTypeVisible: false,
    partnerTypeValue: '杭州至诚云',
    width: '100%',
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
        this.setState({ dataSource });
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

  handlePartnerTypeVisible = flag => {
    this.setState({
      partnerTypeVisible: !!flag,
    });
  };

  handlePartnerTypeValue = unit => {
    this.setState({
      partnerTypeValue: unit,
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
    const { form, dispatch, DepartmentAddVisible, handleDepartmentAddVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { partnerTypeValue, partnerTypeVisible } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'dept/add',
            payload: values,
            callback: res => {
              if (res.meta.status === '000000') {
                handleDepartmentAddVisible(false);
              } else {
                message.error(res.meta.errmsg);
              }
            },
          });
        }
      });
    };
    const cancelDate = () => {
      handleDepartmentAddVisible(false);
    };
    const { dataSource } = this.state;
    const columns = [
      {
        key: '1',
        title: '合伙人',
        dataIndex: 'name',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'name')} />
        ),
      },
      {
        key: '2',
        title: '合伙人类型',
        dataIndex: 'type',
        render: (text, record) => (
          <Search
            defaultValue="11111"
            placeholder="合伙人类型"
            onSearch={this.handlePartnerTypeVisible}
          />
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
    const parentMethods = {
      handlePartnerTypeVisible: this.handlePartnerTypeVisible,
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="部门信息新增"
        style={{ top: 20 }}
        visible={DepartmentAddVisible}
        width="55%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText="提交"
      >
        <Card>
          <Form layout="horizontal">
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="部门名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入组织名称' }],
                    initialValue: `${partnerTypeValue}`,
                  })(<Search placeholder="合伙人类型" onSearch={this.handlePartnerTypeVisible} />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item {...formItemLayout} label="上级部门">
                  {getFieldDecorator('parentId', {
                    rules: [{ required: true, message: '请选择上级组织' }],
                    initialValue: `至诚`,
                  })(
                    <Select placeholder="请选择上级组织">
                      <Option value={1}>义务至诚</Option>
                      <Option value={0}>杭州至诚</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="部门编码">
                  {getFieldDecorator('number', {
                    rules: [{ required: true, message: '请输入组织编码' }],
                  })(<Input placeholder="请输入组织编码" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="是否分公司">
                  {getFieldDecorator('iscompany', {
                    rules: [{ required: true, message: '是否分公司' }],
                    initialValue: `否`,
                  })(
                    <Select>
                      <Option value="0">否</Option>
                      <Option value="1">是</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="简称">
                  {getFieldDecorator('simpleName', {
                    rules: [{ required: false, message: '请输入简称' }],
                  })(<Input placeholder="请输入简称" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="英文名称">
                  {getFieldDecorator('englishName', {
                    rules: [{ required: false, message: '请输入英文名称' }],
                  })(<Input placeholder="请输入英文名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="部门负责人">
                  {getFieldDecorator('principal', {
                    rules: [{ required: false, message: '请选择部门负责人' }],
                  })(
                    <Select placeholder="请选择部门负责人">
                      <Option value="0">请选择</Option>
                      <Option value="1">员工A</Option>
                      <Option value="2">员工B</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="联系人">
                  {getFieldDecorator('linkMan', {
                    rules: [{ required: false, message: '请输入联系人' }],
                  })(<Input placeholder="请输入联系人" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="移动电话">
                  {getFieldDecorator('mobilePhone', {
                    rules: [{ required: false, message: '请输入移动电话' }],
                  })(<Input placeholder="请输入移动电话" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="电话">
                  {getFieldDecorator('phone', {
                    rules: [{ required: false, message: '请输入电话' }],
                  })(<Input placeholder="请输入电话" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="电子邮箱">
                  {getFieldDecorator('email', {
                    rules: [{ required: false, message: '请输入电子邮箱' }],
                  })(<Input placeholder="请输入电子邮箱" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="邮政编码">
                  {getFieldDecorator('postalCode', {
                    rules: [{ required: false, message: '请输入邮政编码' }],
                  })(<Input placeholder="请输入邮政编码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="传真">
                  {getFieldDecorator('fax', {
                    rules: [{ required: false, message: '请输入传真' }],
                  })(<Input placeholder="请输入传真" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="海关编码">
                  {getFieldDecorator('customsCode', {
                    rules: [{ required: false, message: '请输入海关编码' }],
                  })(<Input placeholder="请输入海关编码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="EDI编码">
                  {getFieldDecorator('ediCode', {
                    rules: [{ required: false, message: '请输入EDI编码' }],
                  })(<Input placeholder="请输入EDI编码" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="税务编码">
                  {getFieldDecorator('taxCode', {
                    rules: [{ required: false, message: '请输入税务编码' }],
                  })(<Input placeholder="请输入税务编码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="详细地址">
                  {getFieldDecorator('address', {
                    rules: [{ required: false, message: '请输入详细地址' }],
                  })(<TextArea placeholder="请输入详细地址" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="网站首页">
                  {getFieldDecorator('url', {
                    rules: [{ required: false, message: '请输入网站首页' }],
                  })(<Input placeholder="请输入网站首页" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={21} pull={3}>
                <Form.Item {...formItemLayout} label="备注">
                  {getFieldDecorator('remark')(<TextArea placeholder="请输入备注信息" rows={2} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['fn-mb-15']}>
              <Col span={24}>
                <div>
                  <Card>
                    <div>
                      <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                        选择合伙人
                      </Button>
                      {/*// 表格默认无数据，点击添加合伙人按钮 弹出 合伙人Modal，选择后添加到Table表格*/}
                      <Table dataSource={dataSource} columns={columns} />
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>
          </Form>
          <PartnerType {...parentMethods} partnerTypeVisible={partnerTypeVisible} />
        </Card>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(DepartmentAddModal));
