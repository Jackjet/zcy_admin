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
  Modal,
  message,
  Divider,
  Badge,
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import BusinessAddModal from './OpportunityAddModal.js';
import BusinessFollowUp from './OpportunityFollowUp';
import BusinessEditModal from './OpportunityEditModal.js';
import BusinessOppView from './OpportunityViewModal.js';
import BusinessStateModal from './OpportunityStateModal';
//import ProjectAddModal from '../Project/ProInfoManage/ProAddModal.js';

const statusMap = ['success', 'warning', 'default'];
const status = ['已跟进', '未分配', '已分配'];
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ opportunity, loading }) => ({
  opportunity,
  loading: loading.models.opportunity,
}))
@Form.create()
export default class BusinessOpportunity extends PureComponent {
  state = {
    businessOppVisible: false,
    businessViewVisible: false,
    businessEditVisible: false,
    followUpVisible: false,
    businessStateVisible: false,
    projectVisible: false,
    selectedRows: [],
    formValues: {},
    rowInfo: [],
    openKeys: ['sub1'],
    pageCurrent: ``,
    pageSizeCurrent: ``,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'opportunity/fetch',
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

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

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
      type: 'opportunity/fetch',
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
      type: 'opportunity/fetch',
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

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'company/remove',
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
        this.handleBusinessViewVisible(true);
        break;
      default:
        break;
    }
  };

  handleDeleteClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'company/remove',
      payload: {
        no: selectedRows.map(row => row.no).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
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
        type: 'opportunity/fetch',
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
  // 隐藏和显示
  handleBusinessOppVisible = flag => {
    this.setState({
      businessOppVisible: !!flag,
    });
    if (!flag) {
      this.props.dispatch({
        type: 'opportunity/fetch',
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

  handleFollowUpVisible = flag => {
    this.setState({
      followUpVisible: !!flag,
    });
  };

  handleBusinessViewVisible = flag => {
    this.setState({
      businessViewVisible: !!flag,
    });
  };

  handleBusinessStateVisible = flag => {
    this.setState({
      businessStateVisible: !!flag,
    });
  };

  handleProjectVisible = flag => {
    const { selectedRows, rowInfo } = this.state;
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    if (this.state.selectedRows.length === 0) {
      message.warning('请选择商机');
      return false;
    }
    this.setState({
      projectVisible: !!flag,
      rowInfo: selectedRows[0],
    });
  };

  handleBusinessEditVisible = flag => {
    this.setState({
      businessEditVisible: !!flag,
    });
    if (!flag) {
      this.props.dispatch({
        type: 'opportunity/fetch',
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
  // 添加表单数据


  // 左边菜单树
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
              <span>商机状态</span>
            </span>
          }
        >
          <Menu.Item key="1">初期沟通</Menu.Item>
          <Menu.Item key="2">立项评估</Menu.Item>
          <Menu.Item key="3">需求分析</Menu.Item>
          <Menu.Item key="4">方案制定</Menu.Item>
          <Menu.Item key="5">招投标/竞争</Menu.Item>
          <Menu.Item key="6">商务谈判</Menu.Item>
          <Menu.Item key="7">合同签约</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }

  showViewMessage = (flag, record) => {
    this.setState({
      businessViewVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage = (flag, record) => {
    this.setState({
      businessEditVisible: !!flag,
      rowInfo: record,
    });
  };

  showFollowUpMessage = (flag, record) => {
    this.setState({
      followUpVisible: !!flag,
      rowInfo: record,
    });
  };

  // 简单查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem label="编码">
              {getFieldDecorator('code')(<Input placeholder="请输入编码" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('customerName')(<Input placeholder="请输入客户名称" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="商机来源">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="xiao">请选择</Option>
                  <Option value="z">朋友介绍</Option>
                  <Option value="f">第三方网站</Option>
                  <Option value="fd">其它</Option>
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
                清空
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { opportunity: { data }, loading } = this.props;
    const {
      selectedRows,
      businessOppVisible,
      businessViewVisible,
      businessEditVisible,
      followUpVisible,
      rowInfo,
      businessStateVisible,
      projectVisible,
    } = this.state;

    const columns = [
      {
        title: '编号',
        dataIndex: 'number',
      },
      {
        title: '项目编号',
        dataIndex: 'number',
      },
      {
        title: '商机名称',
        dataIndex: 'name',
      },
      {
        title: '客户名称',
        dataIndex: 'name',
      },

      {
        title: '联系电话',
        dataIndex: 'phone',
      },

      {
        title: '执行人',
        dataIndex: 'assignor',
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
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '客户需求',
        dataIndex: 'customerDemand',
      },
      {
        title: '操作',
        width: 180,
        render: (text, record) => (
          <Fragment>
            {record.status === `0` && (
              <div>
                <a onClick={() => this.showViewMessage(true, record)}>查看</a>
              </div>
            )}
            {record.status === `1` && (
              <div>
                <a onClick={() => this.showViewMessage(true, record)}>查看</a>
                <Divider type="vertical" />
                <a onClick={() => this.showEditMessage(true, record)}>商机分配</a>
              </div>
            )}
            {record.status === `2` && (
              <div>
                <a onClick={() => this.showViewMessage(true, record)}>查看</a>
                <Divider type="vertical" />
                <a onClick={() => this.showFollowUpMessage(true, record)}>跟进</a>
              </div>
            )}
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleBusinessOppVisible: this.handleBusinessOppVisible,
      handleFollowUpVisible: this.handleFollowUpVisible,
      handleBusinessViewVisible: this.handleBusinessViewVisible,
      handleBusinessEditVisible: this.handleBusinessEditVisible,
      handleBusinessStateVisible: this.handleBusinessStateVisible,
      handleProjectVisible: this.handleProjectVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={() => this.handleBusinessOppVisible(true)}>
                  新建商机
                </Button>
                <Button type="primary" onClick={() => this.handleProjectVisible(true)}>
                  新建项目
                </Button>
                <Button type="primary" onClick={() => this.handleBusinessStateVisible(true)}>
                  状态标示
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
        </Card>
        <BusinessAddModal {...parentMethods} businessOppVisible={businessOppVisible} />
        <BusinessFollowUp
          {...parentMethods}
          followUpVisible={followUpVisible}
          rowInfo={rowInfo}
        />
        <BusinessOppView
          {...parentMethods}
          businessViewVisible={businessViewVisible}
          rowInfo={rowInfo}
        />
        <BusinessEditModal
          {...parentMethods}
          businessEditVisible={businessEditVisible}
          rowInfo={rowInfo}
        />
        <BusinessStateModal {...parentMethods} businessStateVisible={businessStateVisible} />
        {/*<ProjectAddModal {...parentMethods} projectVisible={projectVisible} rowInfo={rowInfo} />*/}
      </PageHeaderLayout>
    );
  }
}
