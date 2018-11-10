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
  message,
  Divider,
  Popconfirm,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import styles from './Style.less';
import AssignPermissionsModal from '../Role/AssignPermissionsModal';
import RoleManageAddModal from '../Role/RoleManageAddModal';
import AssignRoleModal from '../Role/AssignRoleModal';
import RoleManageViewModal from '../Role/RoleManageViewModal';
import RoleManageEditModal from '../Role/RoleManageEditModal';

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
export default class ObjManageList extends PureComponent {
  state = {
    RoleManageAddVisible: false,
    RoleManageViewVisible: false,
    RoleManageEditVisible: false,
    AssignPermissionsVisible: false,
    AssignRoleVisible: false,
    rowInfo: ``,
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

  handleAssignPermissionsVisible = flag => {
    this.setState({
      AssignPermissionsVisible: !!flag,
    });
  };

  handleAssignRoleVisible = flag => {
    this.setState({
      AssignRoleVisible: !!flag,
    });
  };

  handleRoleManageAddVisible = flag => {
    this.setState({
      RoleManageAddVisible: !!flag,
    });
  };

  handleRoleManageViewVisible = flag => {
    this.setState({
      RoleManageViewVisible: !!flag,
    });
  };

  handleRoleManageEditVisible = flag => {
    this.setState({
      RoleManageEditVisible: !!flag,
    });
  };

  showViewMessage = (flag, text, record) => {
    this.setState({
      RoleManageViewVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage = (flag, record) => {
    this.setState({
      RoleManageEditVisible: !!flag,
      rowInfo: record,
    });
  };

  showDeleteMessage = (flag, record) => {
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
            <FormItem label="编码">
              {getFieldDecorator('code')(<Input placeholder="请输入编码" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入名称" />)}
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
    const {
      selectedRows,
      RoleManageAddVisible,
      RoleManageViewVisible,
      AssignPermissionsVisible,
      RoleManageEditVisible,
      rowInfo,
      AssignRoleVisible,
    } = this.state;

    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
      },
      {
        title: '名称',
        dataIndex: 'Name',
      },
      {
        title: '路径',
        dataIndex: 'path',
      },
      {
        title: '上级',
        dataIndex: 'superior',
      },
      {
        title: '操作类型',
        dataIndex: 'actionType',
      },
      /*{
        title: '操作',
        render: (text, record, index) => (
          <Fragment>
            <a onClick={() => this.showViewMessage(true, text, record, index)}>查看权限</a>
            <Divider type="vertical" />
            <a onClick={() =>this.showEditMessage(true, record)} >编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除?" onConfirm={() =>this.showDeleteMessage(true, record)} okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() =>this.handleAssignPermissionsVisible(true)} >分配权限</a>
            <Divider type="vertical" />
            <a onClick={() =>this.handleAssignRoleVisible(true)} >分配用户</a>
          </Fragment>
        ),
      },*/
    ];

    const batchMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const AssignPermissionsMethods = {
      handleAssignPermissionsVisible: this.handleAssignPermissionsVisible,
    };

    const AssignRoleMethods = {
      handleAssignRoleVisible: this.handleAssignRoleVisible,
    };

    const RoleManageAddMethods = {
      handleRoleManageAddVisible: this.handleRoleManageAddVisible,
    };

    const RoleManageViewMethods = {
      handleRoleManageViewVisible: this.handleRoleManageViewVisible,
    };

    const RoleManageEditMethods = {
      handleRoleManageEditVisible: this.handleRoleManageEditVisible,
    };

    return (
      <div>
        <Card bordered={false}>
          <div>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {/*<Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleRoleManageAddVisible(true)}
                >
                  新建角色
                </Button>*/}
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
            <AssignPermissionsModal
              {...AssignPermissionsMethods}
              AssignPermissionsVisible={AssignPermissionsVisible}
            />
            <AssignRoleModal {...AssignRoleMethods} AssignRoleVisible={AssignRoleVisible} />
            <RoleManageAddModal
              {...RoleManageAddMethods}
              RoleManageAddVisible={RoleManageAddVisible}
            />
            <RoleManageViewModal
              {...RoleManageViewMethods}
              RoleManageViewVisible={RoleManageViewVisible}
              rowInfo={rowInfo}
            />
            <RoleManageEditModal
              {...RoleManageEditMethods}
              RoleManageEditVisible={RoleManageEditVisible}
              rowInfo={rowInfo}
            />
          </div>
        </Card>
      </div>
    );
  }
}
