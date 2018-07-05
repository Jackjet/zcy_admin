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
  Modal,
  message,
  Divider,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import BusinessAddModal from '../add/BusinessAddModal.js';
import BusinessOppView from '../select/BusinessOppView.js';

const FormItem = Form.Item;
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
export default class BusinessOpportunity extends PureComponent {
  state = {
    businessOppVisible: false,
    businessViewVisible: false,
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
      case 'check':
        this.handleBusinessViewVisible(true);
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
  // 隐藏和显示
  handleBusinessOppVisible = flag => {
    this.setState({
      businessOppVisible: !!flag,
    });
  };
  handleBusinessViewVisible = flag => {
    this.setState({
      businessViewVisible: !!flag,
    });
  };
  // 添加表单数据
  handleAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      businessOppVisible: false,
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
              <span>商机状态</span>
            </span>
          }
        >
          <Menu.Item key="1">初期沟通</Menu.Item>
          <Menu.Item key="2">立项评估</Menu.Item>
          <Menu.Item key="3">需求分析</Menu.Item>
          <Menu.Item key="4">方案制定</Menu.Item>
          <Menu.Item key="5">招投标/竞争</Menu.Item>
          <Menu.Item key="6">商务谈判</Menu.Item>
          <Menu.Item key="7">合同签约</Menu.Item>
        </SubMenuTree>
      </Menu>
    );
  }

  // 简单查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem label="编码">
              {getFieldDecorator('no')(<Input placeholder="请输入编码" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('no')(<Input placeholder="请输入客户名称" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="商机来源">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="xiao">请选择</Option>
                  <Option value="z">朋友介绍</Option>
                  <Option value="f">第三方网站</Option>
                  <Option value="fd">其它</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                清空
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows, businessOppVisible, businessViewVisible } = this.state;

    const columns = [
      {
        title: '编号',
        dataIndex: 'no',
      },
      {
        title: '商机名称',
        dataIndex: 'businessName',
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
      },

      {
        title: '联系人',
        dataIndex: 'contacts',
      },
      {
        title: '商机来源',
        dataIndex: 'businessSource',
      },
      {
        title: '客户需求',
        dataIndex: 'customerDemand',
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a onClick={() => this.handleBusinessViewVisible(true)}>查看</a>
            <Divider type="vertical" />
            <a href="">编辑</a>
            <Divider type="vertical" />
            <a href="">删除</a>
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
      handleBusinessOppVisible: this.handleBusinessOppVisible,
      handleBusinessViewVisible: this.handleBusinessViewVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <div className={styles.tableList}>
              <div className={styles.leftBlock}>{this.treeMenu()}</div>
              <div className={styles.rightBlock}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleBusinessOppVisible(true)}>
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
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </div>
          </div>
        </Card>
        <BusinessAddModal {...parentMethods} businessOppVisible={businessOppVisible} />
        <BusinessOppView {...parentMethods} businessViewVisible={businessViewVisible} />
      </PageHeaderLayout>
    );
  }
}
