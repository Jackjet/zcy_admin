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
import styles from './YearEvaluationBill.less';
import Evaluation from './evaluation/Evaluation';

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
export default class YearEvaluationBill extends PureComponent {
  state = {
    EvaluationVisible: false,
    EvaluationViewVisible: false,
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

  handleEvaluationMethodsVisible = flag => {
    this.setState({
      EvaluationMethodsVisible: !!flag,
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
            <FormItem label="公司">
              {getFieldDecorator('contractCode')(
                <Input placeholder="请选择公司" />
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }


  // 考评
  showEvaluation =(flag, record)=> {
    this.setState({
      EvaluationVisible: !!flag,
      rowInfo: record,
    });
  };

  //查看考评
  showViewEvaluation =(flag, record)=> {
    this.setState({
      EvaluationViewVisible: !!flag,
      rowInfo: record,
    });
  };





  render() {
    let _this = this;
    const { rule: { data }, loading } = this.props;
    const { EvaluationVisible,  rowInfo } = this.state;




    function NestedTable() {

      // 项目
      const expandedRowRenderpriject = () => {
        const columns = [
          { title: '项目编码', dataIndex: 'date', key: 'date' },
          { title: '项目名称', dataIndex: 'name', key: 'name' },
          { title: '项目状态', key: 'state', render: () => <span><Badge status="success" />完成、审核、生成报告</span> },
          { title: '考评分', dataIndex: 'upgradeNum', key: 'upgradeNum' },

        ];

        const data = [];
        for (let i = 0; i < 2; ++i) {
          data.push({
            key: i,
            date: '项目code0+i',
            name: '杭州市地铁审计项目'+i,
            upgradeNum:  10+i,
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




      //人员
      const expandedRowRenderPerson = () => {
        const columns = [
          { title: '人员编码', dataIndex: 'date', key: 'date' },
          { title: '人员姓名', dataIndex: 'name', key: 'name' },
          { title: '是否合伙人', key: 'state', render: () => <span><Badge status="success" />是、否</span> },
          { title: '总分', dataIndex: 'score', key: 'score' },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text,record) => (
              <Fragment>
                <a onClick={() =>showEvaluation(true, record)} >考评</a>
                <Divider type="vertical" />
                <a onClick={() =>this.showViewEvaluation(true, record)} >查看</a>
              </Fragment>
            ),
          },
        ];

        const data = [];
        for (let i = 0; i < 4; ++i) {
          data.push({
            key: i,
            date: '人员code'+i,
            name: '张三'+i,
            upgradeNum:  i==1 ? '执行合伙人' : i==2 ? '管理合伙人' : i==3 ? '技术合伙人' : '合伙人',
            score:  10.5,
          });
        }
        return (
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            expandedRowRender={expandedRowRenderpriject}
            bordered={true}
          />
        );
      };




      //部门
      const expandedRowRenderDepartment = () => {
        const columns = [
          { title: '部门编码', dataIndex: 'date', key: 'date' },
          { title: '部门项目', dataIndex: 'name', key: 'name' },
          { title: '合伙人', key: 'state', render: () => <span><Badge status="success" />张三、李四</span> },

        ];

        const data = [];
        for (let i = 0; i < 3; ++i) {
          data.push({
            key: i,
            date: '部门code'+i,
            name: '审计一部',
          });
        }
        return (
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            expandedRowRender={expandedRowRenderPerson}
            bordered={false}
          />
        );
      };

      //主表格
      const columns = [
        { title: '公司编码', dataIndex: 'name', key: 'name' },
        { title: '公司名称', dataIndex: 'platform', key: 'platform' },
      ];

      const data = [];
      for (let i = 0; i < 1; ++i) {
        data.push({
          key: i,
          name: 'xxx至诚审计'+i,
          platform: '杭州至诚事务所'+i,

        });
      }

      return (
        <Table
          className="components-table-demo-nested"
          columns={columns}
          expandedRowRender={expandedRowRenderDepartment}
          dataSource={data}
          bordered={false}
          pagination={false}
        />
      );
    }


    const EvaluationMethods = {
      handleEvaluationVisible: this.handleEvaluationMethodsVisible,
    };

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
        <Evaluation {...EvaluationMethods} EvaluationVisible={EvaluationVisible} rowInfo={rowInfo} />
        {/*<ContractEditModal {...contractEditMethods} contractEditVisible={contractEditVisible} rowInfo={rowInfo} />*/}
      </PageHeaderLayout>
    );
  }
}
