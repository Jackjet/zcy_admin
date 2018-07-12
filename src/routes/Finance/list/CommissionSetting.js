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
import styles from './style.less';
import CommissionSettingAddModal from '../add/CommissionSettingAddModal';
import CommissionSettingViewModal from '../select/CommissionSettingViewModal';
import CommissionSettingEditModal from '../edit/CommissionSettingEditModal';





const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const statusMap = ['success', 'error'];
const status = ['启用', '停用'];

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class CommissionSetting extends PureComponent {
  state = {
    // 客户增加状态
    commissionSetAddVisible: false,

    commissionSetViewVisible: false,

    commissionSetEditVisible: false,

    // 高级搜索是否隐藏状态
    expandForm: false,

    rowInfo:{},

    // 选中的行
    selectedRows: [],

    formValues: {},

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

  // 获取选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
  handleCommissionSetAddVisible = flag => {
    this.setState({
      commissionSetAddVisible: !!flag,
    });
  };
  handleCommissionSetEditVisible = flag => {
    this.setState({
      commissionSetEditVisible: !!flag,
    });
  };
  handleCommissionSetViewVisible = flag => {
    this.setState({
      commissionSetViewVisible: !!flag,
    });
  };

  // 弹窗展示当前行的数据
  showEditMessage =(flag, record)=> {
    this.setState({
      commissionSetEditVisible: !!flag,
      rowInfo: record,
    });
  };

  showViewMessage =(flag, text, record)=> {
    this.setState({
      commissionSetViewVisible: !!flag,
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
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="拼音码">
              {getFieldDecorator('pinyin')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="电话号码">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="业务员">
              {getFieldDecorator('customer')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="xiao">请选择</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="行业">
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
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 24 }} label="地址">
              {getFieldDecorator('address')(<Input placeholder="请输入" />)}
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
              {getFieldDecorator('customerCode')(
                <Input placeholder="请输入客户编码和名称" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="key">
              {getFieldDecorator('key')(
                <Input placeholder="请输入key" />
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
      commissionSetAddVisible,
      commissionSetEditVisible,
      commissionSetViewVisible,
      rowInfo,
    } = this.state;

    const columns = [
      {
        title: '提成比例类别',
        dataIndex: 'invoiceNumber',
      },
      {
        title: '提成比例系数',
        dataIndex: 'invoiceName',
      },
      {
        title: '所属单位',
        dataIndex: 'invoicePerson',
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
        title: '备注',
        dataIndex: 'remarks',
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <Fragment>
            <a onClick={() =>this.showViewMessage(true, text, record, index)} >查看</a>

            {record.status ===1 && (
              <span>
                <Divider type="vertical" />
                <a onClick={() =>this.showEditMessage(true, record)} >
                  编辑
                </a>
              </span>
            )}


            {record.status ===1 && (
              <span>
                <Divider type="vertical" />
                <a onClick={this.handleDeleteClick}>
                  启用
                </a>
              </span>

            )}

            {record.status ===1 && (
              <span>
                <Divider type="vertical" />
                <a onClick={this.handleDeleteClick} >
                  删除
                </a>
              </span>
            )}


            {record.status ===0 && (
              <span>
                <Divider type="vertical" />
                <a onClick={this.handleDeleteClick}>
                  禁用
                </a>
              </span>
            )}
          </Fragment>
        ),
      },
    ];

    const commissionSetAddMethods = {
      handleCommissionSetAddVisible: this.handleCommissionSetAddVisible,
    };
    const commissionSetEditMethods = {
      handleCommissionSetEditVisible: this.handleCommissionSetEditVisible,
    };
    const commissionSetViewMethods = {
      handleCommissionSetViewVisible: this.handleCommissionSetViewVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button
                  type="primary"
                  onClick={() => this.handleCommissionSetAddVisible(true)}
                >
                  新增类型比例
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
          </div>
        </Card>
        <CommissionSettingAddModal {...commissionSetAddMethods} commissionSetAddVisible={commissionSetAddVisible} />
        <CommissionSettingEditModal {...commissionSetEditMethods} commissionSetEditVisible={commissionSetEditVisible} rowInfo={rowInfo} />
        <CommissionSettingViewModal {...commissionSetViewMethods} commissionSetViewVisible={commissionSetViewVisible} rowInfo={rowInfo} />
      </PageHeaderLayout>
    );
  }
}
