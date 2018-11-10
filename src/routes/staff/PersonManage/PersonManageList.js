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
  Layout,
  Badge,
} from 'antd';
import moment from 'moment/moment';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PersonAddModal from './PersonAddModal';
import PersonViewModal from './PersonViewModal';
import PersonEditModal from './PersonEditModal';
import DistributionRoleModal from './Role/DistributionRoleModal';
import DistributionAuthorityModal from './Authority/DistributionAuthorityModal';
import BatchDisAuthorityModal from './Authority/BatchDisAuthorityModal';
import BatchDisRoleModal from './Role/BatchDisRoleModal';
import OrgRangeBill from './OrgRange/OrgRangeBill';
import styles from './style.less';

message.config({
  top: 100,
  duration: 2,
  maxCount: 1,
});
const { Content, Sider } = Layout;
const statusMap = ['default', 'success'];
const status = ['离职', '在职'];
const sexStatusMap = ['warning', 'processing'];
const sexValue = ['女', '男'];
const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ person, loading }) => ({
  person,
  loading: loading.models.person,
}))
@Form.create()
export default class PersonManageList extends PureComponent {
  state = {
    PersonAddVisible: false,
    PersonViewVisible: false,
    PersonEditVisible: false,
    rowInfo: ``,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    openKeys: ['sub1'],
    DistributionRoleVisible: false,
    BatchDisRoleVisible: false,
    DistributionAuthorityVisible: false,
    BatchDisAuthorityVisible: false,
    OrgRangeBillVisible: false,
    pageCurrent: ``,
    pageSizeCurrent: ``,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'person/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: res => {
        if (res.meta.status !== '000000') {
        } else {
          //
        }
      },
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
    const { formValues, pageCurrent, pageSizeCurrent } = this.state;
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

