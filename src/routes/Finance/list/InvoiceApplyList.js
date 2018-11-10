import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Menu, Modal, message, Select, Divider } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import InvoiceTabs from '../list/InvoiceTabs';
import InvoiceListApplyModal from '../add/InvoiceListApplyModal';
import InvoiceEditList from '../edit/InvoiceEditList';
import InvoiceViewList from '../select/InvoiceViewList';
import Invoicing from '../edit/Invoicing';

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
// PureComponent优化Component的性能
export default class companyList extends PureComponent {
  state = {
    companyVisible: false,
    invoiceTabsVisible: false,
    invoiceEditVisible: false,
    invoiceViewVisible: false,
    invoicingVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
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
      type: 'company/fetch',
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
      type: 'company/fetch',
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
        type: 'company/fetch',
        payload: values,
      });
    });
  };

  // 点击新增显示弹窗handleInvoiceTabsVisible
  handlecompanyVisible = flag => {
    this.setState({
      companyVisible: !!flag,
    });
  };
  handleInvoiceTabsVisible = flag => {
    this.setState({
      invoiceTabsVisible: !!flag,
    });
  };
  handleInvoiceEditVisible = flag => {
    this.setState({
      invoiceEditVisible: !!flag,
    });
  };
  handleInvoiceViewVisible = flag => {
    this.setState({
      invoiceViewVisible: !!flag,
    });
  };
  handleInvoicingVisible = flag => {
    this.setState({
      invoicingVisible: !!flag,
    });
  };
  // 新增功能实现
  handleAdd = fields => {
    this.props.dispatch({
      type: 'company/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功111');
    this.setState({
      companyVisible: false,
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
            <FormItem label="开票名称">
              {getFieldDecorator('no')(
                <Input placeholder="请选择开票名称" style={{ width: 200 }} />
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
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handlecompanyVisible}>
                新建
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { company: { data }, loading } = this.props;
    const {
      selectedRows,
      companyVisible,
      invoiceTabsVisible,
      invoiceEditVisible,
      invoiceViewVisible,
      invoicingVisible,
    } = this.state;
    const columns = [
      {
        title: '申请单号',
        dataIndex: 'applicationNumber',
      },
      {
        title: '申请时间',
        dataIndex: 'applyData',
      },
      {
        title: '开票金额（元）',
        dataIndex: 'invoiceMoney',
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a onClick={() => this.handleInvoiceViewVisible(true)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleInvoiceEditVisible(true)}>编辑</a>
            <Divider type="vertical" />
            <a>开票</a>
            <Divider type="vertical" />
            <a>作废</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleInvoicingVisible(true)}>删除</a>
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const InvoiceTabsMethods = {
      handleInvoiceTabsVisible: this.handleInvoiceTabsVisible,
    };

    const companyMethods = {
      handlecompanyVisible: this.handlecompanyVisible,
    };

    const InvoiceEditMethods = {
      handleInvoiceEditVisible: this.handleInvoiceEditVisible,
    };
    const InvoiceViewMethods = {
      handleInvoiceViewVisible: this.handleInvoiceViewVisible,
    };
    const InvoicingMethods = {
      handleInvoicingVisible: this.handleInvoicingVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleInvoiceTabsVisible(true)}>
                申请开票
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
        <InvoiceTabs {...InvoiceTabsMethods} invoiceTabsVisible={invoiceTabsVisible} />
        <InvoiceListApplyModal {...companyMethods} companyVisible={companyVisible} />
        <InvoiceEditList {...InvoiceEditMethods} invoiceEditVisible={invoiceEditVisible} />
        <InvoiceViewList {...InvoiceViewMethods} invoiceViewVisible={invoiceViewVisible} />
        <Invoicing {...InvoicingMethods} invoicingVisible={invoicingVisible} />
      </PageHeaderLayout>
    );
  }
}
