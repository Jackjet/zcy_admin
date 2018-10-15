import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
  DatePicker,
  Modal,
  message,
  Divider,
  Popconfirm,
  Layout,
  Badge,
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PersonAddModal from './PersonAddModal';
import PersonViewModal from './PersonViewModal';
import PersonEditModal from './PersonEditModal';
import DistributionRoleModal from './DistributionRoleModal';
import styles from './style.less';

const { Content,  Sider } = Layout;
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['离职', '在职', '已上线', '异常'];
const { Search } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class PersonManageList extends PureComponent {
  state = {
    PersonAddVisible: false,
    PersonViewVisible: false,
    PersonEditVisible: false,
    rowInfo:``,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    openKeys: ['sub1'],
    DistributionRoleVisible: false,
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

  handlePersonAddVisible = flag => {
    this.setState({
      PersonAddVisible: !!flag,
    });
  };

  handlePersonViewVisible = flag => {
    this.setState({
      PersonViewVisible: !!flag,
    });
  };

  handlePersonEditVisible = flag => {
    this.setState({
      PersonEditVisible: !!flag,
    });
  };

  showViewMessage =(flag, text, record)=> {
    this.setState({
      PersonViewVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage =(flag, record)=> {
    this.setState({
      PersonEditVisible: !!flag,
      rowInfo: record,
    });
  };

  handleDistributionRoleVisible =(flag)=> {
    this.setState({
      DistributionRoleVisible: !!flag,
    });
  };



  showDeleteMessage =(flag, record)=> {
    this.props.dispatch({
      type: 'rule/remove',
      payload: {
        no: record.no,
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
              {getFieldDecorator('no')(<Input placeholder="请输入编码名称" />)}
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
    const { selectedRows, PersonAddVisible, PersonViewVisible, PersonEditVisible, rowInfo ,DistributionRoleVisible } = this.state;
    const columns = [
      {
        title: '工号',
        dataIndex: 'no',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '性别',
        dataIndex: 'phone',
      },

      {
        title: '岗位',
        dataIndex: 'fzperson',
      },
      {
        title: '移动电话',
        dataIndex: 'company',
      },
      {
        title: '办公电话',
        dataIndex: 'address',
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
        render: (record) => (
          <Fragment>
            <a onClick={()=>this.showViewMessage(true,record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={()=>this.showEditMessage(true,record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={()=>this.showDeleteMessage(true,record)}>删除</a>
          </Fragment>
        ),
      },
    ];
    const batchMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
        <Menu.Item key="1">批量分配角色</Menu.Item>
        <Menu.Item key="2">批量分配权限</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handlePersonAddVisible: this.handlePersonAddVisible,
      handlePersonViewVisible: this.handlePersonViewVisible,
      handlePersonEditVisible: this.handlePersonEditVisible,
      handleDistributionRoleVisible :this.handleDistributionRoleVisible,
    };

    return (
      <PageHeaderLayout>
        <Card>
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
                    onClick={() => this.handlePersonAddVisible(true)}
                  >
                    新建
                  </Button>
                  {selectedRows.length > 0 && (
                    <span>
                      <Button
                        type="primary"
                      >
                        分配权限
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => this.handleDistributionRoleVisible(true)}
                      >
                        分配角色
                      </Button>
                      <Button
                        type="primary"
                      >
                        组织范围维护
                      </Button>
                      <Button type="primary" onClick={() => this.handleContactsVisible(true)}>
                        设置联系人
                      </Button>
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
          <PersonAddModal {...parentMethods} PersonAddVisible={PersonAddVisible}  />
          <PersonViewModal {...parentMethods} PersonViewVisible={PersonViewVisible} />
          <PersonEditModal {...parentMethods} PersonEditVisible={PersonEditVisible} />
          <DistributionRoleModal {...parentMethods} DistributionRoleVisible={DistributionRoleVisible} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
