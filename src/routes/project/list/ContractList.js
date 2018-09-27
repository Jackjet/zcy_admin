import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Layout,
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
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './Style.less';
import ContractAddModal from '../add/ContractAddModal.js';
import ContractViewTabs from '../contractTabsInfo/ContractViewTabs.js';
import ContractEditModal from '../edit/ContractEditModal.js';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Content,  Sider } = Layout;
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
export default class Contract extends PureComponent {
  state = {
    contractVisible: false,
    contractEditVisible: false,
    contractTabsVisible: false,
    expandForm: false,
    selectedRows: [],
    rowInfo:{},
    formValues: {},
    openKeys: ['sub1'],
  };
  componentDidMount() {
    this.props.dispatch({
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
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
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
  handleDeleteClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

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
  };
  handleContractVisible = flag => {
    this.setState({
      contractVisible: !!flag,
    });
  };

  handleContractEditVisible = flag => {
    this.setState({
      contractEditVisible: !!flag,
    });
  };

  handleContractTabsVisible = flag => {
    this.setState({
      contractTabsVisible: !!flag,
    });
  };
  handleAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      contractVisible: false,
    });
  };
  rootSubmenuKeys = ['sub1'];

  showViewMessage =(flag, record)=> {
    this.setState({
      contractTabsVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage =(flag, record)=> {
    this.setState({
      contractEditVisible: !!flag,
      rowInfo: record,
    });
  };

  treeMenu() {
    const { SubMenu } = Menu;
    return (
      <Menu
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 140 }}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <span>合同类别</span>
            </span>
          }
        >
          <Menu.Item key="工程造价业务项目">工程造价业务项目</Menu.Item>
          <Menu.Item key="2">可研报告</Menu.Item>
          <Menu.Item key="3">招标代理业务项目</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col span={6}>
            <FormItem label="编码">
              {getFieldDecorator('contractCode')(
                <Input placeholder="请输入合同编码" />
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem label="名称">
              {getFieldDecorator('contractName')(
                <Input placeholder="合同名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="项目">
              {getFieldDecorator('project', {
                rules: [{ required: true, message: '请输入项目' }],
              })(
                <Select placeholder="请输入" style={{ width: 200 }}>
                  <Option value="xiao">请选择</Option>
                  <Option value="z">工程造价业务项目</Option>
                  <Option value="f">招标代理业务项目</Option>
                  <Option value="fd">打包项目</Option>
                  <Option value="sn">2010年免审批工程造价、招投标项目</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                清空
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
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="合同编码">
              {getFieldDecorator('contractCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="合同名称">
              {getFieldDecorator('contractName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="负责公司">
              {getFieldDecorator('phone')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="客户">
              {getFieldDecorator('customer')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="xiao">请选择</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="状态">
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
          <Col md={8} sm={24} />
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label="项目日期">
              {getFieldDecorator('date', {
                rules: [{ required: false, message: '请选择日期' }],
              })(
                <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />
              )}
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
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }
  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows, contractVisible, contractEditVisible, contractTabsVisible, rowInfo } = this.state;

    const columns = [
      {
        title: '合同编码',
        dataIndex: 'contractCode',
        width: 100,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '合同标题',
        dataIndex: 'contractName',
        width: 130,
        align: 'center',
      },
      {
        title: '对方企业',
        dataIndex: 'partnerEnterprise',
        align: 'center',
      },
      {
        title: '负责人',
        dataIndex: 'linkman',
        align: 'center',
      },
      {
        title: '业务类别',
        dataIndex: 'businessType',
        align: 'center',
      },
      {
        title: '签订时间',
        dataIndex: 'signTime',
        align: 'center',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },

      {
        title: '总金额',
        dataIndex: 'totalAmount',
        align: 'center',
        render: val => `${val} 万`,
        // mark to display a total number
        needTotal: true,
      },

      {
        title: '操作',
        align: 'center',
        fixed: 'right',
        width: 150,
        render: (text,record) => (
          <Fragment>
            <a onClick={() =>this.showViewMessage(true, record)} >查看</a>
            <Divider type="vertical" />
            <a onClick={() =>this.showEditMessage(true, record)} >编辑</a>
            <Divider type="vertical" />
            <a onClick={this.handleDeleteClick} >删除</a>
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

    const contractTabsMethods = {
      handleContractTabsVisible: this.handleContractTabsVisible,
    };
    const contractAddMethods = {
      handleAdd: this.handleAdd,
      handleContractVisible: this.handleContractVisible,
    };
    const contractEditMethods = {
      handleContractEditVisible: this.handleContractEditVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={140} style={{ background: '#fff' }}>
              {this.treeMenu()}
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280}}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleContractVisible(true)}>
                    新建
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
                  scroll={{ x: 1500}}
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

        {/*  <div className={styles.leftBlock}>{this.treeMenu()}</div>
          <div className={styles.rightBlock}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleContractVisible(true)}>
                  新建
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
              <StandardTable scroll={{ x: 1500}}
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </div>*/}
        </Card>
        <ContractAddModal {...contractAddMethods} contractVisible={contractVisible} />
        <ContractViewTabs {...contractTabsMethods} contractTabsVisible={contractTabsVisible} rowInfo={rowInfo} />
        <ContractEditModal {...contractEditMethods} contractEditVisible={contractEditVisible} rowInfo={rowInfo} />
      </PageHeaderLayout>
    );
  }
}
