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
  Badge,
  Modal,
} from 'antd';
import moment from 'moment/moment';
import StandardTable from '../../../components/StandardTable';
import styles from './DepartmentList.less';
import DepartmentAddModal from './DepartmentAddModal';
import DepartmentViewModal from './DepartmentViewModal';
import DepartmentEditModal from './DepartmentEditModal';

const { confirm } = Modal;
const statusMap = ['error', 'success', 'processing'];
const statusText = ['禁用', '启用', '提交'];
const { Content, Sider } = Layout;
const FormItem = Form.Item;
message.config({
  top: 100, // 提示框弹出位置
  duration: 3, // 自动关闭延时，单位秒
  maxCount: 1, // 最大显示数目
});
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ dept, loading }) => ({
  dept,
  loading: loading.models.dept,
}))
@Form.create()
export default class DepartmentList extends PureComponent {
  state = {
    DepartmentAddVisible: false,
    DepartmentViewVisible: false,
    DepartmentEditVisible: false,
    rowInfo: ``,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    openKeys: ['sub1'],
    pageCurrent: ``,
    pageSizeCurrent: ``,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dept/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: res => {
        if (res.meta.status !== '000000') {
          console.log(res.meta.status);
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

  rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

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
      type: 'dept/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { dispatch } = this.props;
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'dept/fetch',
      payload: {},
      callback: res => {
        if (res.meta.status !== '000000') {
          message.error(res.meta.errmsg);
        } else {
          message.success('重置完成!');
        }
      },
    });
  }; // 搜索的重置方法

  handleMenuClick = e => {
    const thisParam = this;
    const nameCompany = thisParam.state.selectedRows.map(row => row.name).join(`,\n`);
    switch (e.key) {
      case 'remove':
        confirm({
          title: '确定删除以下部门?',
          content: (
            <div>
              <p>部门名称: {nameCompany}</p>
              <p>操作人:当前登录用户</p>
              <p>时间:{moment().format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          ),
          onOk() {
            thisParam.props.dispatch({
              type: 'dept/removeMore',
              payload: {
                ids: thisParam.state.selectedRows.map(row => row.id).join(','),
              },
              callback: () => {
                thisParam.setState({
                  selectedRows: [],
                });
                thisParam.props.dispatch({
                  type: 'dept/fetch',
                  payload: {
                    page: thisParam.state.pageCurrent,
                    pageSize: thisParam.state.pageSizeCurrent,
                  },
                });
                message.success('部门已删除');
              },
            });
          },
          onCancel() {
            console.log('Cancel');
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
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'dept/fetch',
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

  handleDepartmentAddVisible = flag => {
    this.setState({
      DepartmentAddVisible: !!flag,
    });
    if (!flag) {
      this.props.dispatch({
        type: 'dept/fetch',
        payload: {
          page: this.state.pageCurrent,
          pageSize: this.state.pageSizeCurrent,
        },
        callback: res => {
          if (res.meta.status !== '000000') {
            message.error(res.meta.errmsg); // 返回错误信息
          }
        },
      });
    }
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
    if (!flag) {
      this.props.dispatch({
        type: 'dept/fetch',
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

  showViewMessage = (flag, text, record) => {
    this.setState({
      DepartmentViewVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage = (flag, record) => {
    this.setState({
      DepartmentEditVisible: !!flag,
      rowInfo: record,
    });
  };

  showDeleteMessage = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dept/remove',
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
            type: 'dept/fetch',
            payload: {
              page: this.state.pageCurrent,
              pageSize: this.state.pageSizeCurrent,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('公司删除成功!');
        }
      },
    });
  };

  handleCancelCancel = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dept/cancelCancel',
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
          type: 'dept/fetch',
          payload: {
            page: this.state.pageCurrent,
            pageSize: this.state.pageSizeCurrent,
            keyWord: this.state.formValues.keyWord,
          },
        });
        message.success('部门启用成功!');
      },
    });
  }; // 部门状态启用方法

  handleCancel = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dept/cancel',
      payload: {
        id: record.id,
        status: 0,
      },
      callback: res => {
        if (res.meta.status !== '000000') {
          message.error('res.meta'); // 返回错误信息
        }
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'dept/fetch',
          payload: {
            page: this.state.pageCurrent,
            pageSize: this.state.pageSizeCurrent,
            keyWord: this.state.formValues.keyWord,
          },
        });
        message.warning('部门已禁用!');
      },
    });
  }; // 部门状态禁用方法

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
    const { dept: { data }, loading } = this.props;
    const {
      selectedRows,
      DepartmentAddVisible,
      DepartmentViewVisible,
      DepartmentEditVisible,
      rowInfo,
    } = this.state;

    const columns = [
      {
        title: '部门编号',
        dataIndex: 'number',
      },
      {
        title: '部门名称',
        dataIndex: 'name',
      },
      {
        title: '上级部门',
        dataIndex: 'parentId',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
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
        ],
        onFilter: (value, record) => record.industry.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={statusText[val]} />;
        },
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <Fragment>
            <a onClick={() => this.showViewMessage(true, text, record, index)}>查看</a>

            {(statusText[record.status] === `提交` || statusText[record.status] === `禁用`) && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => this.showEditMessage(true, record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="确认删除?"
                  onConfirm={() => this.showDeleteMessage(true, record)}
                  okText="是"
                  cancelText="否"
                >
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a onClick={() => this.handleCancelCancel(record)}>启用</a>
              </span>
            )}
            {statusText[record.status] === `启用` && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => this.handleCancel(record)}>禁用</a>
              </span>
            )}
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

    const parentMethods = {
      handleDepartmentViewVisible: this.handleDepartmentViewVisible,
      handleDepartmentEditVisible: this.handleDepartmentEditVisible,
      handleDepartmentAddVisible: this.handleDepartmentAddVisible,
    };
    return (
      <div>
        <Card bordered={false}>
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
          <DepartmentAddModal {...parentMethods} DepartmentAddVisible={DepartmentAddVisible} />
          <DepartmentViewModal
            {...parentMethods}
            DepartmentViewVisible={DepartmentViewVisible}
            rowInfo={rowInfo}
          />
          <DepartmentEditModal
            {...parentMethods}
            DepartmentEditVisible={DepartmentEditVisible}
            rowInfo={rowInfo}
          />
        </Card>
      </div>
    );
  }
}
