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
  Popover,
  Tree,
  Checkbox,
  Button,
  Table,
  Popconfirm,
  Divider,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';


const CheckboxGroup = Checkbox.Group;
const mockData = [];
for (let i = 0; i < 10; i+=1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
};
import EditableCell from '../EditableTable/EditableCell';

const { Search } = Input;
const { TreeNode } = Tree;
const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  visitors: '拜访对象',
  visitType: '拜访方式',
  connectBusiness: '关联商机',
  visitDate: '拜访日期',
  communication: '交流内容',
  participants: '参与人员',
  remarks: '备注',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

class CodeRuleAddModal extends PureComponent {
  state = {
    width: '90%',
    selectedKeys: [],
    targetKeys: [],
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

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting, CodeRuleAddVisible, handleCodeRuleAddVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { selectedKeys, dataSource } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'company/add',
            payload: values,
            callback: (res) => {
              if(res.meta.status === '000000' ) {
                handleCodeRuleAddVisible(false);
              } else {
                message.error(res.meta.errmsg);
              }
            },
          });

        }
      });
    };
    const cancel = () => {
      handleCodeRuleAddVisible(false)
    };
    const plainOptions = [ '新增显示'];
/*
    const plainOptions = ['不允许断号', '新增显示', '支持修改','新增显示且不允许断号'];
*/
    const columns = [
      {
        title: '业务类别',
        dataIndex: 'name',
        render: () => (
          <Select defaultValue="固定值">
            <Option key={1}>固定值</Option>
            <Option key={2}>系统日期</Option>
            <Option key={3}>顺序号</Option>
            <Option key={4}>属性值</Option>
          </Select>
        ),
      },
      {
        title: '显示格式',
        dataIndex: 'phone',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'phone')} />
        ),
      },
      {
        title: '长度',
        dataIndex: 'remarks',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'remarks')} />
        ),
      },
      {
        title: '初始值',
        dataIndex: 'remarks',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'remarks')} />
        ),
      },
      {
        title: '步长',
        dataIndex: 'remarks',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'remarks')} />
        ),
      },
      {
        title: '操作',
        width: 100,
        dataIndex: 'operation',
        render: (text, record) => {
          return this.state.dataSource.length > 1 ? (
            <span>
              <a onClick={this.handleAdd}>+</a>
              <Divider type="vertical" />
              <a onClick={() => this.onDelete(record.key)}>-</a>
            </span>
          ) : (
            <a onClick={this.handleAdd}>+</a>
          );
        },
      },
    ];
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="编码规则新增"
        style={{ top: 20 }}
        // 对话框是否可见
        visible={CodeRuleAddVisible}
        width="65%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={cancel}
        onText="提交"
        footer={[
          <Button type="primary" onClick={validate}>提交</Button>,
          <Button type="primary" onClick={cancel}>预览</Button>,
          <Button type="primary" onClick={cancel}>取消</Button>,
        ]

        }  // 在button外面加上数据，会报迭代没有设置key属性值
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="规则编码">
                    {getFieldDecorator('number', {
                      rules: [{ required: false, message: '规则编码' }],
                    })(
                      <Input placeholder="请选择拜访对象" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="规则名称">
                    {getFieldDecorator('name', {
                      rules: [{ required: false, message: '规则名称' }],
                    })(
                      <Input placeholder="请选择拜访方式" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="简短分隔符">
                    {getFieldDecorator('isBranch', {
                      rules: [{ required: false, message: '简短分隔符' }],
                    })(
                      <Select placeholder="简短分隔符">
                        <Option value="0">-</Option>
                        <Option value="1">_</Option>
                        <Option value="8">,</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="业务对象">
                    {getFieldDecorator('visitDate', {
                      rules: [{ required: false, message: '业务对象' }],
                    })(
                      <Input placeholder="业务对象" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="应用字段">
                    {getFieldDecorator('connectBusiness', {
                      rules: [{ required: false, message: '应用字段' }],
                    })(
                      <Search placeholder="应用字段" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="创建人">
                    {getFieldDecorator('connectBusiness', {
                      rules: [{ required: false, message: '创建人' }],
                    })(
                      <Input placeholder="创建人" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={15} pull={2}>
                  <Form.Item {...formItemLayout} label="创建公司">
                    {getFieldDecorator('communication')(
                      <Input placeholder="创建公司" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label='参与人员'>
                    {getFieldDecorator('assignor', {
                    })(
                      <CheckboxGroup disabled options={plainOptions} defaultValue={['新增显示']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label="编码示例" >
                    {getFieldDecorator('personal', {
                    })(
                      <Input placeholder="编码示例" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label="编码长度">
                    {getFieldDecorator('remarks')(
                      <Input placeholder="编码长度" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div>
                    <Table
                      bordered={true}
                      dataSource={dataSource}
                      columns={columns}
                    />
                  </div>
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
}))(Form.create()(CodeRuleAddModal));
