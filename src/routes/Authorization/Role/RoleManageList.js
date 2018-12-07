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
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import styles from './style.less';
import AssignPermissionsModal from './AssignPermissionsModal';
import RoleManageAddModal from './RoleManageAddModal';
import AssignUserModal from './AssignUserModal';
import RoleManageViewModal from './RoleManageViewModal';
import RoleManageEditModal from './RoleManageEditModal';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
export default class RoleManageList extends PureComponent {
  state = {
    RoleManageAddVisible: false, // 权限对象新增Modal显隐
    RoleManageViewVisible: false, // 权限对象查看Modal显隐
    RoleManageEditVisible: false, // 权限对象编辑Modal显隐
    AssignPermissionsVisible: false, // 分配权限modal显隐
    AssignUserVisible: false, // 分配角色modal显隐
    rowInfo: null, // 操作按钮行的数据
    selectedRows: [], // 选中的行
    formValues: {}, // 查询输入框中的val
    currentPagination: [], // 获取当前第几页和页大小
   /* permList: [], // 点击分配权限关系modal时，获取当前角色有的权限的id集合*/
  };

  // 加载页面时，加载数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
      payload: {},
      callback: res => {
        console.log(res.data);
        if (res.meta.status !== '000000') {
          message.error(res.data.alert_msg);
        }
      },
    });
  }

  // 分页器方法
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state; // 拿到搜索框中的值
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.setState({
      currentPagination: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
      },
    });
    dispatch({
      type: 'role/fetch',
      payload: params,
    });
  };

  // 重置方法
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'role/fetch',
      payload: {},
    });
  };

  // 批量操作方法 删除
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'role/remove',
          payload: {
            ids: selectedRows.map(row => row.id).join(','),
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

  // 选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 查询方法
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      console.log(values);
      dispatch({
        type: 'role/fetch',
        payload: values,
      });
    });
  };

  // 分配权限modal显隐方法
  handleAssignPermissionsVisible = (flag, record) => {
    /*this.props.dispatch({
      type: 'rolePerm/fetch',
      payload: {},
      callback: (res) => {
        if (res.meta.status !== "000000") {
          message.error(res.data.alert_msg);
        } else {
          const resVal = res.data.list;
          if (resVal) {
            this.setState({
              permList: resVal.map(item => item.permId ),
            })
          }
        }
      },
    });*/
    this.setState({
      AssignPermissionsVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  // 分配用户modal显隐方法
  handleAssignUserVisible = (flag,record) => {
    this.setState({
      AssignUserVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  // 角色 <新增> modal显隐方法
  handleRoleManageAddVisible = flag => {
    this.setState({
      RoleManageAddVisible: !!flag,
    });
  };

  // 角色 <查看> modal显隐方法
  handleRoleManageViewVisible = (flag, record) => {
    this.setState({
      RoleManageViewVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  // 角色 <编辑> modal显隐方法
  handleRoleManageEditVisible = (flag, record) => {
    this.setState({
      RoleManageEditVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  // 角色 <删除> 方法
  handleDeleteRoleManage = (flag, record) => {
    this.props.dispatch({
      type: 'role/remove',
      payload: {
        id: record.id,
        uid: JSON.parse(localStorage.getItem("user")).id,
      },
      callback: (res) => {
        if (res.meta.status === "000000") {
          this.setState({
            selectedRows: [],
          });
          message.success('删除成功!');
          this.props.dispatch({
            type: 'role/fetch',
            payload: {
              page: this.state.currentPagination.pageSize,
              pageSize: this.state.currentPagination.pageSize,
              keyWord: this.state.formValues.keyWord,
            },
          });
        } else {
          message.error(res.data.alert_msg);
        }
      },
    });
  };

  // 查询控件
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyWord')(
                <Input placeholder="关键字" />
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
  render() {
    const { role: { data }, loading } = this.props;
    const {
      selectedRows,
      RoleManageAddVisible,
      RoleManageViewVisible,
      AssignPermissionsVisible,
      RoleManageEditVisible,
      rowInfo,
      AssignUserVisible,
      currentPagination,
      permList,
    } = this.state;
    const columns = [
      {
        title: '编号',
        dataIndex: 'number',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '说明',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleRoleManageViewVisible(true, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleRoleManageEditVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除?"
              onConfirm={() => this.handleDeleteRoleManage(true, record)}
              okText="是"
              cancelText="否"
            >
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => this.handleAssignPermissionsVisible(true, record)}>分配权限</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleAssignUserVisible(true, record)}>分配用户</a>
          </Fragment>
        ),
      },
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

    const AssignUserMethods = {
      handleAssignUserVisible: this.handleAssignUserVisible,
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
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleRoleManageAddVisible(true)}
                >
                  新建角色
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
            <AssignPermissionsModal
              {...AssignPermissionsMethods}
              AssignPermissionsVisible={AssignPermissionsVisible}
              rowInfo={rowInfo}
              permList={permList}
            />
            <AssignUserModal
              {...AssignUserMethods}
              AssignUserVisible={AssignUserVisible}
              rowInfo={rowInfo}
            />
            <RoleManageAddModal
              {...RoleManageAddMethods}
              RoleManageAddVisible={RoleManageAddVisible}
              currentPagination={currentPagination}
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
              currentPagination={currentPagination}
            />
          </div>
        </Card>
      </div>
    );
  }
}
