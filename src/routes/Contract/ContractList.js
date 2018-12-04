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
  Radio,
} from 'antd';
import PageLeftTreeMenu from '../../components/PageLeftTreeMenu/index';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import router from './configDataMenu';
import styles from './style.less';
import ContractAddModal from './ContractAddModal.js';
import ContractViewTabs from './ContractViewTabs.js';
import ContractEditModal from './ContractEditModal.js';
import ContractTypeModal from './ContractTypeModal';

const {RadioGroup} = Radio.Group;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Content,  Sider } = Layout;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
.join(',');

@connect(({ contract, loading }) => ({
  contract,
  loading: loading.models.contract,
}))
@Form.create()
export default class ContractList extends PureComponent {
  state = {
    contractAddVisible: false,
    contractEditVisible: false,
    contractTabsVisible: false,
    expandForm: false,
    selectedRows: [],
    rowInfo:{},
    formValues: {},
    openKeys: ['sub1'],
    choiceTypeKey: 0,
    choiceTypeValue:'',
    contractTypeVisible: false,
    openKey: '',
    selectedKey: '',
    firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    pageCurrent: ``,
    pageSizeCurrent: ``,
    orgTreeMenu:``,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/fetch',
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
    dispatch({
      type: 'company/getLeftTreeMenu',
      callback: (res) => {
        if(res.meta.status === '000000' ) {
          this.setState({
            orgTreeMenu : res.data.list,
          });
        } else {
          message.error(res.meta.errmsg);
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
      type: 'contract/fetch',
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
      type: 'contract/fetch',
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
        type: 'company/fetch',
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
  handleContractVisible = flag => {
    if(this.state.choiceTypeKey === 0) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warning('请选择合同类别');
      return false;
    }
    this.setState({
      contractTypeVisible: !!flag,
    });if (!flag) {
      this.props.dispatch({
        type: 'contract/fetch',
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

  handleContractTypeVisible = flag => {
      this.setState({
        contractTypeVisible: !!flag,
      });
  };

  handleContractAddVisible = flag => {
    this.setState({
      contractAddVisible: !!flag,
    })
    if (!flag) {
      this.props.dispatch({
        type: 'contract/fetch',
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

  handleContractEditVisible = flag => {
    this.setState({
      contractEditVisible: !!flag,
    });
    if (!flag) {
      this.props.dispatch({
        type: 'contract/fetch',
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

  handleContractTabsVisible = flag => {
    this.setState({
      contractTabsVisible: !!flag,
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

  menuClick = e => {
    console.log(e.key);
    this.setState({
      selectedKey: e.key,
    });
  };
  openMenu = v => {
    this.setState({
      openKey: v[v.length - 1],
      firstHide: false,
    })
  };

  handleGetMenuValue = (MenuValue) => {
    this.setState({
      choiceTypeKey: MenuValue.key,
      choiceTypeValue: MenuValue.item.props.children,
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
        onClick={this.handleGetMenuValue}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <span>合同类别</span>
            </span>
          }
        >
          <Menu.Item key="1">工程造价业务</Menu.Item>
          <Menu.Item key="2">咨询报告</Menu.Item>
          <Menu.Item key="3">招标</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col span={6} >
            <FormItem label="关键字">
              {getFieldDecorator('keyWord')(
                <Input placeholder="合同名称" />
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
                companys: [{ required: false, message: '请选择日期' }],
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
    const { contract: { data }, loading } = this.props;
    const {
      selectedRows,
      contractAddVisible,
      contractEditVisible,
      contractTabsVisible,
      rowInfo,
      choiceTypeValue,
      contractTypeVisible,
    } = this.state;

    const columns = [
      {
        title: '合同编码',
        dataIndex: 'number',
        width: 100,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '合同标题',
        dataIndex: 'title',
        width: 130,
        align: 'center',
      },
      {
        title: '对方企业',
        dataIndex: 'name',
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

    const parentMethods = {
      handleContractTypeVisible: this.handleContractTypeVisible,
      handleContractAddVisible: this.handleContractAddVisible,
      handleContractTabsVisible: this.handleContractTabsVisible,
      handleAdd: this.handleAdd,
      handleContractEditVisible: this.handleContractEditVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={140} style={{ background: '#fff' }}>
             {/* {this.treeMenu()}*/}
              <PageLeftTreeMenu
                // menus={routes.menus}
                menus={this.state.orgTreeMenu}
                onClick={this.menuClick}
                mode="inline"
                selectedKeys={[this.state.selectedKey]}
                openKeys={this.state.firstHide ? null : [this.state.openKey]}
                onOpenChange={this.openMenu}
              />
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
        </Card>
        <ContractAddModal {...parentMethods} contractAddVisible={contractAddVisible} choiceTypeValue={choiceTypeValue} />
        <ContractViewTabs {...parentMethods} contractTabsVisible={contractTabsVisible} rowInfo={rowInfo} />
        <ContractEditModal {...parentMethods} contractEditVisible={contractEditVisible} rowInfo={rowInfo} />
        <ContractTypeModal {...parentMethods} contractTypeVisible={contractTypeVisible} />
      </PageHeaderLayout>
    );
  }
}
