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
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Layout,
  Popconfirm,
} from 'antd';
import moment from "moment/moment";
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import CustomerApplyAddModal from './CusApplyAddModal';
import CustomerApplyViewTabs from './CusApplyTabsViewModal.js';
import EditableTable from '../../EditableTable/EditableTable';
import ContactsAddModal from './ContactsAddModal';
import CustomerApplyEditModal from './CusApplyEditModal';


const { confirm } = Modal;
const { Content } = Layout;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default','processing','success' ];
const linkManTypeValue = ['工程', '招标', '采购'];
const statusValue = ['待审核', '审核中', '已审核'];
message.config({
  top: 100, // 提示框弹出位置
  duration: 3, // 自动关闭延时，单位秒
  maxCount: 1, // 最大显示数目
});


// 设置业务员
const SalesManage = Form.create()(props => {
  const { salesVisible, handleSalesVisible } = props;
  const okHandle = () => {
    handleSalesVisible();
  };
  return (
    <Modal
      title="业务员基本信息管理"
      style={{ top: 20 }}
      visible={salesVisible}
      width="40%"
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleSalesVisible()}
    >
      <div className={styles.editPerson}>
        <EditableTable />
      </div>
    </Modal>
  );
});

@connect(({ cusApplication, loading }) => ({
  cusApplication,
  loading: loading.models.cusApplication,
}))
@Form.create()
export default class CusApplyBill extends PureComponent {
  state = {
    // 客户增加状态
    cusApplyAddVisible: false,

    // 客户编辑状态
    cusApplyEditVisible: false,

    // 客户查看状态
    cusApplyTabsViewVisible: false,

    // 联系人状态
    contactsVisible: false,

    // 业务员状态
    salesVisible: false,

    // 高级搜索是否隐藏状态
    expandForm: false,

    // 选中的行
    selectedRows: [],

    formValues: {},

    // 当前操作行的数据
    rowInfo: {},

    // 左边菜单树的起始状态
    openKeys: ['sub1'],

    pageCurrent:``,
    pageSizeCurrent:``,

  };

