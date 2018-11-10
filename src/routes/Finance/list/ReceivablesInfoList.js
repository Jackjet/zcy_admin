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
  Modal,
  message,
  Select,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import InvoiceListApplyModal from '../add/InvoiceListApplyModal';
import SearchForm from '../select/SearchForm';
import IncomeConfirmModal from '../add/IncomeConfirmModal';

const { Option } = Select;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
// PureComponent优化Component的性能
export default class ReceivablesInfoList extends PureComponent {
  state = {
    invoiceApplyVisible: false,
    searchFormVisible: false,
    incomeConfirmVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }
  // 选中的条数已经选中的价格的和   参数（页码，过滤，把东西分类检出）
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    // Object.keys()方法会返回一个由一个给定对象的自身可枚举属性组成的数组,
    // reduce方法有两个参数，第一个参数是一个callback，用于针对数组项的操作；
    // 第二个参数则是传入的初始值，这个初始值用于单个数组项的操作。
    // 需要注意的是，reduce方法返回值并不是数组，而是形如初始值的经过叠加处理后的操作。

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
  // 重置查询的值
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

  // 批量处理的操作选择
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
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

  // 选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 查询功能
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

  // 点击新增显示弹窗handleInvoiceTabsVisible
  handleInvoiceApplyVisible = flag => {
    this.setState({
      invoiceApplyVisible: !!flag,
    });
  };

  handleIncomeConfirmVisible = flag => {
    this.setState({
      incomeConfirmVisible: !!flag,
    });
  };

  handleSearchFormVisible = flag => {
    this.setState({
      searchFormVisible: !!flag,
    });
  };

  // 新增功能实现
  handleAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功111');
    this.setState({
      invoiceApplyVisible: false,
    });
  };

  showDeleteConfirm = () => {
    confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // 查询表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="拜访对象">
              {getFieldDecorator('no')(
                <Select placeholder="请选择拜访对象" style={{ width: 200 }}>
                  <Option value="0">请选择</Option>
                  <Option value="1">初期沟通</Option>
                  <Option value="2">立项评估</Option>
                  <Option value="3">需求分析</Option>
                  <Option value="4">方案制定</Option>
                  <Option value="5">招投标/竞争</Option>
                  <Option value="6">商务谈判</Option>
                  <Option value="7">合同签约</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                type="primary"
                onClick={this.handleInvoiceApplyVisible}
              >
                新建
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
      invoiceApplyVisible,
      searchFormVisible,
      incomeConfirmVisible,
    } = this.state;

    const IncomeConfirmMethods = {
      handleIncomeConfirmVisible: this.handleIncomeConfirmVisible,
    };

    const columns = [
      {
        title: '发票号码',
        dataIndex: 'invoiceNumber',
      },
      {
        title: '开票名称',
        dataIndex: 'invoiceName',
      },
      {
        title: '发票金额（元）',
        dataIndex: 'invoiceMoney',
      },
      {
        title: '已收入金额（元）',
        dataIndex: 'incomeMoneyAlready',
      },
      {
        title: '开票时间',
        dataIndex: 'invoiceDate',
      },
      {
        title: '收款完成',
        dataIndex: 'status',
      },
      {
        title: '开票人员',
        dataIndex: 'invoiceP',
      },
      {
        title: '对方企业',
        dataIndex: 'enterprise',
      },
      {
        title: '客户授权你代理人',
        dataIndex: 'agent',
      },
      {
        title: '开票公司',
        dataIndex: 'invoiceCompany',
      },
      {
        title: '开票人员',
        dataIndex: 'invoiceP',
      },
      /*{
        title: '操作',
        render: () => (
          <Fragment>
            <Button type="primary" onClick={() => this.handleInvoiceApplyVisible(true)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Button type="primary" onClick={() => this.handleInvoiceApplyVisible(true)}>
              作废
            </Button>
            <Divider type="vertical" />
            <Button type="primary" onClick={() => this.handleInvoiceApplyVisible(true)}>
              查看
            </Button>
            <Divider type="vertical" />
            <Button type="primary" onClick={() => this.handleInvoiceApplyVisible(true)}>
              开票
            </Button>
          </Fragment>
        ),
      },*/
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const SearchFormMethods = {
      handleSearchFormVisible: this.handleSearchFormVisible,
    };

    const InvoiceApplyMethods = {
      handleInvoiceApplyVisible: this.handleInvoiceApplyVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleIncomeConfirmVisible(true)}>
                收入确认
              </Button>
              <Button type="primary" onClick={() => this.handleSearchFormVisible(true)}>
                高级搜索
              </Button>
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
        </Card>
        <SearchForm {...SearchFormMethods} searchFormVisible={searchFormVisible} />
        <InvoiceListApplyModal {...InvoiceApplyMethods} invoiceApplyVisible={invoiceApplyVisible} />
        <IncomeConfirmModal {...IncomeConfirmMethods} incomeConfirmVisible={incomeConfirmVisible} />
      </PageHeaderLayout>
    );
  }
}
