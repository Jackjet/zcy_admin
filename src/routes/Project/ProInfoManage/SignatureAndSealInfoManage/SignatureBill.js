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
} from 'antd';
import StandardTable from '../../../../components/StandardTable/index';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './style.less';

const { confirm } = Modal;
const { Content } = Layout;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['success', 'processing'];
const status = ['已审核', '审核中'];
const industry = [
  '制造业',
  '服务业',
  '房地产建筑',
  '三农业务',
  '政府购买',
  '商业',
  '非营利组织',
  '其他',
];

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class SignatureBill extends PureComponent {
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
  };

  // 生命周期方法 加载页面
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
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

  // 搜索(重置)方法
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

  // 选中行批量删除方法
  handleDeleteMoreClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    confirm({
      title: `确认删除编码为：${selectedRows.map(row => row.customerCode).join(',')}的客户`,
      keyboard: false,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
        });
        message.success('删除成功');
      },
      onCancel() {
        message.error(`编码为的客户：${selectedRows.map(row => row.customerCode).join(',')}未删除`);
      },
    });
    this.setState({
      selectedRows: [],
    });
  };

  // 当前行删除按钮操作
  handleDeleteClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (this.state.selectedRows.length === 0) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warning('请勾选');
      return false;
    }
    confirm({
      title: `确认删除编码为：${selectedRows.map(row => row.customerCode).join(',')}的客户`,
      keyboard: false,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
        });
        message.success('删除成功');
      },
      onCancel() {
        message.error(`编码为的客户：${selectedRows.map(row => row.customerCode).join(',')}未删除`);
      },
    });
    this.setState({
      selectedRows: [],
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
  handleCusApplyAddVisible = flag => {
    this.props.form.setFields();
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

  // 弹窗查看当前行的数据
  showViewMessage = (flag, text, record) => {
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
              {getFieldDecorator('customerCode', {})(
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
    const { rule: { data }, loading } = this.props;
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
        title: '签章项目',
        dataIndex: 'cusApplyCode',
        width: 150,
        fixed: 'left',
      },
      {
        title: '签章时间',
        dataIndex: 'cusApplyName',
      },
      {
        title: '项目环节',
        dataIndex: 'cusApplyLinkman',
      },
      {
        title: '签章人',
        dataIndex: 'cusApplyCompany',
      },
      {
        title: '签章事由',
        dataIndex: 'industry',
      },
      /*{
        title: '操作',
        width: 200,
        fixed:'right',
        render: (text, record, index) => (
          <Fragment>
            <a onClick={() =>this.showViewMessage(true, text, record, index)} >查看</a>
            <Divider type="vertical" />
            <a onClick={() =>this.showEditMessage(true, record)} >编辑</a>
            <Divider type="vertical" />
            <a onClick={this.handleDeleteClick} >删除</a>
          </Fragment>
        ),
      },*/
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
      </PageHeaderLayout>
    );
  }
}
