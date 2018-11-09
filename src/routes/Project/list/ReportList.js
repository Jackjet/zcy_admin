import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  Badge,
  Divider,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import styles from './Style.less';
import ReportAddModal from '../add/ReportAddModal.js';
import ReportView from '../select/ReportView.js';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { reportVisible, form, handleAdd, handleReportVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      title="报告基本信息新增"
      visible={reportVisible}
      width="90%"
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleReportVisible()}
    >
      <ReportAddModal />
    </Modal>
  );
});
const CheckProjectList = Form.create()(props => {
  const { checkVisible, handleCheckVisible } = props;
  const okHandle = () => handleCheckVisible();
  return (
    <Modal
      title="报告信息查看"
      visible={checkVisible}
      width="90%"
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleCheckVisible()}
      footer={null}
    >
      <ReportView />
    </Modal>
  );
});

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class ReportList extends PureComponent {
  state = {
    reportVisible: false,
    checkVisible: false,
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
      case 'check':
        this.handleCheckVisible(true);
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

  handleReportVisible = flag => {
    this.setState({
      reportVisible: !!flag,
    });
  };

  handleCheckVisible = flag => {
    this.setState({
      checkVisible: !!flag,
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
      reportVisible: false,
    });
  };

  rootSubmenuKeys = ['sub1'];

  treemenu() {
    const { SubMenu } = Menu;
    return (
      <Menu
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 140 }}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <span>项目类别</span>
            </span>
          }
        >
          <Menu.Item key="工程造价业务项目">工程造价业务项目</Menu.Item>
          <Menu.Item key="2">咨询报告</Menu.Item>
          <Menu.Item key="3">招标代理业务项目</Menu.Item>
          <Menu.Item key="4">打包项目</Menu.Item>
          <Menu.Item key="5">2010年免审批工程造价、招投标项目</Menu.Item>
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
            <FormItem label="编号名称">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="年度">
              {getFieldDecorator('years', {
                rules: [{ required: true, message: '请选择年度' }],
              })(
                <Select placeholder="请选择年度" style={{ width: 200 }}>
                  <Option value="xiao">请选择</Option>
                  <Option value="z">2018</Option>
                  <Option value="f">2019</Option>
                  <Option value="fd">2020</Option>
                  <Option value="sn">2021</Option>
                  <Option value="zf">2022</Option>
                  <Option value="sy">2023</Option>
                  <Option value="jr">2024</Option>
                </Select>
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                更多 <Icon type="down" />
              </a>
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
            <FormItem label="编码名称">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="负责人">
              {getFieldDecorator('pinyin')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="负责公司">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
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
                rules: [{ required: false, message: '请选择日期' }],
              })(<RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />)}
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
    const { selectedRows, reportVisible, checkVisible } = this.state;
    const columns = [
      {
        title: '报告编号',
        dataIndex: 'no',
        render: text => (
          <a className={styles.a} onClick={() => this.handleCheckVisible(true)}>
            {text}
          </a>
        ),
      },
      {
        title: '报告性质',
        dataIndex: 'name',
      },
      {
        title: '报告类别',
        dataIndex: 'linkman',
      },
      {
        title: '名称',
        dataIndex: 'status',
      },
      {
        title: '文件类型',
        dataIndex: 'company',
      },
      {
        title: '出具时间',
        dataIndex: 'fee',
      },
      {
        title: '备注',
        dataIndex: 'cusname',
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a href="">编辑</a>
            <Divider type="vertical" />
            <Dropdown overlay={downhz}>
              <a>
                更多 <Icon type="down" />
              </a>
            </Dropdown>
          </Fragment>
        ),
      },
    ];

    const downhz = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="check">查看</Menu.Item>
        <Menu.Item key="del">删除</Menu.Item>
        <Menu.Item key="cancel">停用</Menu.Item>
        <Menu.Item key="cancelcancel">启用</Menu.Item>
      </Menu>
    );

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleReportVisible: this.handleReportVisible,
      handleCheckVisible: this.handleCheckVisible,
    };

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleReportVisible(true)}>
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
        </Card>
        <CreateForm {...parentMethods} reportVisible={reportVisible} />
        <CheckProjectList {...parentMethods} checkVisible={checkVisible} />
      </div>
    );
  }
}
