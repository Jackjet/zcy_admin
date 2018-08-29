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
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import styles from './UserList.less';

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
export default class UserList extends PureComponent {
  state = {
    OrgUnitAddVisible: false,
    OrgUnitViewVisible: false,
    OrgUnitEditVisible: false,
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

  handleOrgUnitAddVisible = flag => {
    this.setState({
      OrgUnitAddVisible: !!flag,
    });
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
  }

  cancel = () => {
    message.error('Click on No');
  }

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
          <Col md={12} sm={24}>
            <FormItem label="用户">
              {getFieldDecorator('no')(
                <Input placeholder="默认当前用户" />
              )}
            </FormItem>
          </Col>

          <Col md={12} sm={24}>
            <FormItem label="组织">
              {getFieldDecorator('subordinateUnit', {
                rules: [{ required: false, message: '请输入所属单位' }],
              })(
                <Search
                  placeholder="请输入所属单位"
                  onSearch=""
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col md={12} sm={24}>
            <FormItem label="指定用户的主角色">
              {getFieldDecorator('subordinateUnit', {
                rules: [{ required: false, message: '请输入所属单位' }],
              })(
                <Select placeholder="请输入所属单位" >
                  <Option value="1" >aaa</Option>
                  <Option value="2" >bbb</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          {/*<Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>*/}
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows, OrgUnitAddVisible, OrgUnitViewVisible, OrgUnitEditVisible, rowInfo } = this.state;

    const columns = [
      {
        title: '组织编号',
        dataIndex: 'organizeCode',
      },
      {
        title: '组织名称',
        dataIndex: 'organizeName',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '负责人',
        dataIndex: 'fzperson',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '分公司',
        dataIndex: 'company',
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
          <div>
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
          </div>
        </Card>
      </div>
    );
  }
}