    this.setState({
      pageCurrent: params.page,
      pageSizeCurrent: params.pageSize,
    });

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'person/fetch',
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
      type: 'person/fetch',
      payload: {},
      callback: res => {
        if (res.meta.status !== '000000') {
          message.error(res.meta.errmsg);
        } else {
          message.success('重置完成!');
        }
      },
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const thisParam = this;
    const nameUser = thisParam.state.selectedRows.map(row => row.name).join(`,\n`);
    switch (e.key) {
      case 'remove':
        confirm({
          title: '确定删除以下公司?',
          content: (
            <div>
              <p>公司名称: {nameUser}</p>
              <p>操作人:当前登录用户</p>
              <p>时间:{moment().format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          ),
          onOk() {
            thisParam.props.dispatch({
              type: 'person/removeMore',
              payload: {
                ids: thisParam.state.selectedRows.map(row => row.id).join(','),
              },
              callback: () => {
                thisParam.setState({
                  selectedRows: [],
                });
                thisParam.props.dispatch({
                  type: 'person/fetch',
                  payload: {
                    page: 1,
                    pageSize: 10,
                  },
                });
                message.success('人员已删除');
              },
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      case '1':
        this.handleBatchDisRoleVisible(true);
        break;
      case '2':
        this.handleBatchDisAuthorityVisible(true);
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
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'person/fetch',
        payload: values,
        callback: res => {
          if (res.meta.status !== '000000') {
            message.error(res.meta.errmsg); // 返回错误信息
          } else {
            this.setState({
              selectedRows: [],
              pageCurrent: 1,
              pageSizeCurrent: res.data.pagination.pageSize,
            });
            message.success('查询完成!');
          }
        },
      });
    });
  };

  handlePersonAddVisible = flag => {
    this.setState({
      PersonAddVisible: !!flag,
    });
    if (!flag) {
      this.props.dispatch({
        type: 'person/fetch',
        payload: {
          page: 1,
          pageSize: 10,
        },
        callback: res => {
          if (res.meta.status !== '000000') {
            message.error(res.meta.errmsg); // 返回错误信息
          }
        },
      });
    }
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
    if (!flag) {
      this.props.dispatch({
        type: 'person/fetch',
        payload: {
          page: 1,
          pageSize: 10,
        },
        callback: res => {
          if (res.meta.status !== '000000') {
            message.error(res.meta.errmsg); // 返回错误信息
            // this.props.data = res.data;
          } else {
            message.success('公司更新成功!');
          }
        },
      });
    }
  };

  handleBatchDisRoleVisible = flag => {
    this.setState({
      BatchDisRoleVisible: !!flag,
    });
  };
  handleDistributionAuthorityVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      DistributionAuthorityVisible: !!flag,
    });
  };
  handleBatchDisAuthorityVisible = flag => {
    this.setState({
      BatchDisAuthorityVisible: !!flag,
    });
  };
  handleOrgRangeBillVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      OrgRangeBillVisible: !!flag,
    });
  };

  showViewMessage = (flag, record) => {
    this.setState({
      PersonViewVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage = (flag, record) => {
    this.setState({
      PersonEditVisible: !!flag,
      rowInfo: record,
    });
  };

  handleDistributionRoleVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      DistributionRoleVisible: !!flag,
    });
  };

  showDeleteMessage = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'person/remove',
      payload: {
        id: record.id,
        deleteFlag: 0,
      },
      callback: res => {
        if (res.meta.status !== '000000') {
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            selectedRows: [],
          });
          dispatch({
            type: 'person/fetch',
            payload: {
              page: this.state.pageCurrent,
              pageSize: this.state.pageSizeCurrent,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('人员删除成功!');
        }
      },
    });
  };

  handleCancelCancel = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'person/cancelCancel',
      payload: {
        id: record.id,
        status: 1,
      },
      callback: res => {
        if (res.meta.statusCode !== '000000') {
          message.error('res.meta'); // 返回错误信息
        }
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'person/fetch',
          payload: {
            page: this.state.pageCurrent,
            pageSize: this.state.pageSizeCurrent,
            keyWord: this.state.formValues.keyWord,
          },
        });
        message.config({
          top: 100, // 提示框弹出位置
          duration: 3, // 自动关闭延时，单位秒
          maxCount: 1, // 最大显示数目
        });
        message.success('人员启用成功!');
      },
    });
  }; // 公司状态启用方法
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
              {getFieldDecorator('keyWord')(<Input placeholder="请输入关键字" />)}
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
    const { person: { data }, loading } = this.props;
    const {
      selectedRows,
      PersonAddVisible,
      PersonViewVisible,
      PersonEditVisible,
      rowInfo,
      DistributionRoleVisible,
      BatchDisRoleVisible,
      DistributionAuthorityVisible,
      BatchDisAuthorityVisible,
      OrgRangeBillVisible,
    } = this.state;
    const columns = [
      {
        title: '工号',
        dataIndex: 'number',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        filters: [
          {
            text: sexValue[0],
            value: 0,
          },
          {
            text: sexValue[1],
            value: 1,
          },
        ],
        onFilter: (value, record) => record.sex.toString() === value,
        render(val) {
          return <Badge status={sexStatusMap[val]} text={sexValue[val]} />;
        },
      },
      {
        title: '岗位',
        dataIndex: 'post',
      },
      {
        title: '移动电话',
        dataIndex: 'mobilePhone',
      },
      {
        title: '办公电话',
        dataIndex: 'officePhone',
      },
      {
        title: '状态',
        dataIndex: 'personStatus',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: record => (
          <Fragment>
            <a onClick={() => this.showViewMessage(true, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.showEditMessage(true, record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.showDeleteMessage(true, record)}>删除</a>
          </Fragment>
        ),
      },
    ];
    const batchMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="cancelcancel">启用</Menu.Item>
        <Menu.Item key="cancel">禁用</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handlePersonAddVisible: this.handlePersonAddVisible,
      handlePersonViewVisible: this.handlePersonViewVisible,
      handlePersonEditVisible: this.handlePersonEditVisible,
      handleDistributionRoleVisible: this.handleDistributionRoleVisible,
      handleBatchDisRoleVisible: this.handleBatchDisRoleVisible,
      handleDistributionAuthorityVisible: this.handleDistributionAuthorityVisible,
      handleBatchDisAuthorityVisible: this.handleBatchDisAuthorityVisible,
      handleOrgRangeBillVisible: this.handleOrgRangeBillVisible,
    };

    return (
      <PageHeaderLayout>
        <Card>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={140} style={{ background: '#fff' }}>
              {this.treeMenu()}
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
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
                        onClick={() => this.handleDistributionAuthorityVisible(true)}
                      >
                        分配权限
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => this.handleDistributionRoleVisible(true)}
                      >
                        分配角色
                      </Button>
                      <Button type="primary" onClick={() => this.handleOrgRangeBillVisible(true)}>
                        组织范围维护
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
          <PersonAddModal {...parentMethods} PersonAddVisible={PersonAddVisible} />
          <PersonViewModal
            {...parentMethods}
            PersonViewVisible={PersonViewVisible}
            rowInfo={rowInfo}
          />
          <PersonEditModal
            {...parentMethods}
            PersonEditVisible={PersonEditVisible}
            rowInfo={rowInfo}
          />
          <DistributionRoleModal
            {...parentMethods}
            DistributionRoleVisible={DistributionRoleVisible}
          />
          <BatchDisRoleModal {...parentMethods} BatchDisRoleVisible={BatchDisRoleVisible} />
          <DistributionAuthorityModal
            {...parentMethods}
            DistributionAuthorityVisible={DistributionAuthorityVisible}
          />
          <BatchDisAuthorityModal
            {...parentMethods}
            BatchDisAuthorityVisible={BatchDisAuthorityVisible}
          />
          <OrgRangeBill {...parentMethods} OrgRangeBillVisible={OrgRangeBillVisible} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
