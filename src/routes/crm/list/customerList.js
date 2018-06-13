import React, { PureComponent, Fragment } from 'react';

import { connect } from 'dva';
import moment from 'moment';

import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './customerList.less';
import CustomerAdd from '../add/CustomerAdd2.js';
import ConstactsAdd from '../add/ContactsAdd.js';
import CheckTabs from './CheckTabs.js';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      title="客户基本信息新增"
      style={{ top: 20 }}
      visible={modalVisible}
      mask={'true'}
      width={'90%'}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <CustomerAdd />
    </Modal>
  );
});

const CreateForm2 = Form.create()(props => {
  const { modalVisibleContact, form, handleAddContact, handleModalVisibleContact } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAddContact(fieldsValue);
    });
  };

  return (
    <Modal
      title="联系人基本信息新增"
      style={{ top: 20 }}
      visible={modalVisibleContact}
      mask={'true'}
      width={'45%'}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleModalVisibleContact()}
    >
      <ConstactsAdd />
    </Modal>
  );
});

const CreateFormCheck = Form.create()(props => {
  const { checkVisible, form, handleCheckVisible } = props;
  const okHandle = () => handleCheckVisible();
  const cancelHandle = () => handleCheckVisible();
  return (
    <Modal
      title="查看"
      style={{ top: 60 }}
      visible={checkVisible}
      mask={'true'}
      width={'60%'}
      maskClosable={false}
      onOk={okHandle}
      footer={null,
        <Button onClick={okHandle} type="primary" >知道了</Button>
      }
    >
      <CheckTabs />
    </Modal>
  );
});

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class customerList extends PureComponent {
  state = {
    modalVisible: false,
    modalVisibleContact: false,
    checkVisible:false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    openKeys: ['sub1'],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      case 'check':
        this.handleCheckVisible(true);
        break;
      case 'addContact':
        this.handleModalVisibleContact(true);
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };
  // 隐藏和显示
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleModalVisibleContact = flag => {
    this.setState({
      modalVisibleContact: !!flag,
    });
  };
  handleCheckVisible = flag => {
    this.setState({
      checkVisible: !!flag,
    });
  };
  // 添加表单数据
  handleAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };
  handleAddContact = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisibleContact: false,
    });
  };

  // 左边菜单树
  rootSubmenuKeys = ['sub1'];
  treeMenu() {
    const SubMenu = Menu.SubMenu;
    return (
      <Menu
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 130 }}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <span>客户等级</span>
            </span>
          }
        >
          <Menu.Item key="1">贵宾客户</Menu.Item>
          <Menu.Item key="2">一般客户</Menu.Item>
          <Menu.Item key="3">重要客户</Menu.Item>
          <Menu.Item key="4">潜在客户</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }

  // 简单查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem label="客户编码">
              {getFieldDecorator('no')(<Input placeholder="请输入客户编码" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('no')(<Input placeholder="请输入客户名称" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="行业">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
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
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                高级搜索
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  //高级搜索
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编码名称">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="拼音码">
              {getFieldDecorator('pinyin')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="电话号码">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="业务员">
              {getFieldDecorator('customer')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="xiao">请选择</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="行业">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
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
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 24 }} label="地址">
              {getFieldDecorator('address')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('date', {
                rules: [{ required: false, message: '请选择创建日期' }],
              })(<RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起
            </Button>
          </span>
        </div>
      </Form>
    );
  }

  // 判断简单 还是 高级搜索
  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible, modalVisibleContact,checkVisible } = this.state;

    const columns = [
      {
        title: '编号',
        dataIndex: 'no',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
      },

      {
        title: '所属公司',
        dataIndex: 'company',
      },
      {
        title: '行业',
        dataIndex: 'instruty',
      },
      {
        title: '手机',
        dataIndex: 'mobile',
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
          {
            text: status[3],
            value: 3,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a href="">编辑</a>
            <Divider type="vertical" />
            <Dropdown overlay={downhz}>
              {/* <Button className={styles.antbtngroup}>
                更多 <Icon type="down" />
              </Button>*/}
              <a>
                更多 <Icon type="down" />
              </a>
            </Dropdown>
          </Fragment>
        ),
      },
    ];

    const downhz = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="check">查看</Menu.Item>
        <Menu.Item key="del">删除</Menu.Item>
        <Menu.Item key="cancel">停用</Menu.Item>
        <Menu.Item key="cancelcancel">启用</Menu.Item>
      </Menu>
    );

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="addContact">新建联系人</Menu.Item>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleAddContact: this.handleAddContact,
      handleModalVisible: this.handleModalVisible,
      handleModalVisibleContact: this.handleModalVisibleContact,
      handleCheckVisible:this.handleCheckVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <div className={styles.tableList}>
              <div className={styles.leftBlock}>{this.treeMenu()}</div>
              <div className={styles.rightBlock}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建客户
                </Button>
                {selectedRows.length > 0 && (
                  <span>
                    <Dropdown overlay={menu}>
                      <Button>
                        批量操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
            </div>
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateForm2 {...parentMethods} modalVisibleContact={modalVisibleContact} />
        <CreateFormCheck {...parentMethods} checkVisible={checkVisible}/>
      </PageHeaderLayout>
    );
  }
}
