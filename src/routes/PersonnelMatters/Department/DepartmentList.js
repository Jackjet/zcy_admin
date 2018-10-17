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
  message,
  Divider,
  Popconfirm,
  Layout,
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import styles from './DepartmentList.less';
import DepartmentAddModal from './DepartmentAddModal';
import DepartmentViewModal from '../../staff/DepartmentManage/select/DepartmentViewModal';
import DepartmentEditModal from '../../staff/DepartmentManage/edit/DepartmentEditModal';

const { Content, Sider } = Layout;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class DepartmentList extends PureComponent {
  state = {
    DepartmentAddVisible: false,
    DepartmentViewVisible: false,
    DepartmentEditVisible: false,
    rowInfo:``,
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

  rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

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

  handleDepartmentAddVisible = flag => {
    this.setState({
      DepartmentAddVisible: !!flag,
    });
  };

  handleDepartmentViewVisible = flag => {
    this.setState({
      DepartmentViewVisible: !!flag,
    });
  };

  handleDepartmentEditVisible = flag => {
    this.setState({
      DepartmentEditVisible: !!flag,
    });
  };

  showViewMessage =(flag, text, record)=> {
    this.setState({
      DepartmentViewVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage =(flag, record)=> {
    this.setState({
      DepartmentEditVisible: !!flag,
      rowInfo: record,
    });
  };

  showDeleteMessage =(flag, record)=> {
    this.props.dispatch({
      type: 'rule/remove',
      payload: {
        organizeCode: record.organizeCode,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        message.success('删除成功!');
      },
    });
  };

  confirm = () => {
    message.success('Click on Yes');
  };

  cancel = () => {
    message.error('Click on No');
  };

  rootSubmenuKeys = ['sub1'];

  treeMenu() {
    const { SubMenu } = Menu;
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
              <span>至诚</span>
            </span>
          }
        >
          <Menu.Item key="1">浙江至诚会计师事务所有限公司</Menu.Item>
          <Menu.Item key="2">杭州至诚税务师事务所有限公司</Menu.Item>
          <Menu.Item key="3">浙江中嘉资产评估有限公司</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('no')(
                <Input placeholder="请输入编码名称" />
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows, DepartmentAddVisible, DepartmentViewVisible, DepartmentEditVisible, rowInfo } = this.state;

    const columns = [
      {
        title: '部门编号',
        dataIndex: 'organizeCode',
      },
      {
        title: '部门名称',
        dataIndex: 'departmentName',
      },
      {
        title: '上级部门',
        dataIndex: 'superiorDepartment',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '所属公司',
        dataIndex: 'company',
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <Fragment>
            <a onClick={() => this.showViewMessage(true, text, record, index)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() =>this.showEditMessage(true, record)} >编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除?" onConfirm={() =>this.showDeleteMessage(true, record)} okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Dropdown overlay={downMenu}>
              <a>
                更多 <Icon type="down" />
              </a>
            </Dropdown>
          </Fragment>
        ),
      },
    ];

    const downMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="turnOn">停用</Menu.Item>
        <Menu.Item key="turnOff">启用</Menu.Item>
      </Menu>
    );

    const batchMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const DepartmentAddMethods = {
      handleDepartmentAddVisible: this.handleDepartmentAddVisible,
    };

    const DepartmentViewMethods = {
      handleDepartmentViewVisible: this.handleDepartmentViewVisible,
    };

    const DepartmentEditMethods = {
      handleDepartmentEditVisible: this.handleDepartmentEditVisible,
    };



    return (
      <div>
        <Card bordered={false}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={140} style={{ background: '#fff' }}>
              {this.treeMenu()}
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280}}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.handleDepartmentAddVisible(true)}
                  >
                    新建
                  </Button>
                  {selectedRows.length > 0 && (
                    <span>
                      <Dropdown overlay={batchMenu}>
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
            </Content>
          </Layout>
          <DepartmentAddModal {...DepartmentAddMethods} DepartmentAddVisible={DepartmentAddVisible} />
          <DepartmentViewModal {...DepartmentViewMethods} DepartmentViewVisible={DepartmentViewVisible} rowInfo={rowInfo} />
          <DepartmentEditModal {...DepartmentEditMethods} DepartmentEditVisible={DepartmentEditVisible} rowInfo={rowInfo} />
        </Card>
      </div>
    );
  }
}
