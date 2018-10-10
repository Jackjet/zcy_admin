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
  DatePicker,
  Modal,
  message,
  Divider,
  Popconfirm,
  Layout
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable from '../../../components/StandardTable/index';
import styles from './Style.less';

const { Content,  Sider } = Layout;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
export default class PriceIssueList extends PureComponent {
  state = {
    expandForm: false,
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

  rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

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

  confirm = () => {
    message.success('Click on Yes');
  };

  cancel = () => {
    message.error('Click on No');
  };

  rootSubmenuKeys = ['sub1'];

  treeMenu() {
    const { SubMenu } = Menu;
    return (
      <Menu
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 210 }}
        onClick={this.handleGetMenuValue}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <span>材料价格类别</span>
            </span>
          }
        >
            <SubMenu
              key="sub2"
              title={
                <span>
              <span>有材料价格</span>
            </span>
              }
            >
              <SubMenu
                key="sub21"
                title={
                  <span>
              <span>建筑材料</span>
            </span>
                }
              >
                <Menu.Item key="211">水泥
                </Menu.Item>
                <Menu.Item key="212" title={'水泥制品'}>水泥制品</Menu.Item>
                <Menu.Item key="213" title={'砖、瓦、砂、石、灰'}>砖、瓦、砂、石、灰</Menu.Item>

              </SubMenu>

            </SubMenu>

          <SubMenu
            key="sub3"
            title={
              <span>
              <span>无材料价格</span>
            </span>
            }
          >
            <Menu.Item key="1">有材料价格


            </Menu.Item>
            <Menu.Item key="2">无材料价格</Menu.Item>

          </SubMenu>

        </SubMenu>
      </Menu>
    );
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('no')(
                <Input placeholder="请输入编码名称" />
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '材料类型',
        dataIndex: 'organizeCode',
        width: 90,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '材料名称',
        dataIndex: 'organizeName',
        width: 90,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '规格型号',
        dataIndex: 'phone',
      },
      {
        title: '单位',
        dataIndex: 'phone',
      },
      {
        title: '采集时间',
        dataIndex: 'fzperson',
      },
      {
        title: '含税信息价格',
        dataIndex: 'status',
      },
      {
        title: '除税信息价格',
        dataIndex: 'status',
      },
    ];

    const downMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="turnOn">停用</Menu.Item>
        <Menu.Item key="turnOff">启用</Menu.Item>
      </Menu>
    );

    const batchMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={210} style={{ background: '#fff' }}>
              {this.treeMenu()}
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280}}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick=''
                  >
                    导入
                  </Button>
                  {selectedRows.length > 0 && (
                    <span>
                    <Dropdown overlay={batchMenu}>
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
      </PageHeaderLayout>


    );
  }
}
