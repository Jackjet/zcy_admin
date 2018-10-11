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
  Table, Badge
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './ProjectEvaluationBill.less';

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
export default class ProjectEvaluationBill extends PureComponent {
  state = {
    contractVisible: false,
    contractEditVisible: false,
    contractTabsVisible: false,
    expandForm: false,
    selectedRows: [],
    rowInfo:{},
    formValues: {},
    openKeys: ['sub1'],
    choiceTypeKey: 0,
    choiceTypeValue:'',
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
    if(this.state.choiceTypeKey === 0) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warning('请选择指标类别');
      return false;
    }
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
              <span>项目类别</span>
            </span>
          }
        >
          <Menu.Item key='0'>全部</Menu.Item>
          <Menu.Item key='1'>工程造价业务项目</Menu.Item>
          <Menu.Item key='2'>可研报告</Menu.Item>
          <Menu.Item key='3'>招标代理业务项目</Menu.Item>
          <Menu.Item key='4'>司法鉴定</Menu.Item>
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
                <Input placeholder="请输入编码" />
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
            <FormItem label="编码">
              {getFieldDecorator('contractCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('contractName')(
                <Input placeholder="请输入" />
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
    const { selectedRows, contractVisible, contractEditVisible, contractTabsVisible, rowInfo, choiceTypeValue } = this.state;

    const menu = (
      <Menu>
        <Menu.Item>
          Action 1
        </Menu.Item>
        <Menu.Item>
          Action 2
        </Menu.Item>
      </Menu>
    );

    function NestedTable() {
      const expandedRowRender = () => {
        const columns = [
          { title: '考评日期', dataIndex: 'date', key: 'date' },
          { title: '考评项目', dataIndex: 'name', key: 'name' },
          { title: '考评性质', key: 'state', render: () => <span><Badge status="success" />增分、减分</span> },
          { title: '考评分', dataIndex: 'upgradeNum', key: 'upgradeNum' },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: () => (
              <span className="table-operation">
            <a href="javascript:;">Pause</a>
            <a href="javascript:;">Stop</a>
            <Dropdown overlay={menu}>
              <a href="javascript:;">
                More <Icon type="down" />
              </a>
            </Dropdown>
          </span>
            ),
          },
        ];

        const data = [];
        for (let i = 0; i < 3; ++i) {
          data.push({
            key: i,
            date: '2018-12-24 23:12:00',
            name: '商机、知识、启动快慢，拖延周期',
            upgradeNum:  56,
          });
        }
        return (
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered={true}
          />
        );
      };

      //主表格
      const columns = [
        { title: '项目编码', dataIndex: 'name', key: 'name' },
        { title: '项目名称', dataIndex: 'platform', key: 'platform' },
        { title: '项目考评分', dataIndex: 'version', key: 'version' },
        { title: '合伙人', dataIndex: 'upgradeNum', key: 'upgradeNum' },
        { title: '项目经理', dataIndex: 'creator', key: 'creator' },
        { title: '项目启动时间', dataIndex: 'createdAt', key: 'createdAt' },
        { title: '备注', key: 'operation', render: () => <a href="javascript:;">Publish</a> },
      ];

      const data = [];
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          name: 'xxx项目'+i,
          platform: '项目名称'+i,
          version: 10+i,
          upgradeNum: '张'+i,
          creator: 'Jack',
          createdAt: '2018-12-24 23:12:00',
        });
      }

      return (
        <Table
          className="components-table-demo-nested"
          columns={columns}
          expandedRowRender={expandedRowRender}
          dataSource={data}
          bordered={true}
        />
      );
    }

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

                <NestedTable />
              </div>
            </Content>
          </Layout>
        </Card>
      </PageHeaderLayout>
    );
  }
}
