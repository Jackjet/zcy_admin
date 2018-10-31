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
import StandardTable from '../../../../components/StandardTable/index';
import styles from './OrgUnitList.less';
import OrgUnitAddModal from '../add/OrgUnitAddModal';
import OrgUnitViewModal from '../select/OrgUnitViewModal';
import OrgUnitEditModal from '../edit/OrgUnitEditModal';

const industry =['否','是'];
const { Content, Sider } = Layout;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ company, loading }) => ({
  company,
  loading: loading.models.company,
}))
@Form.create()
export default class OrgUnitList extends PureComponent {
  state = {
    OrgUnitAddVisible: false,
    OrgUnitViewVisible: false,
    OrgUnitEditVisible: false,
    rowInfo:``,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    openKeys: ['sub1'],
    pageCurrent:``,
    pageSizeCurrent:``,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {

        }else{
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
      type: 'company/fetch',
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
      type: 'company/fetch',
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
          type: 'company/removeMore',
          payload: {
            ids : selectedRows.map(row =>  row.id ).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
            this.props.dispatch({
              type: 'company/fetch',
              payload: {
                page: 1,
                pageSize: 10,
              },
            })
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
        type: 'company/fetch',
        payload: values,
      });
    });
  };

  handleOrgUnitAddVisible = flag => {
    this.setState({
      OrgUnitAddVisible: !!flag,
    });
    if(!flag){
      this.props.dispatch({
        type: 'company/fetch',
        payload: {
          page: this.state.pageCurrent,
          pageSize: this.state.pageSizeCurrent,
        },
       /* callback: (res) => {
          if(res.meta.status !== '000000' ) {

           // this.props.data = res.data;
          }
        },*/
      })
    }
  };

  handleOrgUnitViewVisible = flag => {
    this.setState({
      OrgUnitViewVisible: !!flag,
    });
  };

  handleOrgUnitEditVisible = flag => {
    this.setState({
      OrgUnitEditVisible: !!flag,
    });
    if(!flag){
      this.props.dispatch({
        type: 'company/fetch',
        payload: {
          page: 1,
          pageSize: 10,
        },
      })
    }
  };

  showViewMessage =(flag, text, record)=> {
    this.setState({
      OrgUnitViewVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage =(flag, record)=> {
    this.setState({
      OrgUnitEditVisible: !!flag,
      rowInfo: record,
    });
  };

  showDeleteMessage =(flag, record)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/remove',
      payload: {
        id: record.id,
        deleteFlag: 0,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'company/fetch',
          payload: {
            page: this.state.pageCurrent,
            pageSize: this.state.pageSizeCurrent,
          },
        });
        message.success('删除成功!');
      },
    });
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
    const { company: { data }, loading } = this.props;
    const { selectedRows, OrgUnitAddVisible, OrgUnitViewVisible, OrgUnitEditVisible, rowInfo } = this.state;

    const columns = [
      {
        title: '组织编号',
        dataIndex: 'number',
      },
      {
        title: '组织名称',
        dataIndex: 'name',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '负责人',
        dataIndex: 'principal',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '分公司',
        dataIndex: 'isBranch',
        align: 'center',
        width: 100,
        filters: [
          {
            text: industry[0],
            value: 0,
          },
          {
            text: industry[1],
            value: 1,
          },
        ],
        onFilter: (value, record) => record.industry.toString() === value,
        render(val) {
          return <Badge status text={industry[val]} />;
        },
      },
      {
        title: '地址',
        dataIndex: 'address',
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

    const OrgUnitAddMethods = {
      handleOrgUnitAddVisible: this.handleOrgUnitAddVisible,
    };

    const OrgUnitViewMethods = {
      handleOrgUnitViewVisible: this.handleOrgUnitViewVisible,
    };

    const OrgUnitEditMethods = {
      handleOrgUnitEditVisible: this.handleOrgUnitEditVisible,
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
                    onClick={() => this.handleOrgUnitAddVisible(true)}
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
          <OrgUnitAddModal {...OrgUnitAddMethods} OrgUnitAddVisible={OrgUnitAddVisible} />
          <OrgUnitViewModal {...OrgUnitViewMethods} OrgUnitViewVisible={OrgUnitViewVisible} rowInfo={rowInfo} />
          <OrgUnitEditModal {...OrgUnitEditMethods} OrgUnitEditVisible={OrgUnitEditVisible} rowInfo={rowInfo} />
        </Card>
      </div>
    );
  }
}
