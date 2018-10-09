import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Menu,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ReimbursementListViewModal from '../view/ReimbursementListViewModal';
import ReimbursementListAddModal from '../add/ReimbursementListAddModal';
import ReimbursementListEditModal from '../edit/ReimbursementListEditModal';
import styles from './style.less';



const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj).map(key => obj[key]).join(',');

const statusMap = ['success', 'error'];
const status = ['启用', '停用'];
const industry =['制造业','服务业','房地产建筑','三农业务','政府购买','商业','非营利组织','其他'];

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class ReimbursementList extends PureComponent {
  state = {
    // 客户增加状态
    customerAddVisible: false,


    // 客户编辑状态
    customerEditVisible: false,

    // 联系人状态
    contactsVisible: false,

    // 客户查看状态
    tabsViewVisible: false,
    reimbursementListAddModalVisible: false,

    reimbursementListViewModalVisible:false,
    reimbursementListEditModalVisible:false,

    customerDistributionVisible: false,

    // 高级搜索是否隐藏状态
    expandForm: false,

    // 选中的行
    selectedRows: [],

    formValues: {},

    // 当前操作行的数据
    rowInfo:{},

    // 左边菜单树的起始状态
    openKeys: ['sub1'],
  };

  // 生命周期方法 加载页面
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

  // 分页
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

  // 搜索重置方法
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

  // 展开高级搜索方法
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  // 选中行删除方法
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

  // 获取选中的行
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
        // ??
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

  // 隐藏和显示客户增加界面
  handleCustomerAddVisible = flag => {
    this.props.form.setFields();
    this.setState({
      customerAddVisible: !!flag,
    });
  };

  // 隐藏和显示客户编辑界面
  handleCustomerEditVisible = (flag) => {
    this.setState({
      customerEditVisible: !!flag,
    });
  };

  // 隐藏和显示联系人增加界面
  handleContactsVisible = flag => {
    if(this.state.selectedRows.length>1){
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      contactsVisible: !!flag,
    });
  };


  handleTabsViewVisible = flag => {
    this.setState({
      tabsViewVisible: !!flag,
    });
  };
  handleCustomerDistributionVisible = flag => {
    this.setState({
      customerDistributionVisible: !!flag,
    });
  };


  handleReimbursementListAddModalVisible = flag => {
    this.setState({
      reimbursementListAddModalVisible: !!flag,
    });
  };

  handleReimbursementListViewModalVisible = flag => {
    this.setState({
      reimbursementListViewModalVisible: !!flag,
    });
  };

  handleReimbursementListEditModalVisible = flag => {
    this.setState({
      reimbursementListEditModalVisible: !!flag,
    });
  };


  // 添加表单数据
  handleCustomerAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      customerAddVisible: false,
    });
  };
  handleAddContact = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });
    message.success('添加成功');
    this.setState({
      contactsVisible: false,
    });
  };


  // 左边菜单树
  rootSubmenuKeys = ['sub1'];
  treeMenu() {
    const SubMenuTree = Menu.SubMenu;
    return (
      <Menu
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 130 }}
      >
        <SubMenuTree
          key="sub1"
          title={
            <span>
              <span>客户等级</span>
            </span>
          }
        >
          <Menu.Item key="1">贵宾客户</Menu.Item>
          <Menu.Item key="2">一般客户</Menu.Item>
          <Menu.Item key="3">重要客户</Menu.Item>
          <Menu.Item key="4">潜在客户</Menu.Item>
        </SubMenuTree>
      </Menu>
    );
  }

  // 弹窗展示当前行的数据
  showEditMessage =(flag, record)=> {
    this.setState({
      reimbursementListEditModalVisible: !!flag,
      rowInfo: record,
    });
  };

  showViewMessage =(flag, text, record, index)=> {
    this.setState({
      reimbursementListViewModalVisible: !!flag,
      rowInfo: record,
    });
  };


  // 高级搜索
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编码名称">
              {getFieldDecorator('no',{

              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="移动电话">
              {getFieldDecorator('phone',{

              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('contract',{

              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="业务员">
              {getFieldDecorator('customer',{

              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="xiao">请选择</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="行业">
              {getFieldDecorator('status',{

              })(
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
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 24 }} label="地址">
              {getFieldDecorator('address',{

              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('date', {
                rules: [{ required: false, message: '请选择创建日期' }],
              })(<RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起
            </Button>
          </span>
        </div>
      </Form>
    );
  }

  // 判断简单 还是 高级搜索
  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  // 简单查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('customerCode',{

              })(
                <Input placeholder="请输入客户编码和名称" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
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

  render() {
    const { rule: { data }, loading } = this.props;
    const {
      selectedRows,
      reimbursementListViewModalVisible,
      reimbursementListAddModalVisible,
      reimbursementListEditModalVisible,
      customerAddVisible,
      customerEditVisible,
      contactsVisible,
      tabsViewVisible,
      customerDistributionVisible,
      rowInfo,
    } = this.state;

    const columns = [
      {
        title: '编码',
        dataIndex: 'customerCode',
      },
      {
        title: '名称',
        dataIndex: 'customerName',
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
      },
      {
        title: '所属公司',
        dataIndex: 'company',
      },
      {
        title: '行业',
        dataIndex: 'industry',
        filters: [
          {
            text: industry[0],
            value: 0,
          },
          {
            text: industry[1],
            value: 1,
          },
          {
            text: industry[2],
            value: 2,
          },
          {
            text: industry[3],
            value: 3,
          },
          {
            text: industry[4],
            value: 4,
          },
          {
            text: industry[5],
            value: 5,
          },
          {
            text: industry[6],
            value: 6,
          },
          {
            text: industry[7],
            value: 7,
          },
        ],
        onFilter: (value, record) => record.industry.toString() === value,
        render(val) {
          return <Badge status text={industry[val]} />;
        },
      },
      {
        title: '手机',
        dataIndex: 'mobilePhone',
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
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <Fragment>
            <a onClick={() =>this.showViewMessage(true, text, record, index)} >查看</a>
            <Divider type="vertical" />
            <a onClick={() =>this.showEditMessage(true, record)} >编辑</a>
            <Divider type="vertical" />
            <a onClick={this.handleDeleteClick} >删除</a>
          </Fragment>
        ),
      },
    ];


    const ReimbursementListAddMethods = {
      handleReimbursementListAddModalVisible: this.handleReimbursementListAddModalVisible,
    };

    const ReimbursementListViewMethods = {
      handleReimbursementListViewModalVisible: this.handleReimbursementListViewModalVisible,
    };

    const ReimbursementListEditMethods = {
      handleReimbursementListEditModalVisible: this.handleReimbursementListEditModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button
                  type="primary"
                  onClick={() => this.handleReimbursementListAddModalVisible(true)}
                >
                  新建费用报销单
                </Button>
                {selectedRows.length > 0 && (
                  <span>
                    <Button
                      type="primary"
                      onClick={() => this.handleCustomerDistributionVisible(true)}
                    >
                      客户分配
                    </Button>
                    <Button type="primary" onClick={() => this.handleContactsVisible(true)}>
                      设置联系人
                    </Button>
                    <Button type="primary" onClick={() => this.handleDeleteClick(true)}>
                      批量删除
                    </Button>
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
        <ReimbursementListAddModal {...ReimbursementListAddMethods} reimbursementListAddModalVisible={reimbursementListAddModalVisible} />
        <ReimbursementListViewModal {...ReimbursementListViewMethods} reimbursementListViewModalVisible={reimbursementListViewModalVisible} rowInfo={rowInfo} />
        <ReimbursementListEditModal {...ReimbursementListEditMethods} reimbursementListEditModalVisible={reimbursementListEditModalVisible} rowInfo={rowInfo} />
      </PageHeaderLayout>
    );
  }
}