  // 生命周期方法 加载页面
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {

        }else{

        }
      },
    });
  }

  // 公共列表组建分页
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
      type: 'cusApplication/fetch',
      payload: params,
    });
  };

  // 搜索(重置)方法
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cusApplication/fetch',
      payload: {},
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          message.success('重置完成!');
        }

      },
    });
  };

  // 展开高级搜索方法
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  // 当前行删除按钮操作
  showDeleteMessage =(flag, record)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/remove',
      payload: {
        id: record.id,
        deleteFlag: 0,
      },
      callback: ( res ) => {
        if (res.meta.status !== "000000") {
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            selectedRows: [],
          });
          dispatch({
            type: 'cusApplication/fetch',
            payload: {
              page: this.state.pageCurrent,
              pageSize: this.state.pageSizeCurrent,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('删除成功!');
        }

      },
    });
  }; // 信息单个删除方法

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
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'cusApplication/fetch',
        payload: values,
        callback: (res) => {
          if(res.meta.status !== '000000'){
            message.error(res.meta.errmsg);  // 返回错误信息
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

  // 隐藏和显示客户增加界面
  handleCusApplyAddVisible = flag => {
    this.setState({
      cusApplyAddVisible: !!flag,
    });
  };

  // 隐藏和显示客户编辑界面
  handleCusApplyEditVisible = flag => {
    this.setState({
      cusApplyEditVisible: !!flag,
    });
  };

  // 隐藏和显示联系人增加界面
  handleContactsVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      contactsVisible: !!flag,
    });
  };

  // 隐藏和显示客户申请查看Tabs
  handleCusApplyTabsViewVisible = flag => {
    this.setState({
      cusApplyTabsViewVisible: !!flag,
    });
  };

  // 隐藏和显示业务员申请查看Tabs
  handleSalesVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      salesVisible: !!flag,
    });
  };

  // 弹窗编辑当前行的数据
  showEditMessage = (flag, record) => {
    this.setState({
      cusApplyEditVisible: !!flag,
      rowInfo: record,
    });
  };

  handleCancelCancel = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/cancelCancel',
      payload: {
        id: record.id,
        status: 2,
      },
      callback: ( res ) => {
        if (res.meta.status !== "000000") {
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            selectedRows: [],
          });
          dispatch({
            type: 'cusApplication/fetch',
            payload: {
              page: this.state.pageCurrent,
              pageSize: this.state.pageSizeCurrent,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('提交成功!');
        }
      },
    });
  };

  // 弹窗查看当前行的数据
  showViewMessage = (flag, record) => {
    this.setState({
      cusApplyTabsViewVisible: !!flag,
      rowInfo: record,
    });
  };

  // 简单查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyWord', {})(
                <div>
                  <Input placeholder="请输入客户编码和名称" />
                </div>
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

  // 高级搜索
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编码名称">
              {getFieldDecorator('no', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="移动电话">
              {getFieldDecorator('phone', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('contract', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="业务员">
              {getFieldDecorator('customer', {})(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="xiao">请选择</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="行业">
              {getFieldDecorator('status', {})(
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
              {getFieldDecorator('address', {})(<Input placeholder="请输入" />)}
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

  render() {
    const { cusApplication: { data }, loading } = this.props;
    const {
      selectedRows,
      cusApplyAddVisible,
      cusApplyEditVisible,
      contactsVisible,
      cusApplyTabsViewVisible,
      salesVisible,
      rowInfo,
    } = this.state;

    const columns = [
      {
        title: '编码',
        dataIndex: 'number',
        width: 150,
        fixed: 'left',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '联系人',
        dataIndex: 'linkMan',
      },
      {
        title: '所属公司',
        dataIndex: 'companyId',
      },
      {
        title: '联系人业务性质',
        dataIndex: 'linkManTypeId',
        filters: [
          {
            text: linkManTypeValue[0],
            value: 0,
          },
          {
            text: linkManTypeValue[1],
            value: 1,
          },
          {
            text: linkManTypeValue[2],
            value: 2,
          },
        ],
        onFilter: (value, record) => record.linkManTypeId.toString() === value,
        render(val) {
          return <Badge status text={linkManTypeValue[val]} />;
        },
      },
      {
        title: '手机',
        dataIndex: 'phone',
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        filters: [
          {
            text: statusValue[0],
            value: 0,
          },
          {
            text: statusValue[1],
            value: 1,
          },
          {
            text: statusValue[2],
            value: 2,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val-1]} text={statusValue[val-1]} />;
        },
      },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showViewMessage(true, record)}>查看</a>
            <Divider type="vertical" />
            {
              ( record.status === 1) && (
                <span>
                  <a onClick={() => this.showEditMessage(true, record)}>编辑</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleCancelCancel(record)}>提交</a>
                  <Divider type="vertical" />
                  <Popconfirm title="确认删除?" onConfirm={() =>this.showDeleteMessage(true, record)} okText="是" cancelText="否">
                    <a>删除</a>
                  </Popconfirm>
                </span>
              )
            }
          </Fragment>
        ),
      },
    ];

    const ParentMethods = {
      handleCusApplyAddVisible: this.handleCusApplyAddVisible,
      handleCusApplyEditVisible: this.handleCusApplyEditVisible,
      handleContactsVisible: this.handleContactsVisible,
      handleCusApplyTabsViewVisible: this.handleCusApplyTabsViewVisible,
      handleSalesVisible: this.handleSalesVisible,
    };

    return (
      <PageHeaderLayout>
        <Card>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <div>
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderForm()}</div>
                  <div className={styles.tableListOperator}>
                    <Button
                      icon="plus"
                      type="primary"
                      onClick={() => this.handleCusApplyAddVisible(true)}
                    >
                      新建客户
                    </Button>
                    {selectedRows.length > 1 && (
                      <span>
                        <Button type="primary" onClick={() => this.handleDeleteMoreClick(true)}>
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
            </Content>
          </Layout>
        </Card>
        <CustomerApplyAddModal {...ParentMethods} cusApplyAddVisible={cusApplyAddVisible} />
        <CustomerApplyViewTabs
          {...ParentMethods}
          cusApplyTabsViewVisible={cusApplyTabsViewVisible}
          rowInfo={rowInfo}
        />
        <CustomerApplyEditModal
          {...ParentMethods}
          cusApplyEditVisible={cusApplyEditVisible}
          rowInfo={rowInfo}
        />
        <ContactsAddModal {...ParentMethods} contactsVisible={contactsVisible} />
        <SalesManage {...ParentMethods} salesVisible={salesVisible} />
      </PageHeaderLayout>
    );
  }
}
