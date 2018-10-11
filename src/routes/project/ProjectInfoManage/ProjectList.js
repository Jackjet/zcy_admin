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
  Menu,
  DatePicker,
  message,
  Badge,
  Divider,
  Layout,
  Modal,
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from '../list/Style.less';
import ProjectAddModal from './ProjectAddModal.js';
import ProjectPlanAddModal from './ProjectPlan/ProjectPlanAddModal.js';
import ProjectProcessAddModal from './ProjectProcess/ProjectProcessAddModal.js';
import ProjectApplyAddModal from './ProjectApplyAddModal.js';
import ProjectChildrenAddModal from '../add/ProjectChildrenAddModal.js';
import ProjectViewTabs from '../projectTabsInfo/ProjectViewTabs.js';
import ProjectEditModal from '../edit/ProjectEditModal.js';
import AppraisalList from './Appraisal/AppraisalList';
import SignatureAddModal from '../SignatureAndSealInfoManage/SignatureAddModal';

const { confirm } = Modal;
const {Content, Sider} = Layout;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['success', 'error', 'default', 'processing', 'warning', 'default', 'processing', 'warning', 'error','success'];
const status = ['收款完成', '备忘', '经理审批', '盖章', '稽核审批', '生成报告号', '转职复核', '主签复核','已销毁','完成'];


@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class projectList extends PureComponent {
  state = {
    projectVisible: false,
    projectApplyAddVisible: false,
    projectChildrenAddVisible: false,
    projectEditVisible: false,
    projectTabsVisible: false,
    expandForm: false,
    selectedRows: [],
    choiceTypeKey: '0',
    choiceTypeValue:'',
    rowInfo:{},
    formValues: {},
    openKeys: ['sub1'],
    projectPlanAddVisible: false,
    projectProcessAddVisible: false,
    appraisalVisible: false,
    signatureAddVisible: false,
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
      case 'view':
        this.handleProjectViewVisible(true);
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

  handleProjectVisible = flag => {
    if(this.state.choiceTypeKey === "0" ){
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warning('请选择工程类别');
      return false;
    } else {
      this.setState({
        projectVisible: !!flag,
      });
    }
  };
  handleProjectApplyAddVisible = flag => {
    this.setState({
      projectApplyAddVisible: !!flag,
    });
  };
  handleProjectPlanAddVisible = flag => {
    this.setState({
      projectPlanAddVisible: !!flag,
    });
  };

  handleProjectProcessAddVisible = flag => {
    this.setState({
      projectProcessAddVisible: !!flag,
    });
  };

  showProjectApplyAddVisible = (flag, record) => {
    this.setState({
      projectApplyAddVisible: !!flag,
      rowInfo: record,
    });
  };

  handleProjectChildrenAddVisible = flag => {
    this.setState({
      projectChildrenAddVisible: !!flag,
    });
  };

  handleAppraisalVisible = flag => {
    this.setState({
      appraisalVisible: !!flag,
    });
  };



  handleProjectEditVisible = flag => {
    this.setState({
      projectEditVisible: !!flag,
    });
  };

  handleProjectTabsVisible = flag => {
    this.setState({
      projectTabsVisible: !!flag,
    });
  };

  handleSignatureAddVisible = flag => {
    this.setState({
      signatureAddVisible: !!flag,
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
      projectVisible: false,
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

  showViewMessage =(flag, record)=> {
    this.setState({
      projectTabsVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage =(flag, record)=> {
    this.setState({
      projectEditVisible: !!flag,
      rowInfo: record,
    });
  };

  handleDestroyApply = (record) => {
    const { dispatch } = this.props;
    confirm({
      title: `申请删除项目编码为：${record.projectCode}`,
      content:(
        <div>
          <p>项目名称:{record.projectName}</p>
          <p>销毁人:{record.projectName}</p>
          <p>销毁时间:{moment().format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
      ),
      keyboard:false,
      cancelText:'取消',
      okText:'确定',
      onOk() {
        dispatch({
          type: 'rule/remove',
          payload: {
            no: record.no,
          },
        });
        message.success('申请成功')
      },
      onCancel() {

      },
    });
    this.setState({
      selectedRows: [],
    });
  };

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
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                清空
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.toggleForm}>
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
    const {
      selectedRows,
      projectVisible,
      projectApplyAddVisible,
      projectTabsVisible,
      rowInfo,
      projectEditVisible,
      projectChildrenAddVisible,
      choiceTypeValue,
      projectPlanAddVisible,
      projectProcessAddVisible,
      appraisalVisible,
      signatureAddVisible,
    } = this.state;

    const columns = [
      {
        title: '项目编号',
        dataIndex: 'no',
        width: 150,
        fixed: 'left',
        render: (text, record) => (
          <Fragment>
            <a onClick={() =>this.showViewMessage(true, record)} >{text}</a>
          </Fragment>
        ),
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
      },
      {
        title: '负责人',
        dataIndex: 'linkman',
      },
      {
        title: '项目状态',
        dataIndex: 'projectStatus',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
          {
            text: status[3],
            value: 3,
          },
          {
            text: status[4],
            value: 4,
          },
          {
            text: status[5],
            value: 5,
          },
          {
            text: status[6],
            value: 6,
          },
          {
            text: status[7],
            value: 7,
          },
          {
            text: status[8],
            value: 8,
          },
          {
            text: status[9],
            value: 9,
          },
        ],
        onFilter: (value, record) => record.projectStatus.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '负责公司',
        dataIndex: 'company',
      },
      {
        title: '项目费用',
        dataIndex: 'fee',
      },
      {
        title: '客户名称',
        dataIndex: 'cusName',
      },
      {
        title: '客户联系人',
        dataIndex: 'cusLinkmen',
      },
      {
        title: '执行时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },

      {
        title: '操作',
        width: 300,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() =>this.showProjectApplyAddVisible(true, record)} >审批环节</a>
            <Divider type="vertical" />
            <a onClick={() =>this.showEditMessage(true, record)} >编辑</a>
            <Divider type="vertical" />
            <a onClick={this.handleDeleteClick} >删除</a>
            {
              (`${record.projectStatus}` !== '8') && (
                <span>
                  <Divider type="vertical" />
                  <a onClick={() =>this.handleDestroyApply(record)}>销毁申请</a>
                </span>
              )
            }
            {
              (`${record.projectStatus}` === "4") && (
                <span>
                  <Divider type="vertical" />
                  <a onClick={() =>this.handleSignatureAddVisible(true,record)}>签章申请</a>
                </span>
              )
            }
            {
              (`${record.projectStatus}` === '9') && (
                <span>
                  <Divider type="vertical" />
                  <a onClick={() =>this.handleAppraisalVisible(true)}>启动考评</a>
                </span>
              )
            }
          </Fragment>
        ),
      },
    ];


    const parentMethods = {
      handleAdd: this.handleAdd,
      handleProjectVisible: this.handleProjectVisible,
      handleProjectApplyAddVisible: this.handleProjectApplyAddVisible,
      handleProjectChildrenAddVisible: this.handleProjectChildrenAddVisible,
      handleProjectTabsVisible: this.handleProjectTabsVisible,
      handleProjectEditVisible: this.handleProjectEditVisible,
      handleProjectPlanAddVisible: this.handleProjectPlanAddVisible,
      handleProjectProcessAddVisible: this.handleProjectProcessAddVisible,
      handleAppraisalVisible: this.handleAppraisalVisible,
      handleSignatureAddVisible: this.handleSignatureAddVisible,
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
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleProjectVisible(true)}>
                    新建
                  </Button>
                  {selectedRows.length > 0 && (
                    <span>
                      <Button type="primary" onClick={() => this.handleProjectChildrenAddVisible(true)}>
                        新增子项目
                      </Button>
                      <Button type="primary" onClick={() => this.handleProjectPlanAddVisible(true)}>
                        新增项目计划
                      </Button>
                      <Button type="primary">
                        新增工时
                      </Button>
                      <Button type="primary" onClick={() => this.handleProjectProcessAddVisible(true)}>
                        新增过程汇报
                      </Button>
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
        <ProjectAddModal {...parentMethods} projectVisible={projectVisible} choiceTypeValue={choiceTypeValue} rowInfo={rowInfo} />
        <ProjectChildrenAddModal {...parentMethods} projectChildrenAddVisible={projectChildrenAddVisible} />
        <ProjectViewTabs {...parentMethods} projectTabsVisible={projectTabsVisible} rowInfo={rowInfo} />
        <ProjectEditModal {...parentMethods} projectEditVisible={projectEditVisible} rowInfo={rowInfo} />
        <ProjectPlanAddModal {...parentMethods} projectPlanAddVisible={projectPlanAddVisible} />
        <ProjectApplyAddModal {...parentMethods} projectApplyAddVisible={projectApplyAddVisible} rowInfo={rowInfo} />
        <ProjectProcessAddModal {...parentMethods} projectProcessAddVisible={projectProcessAddVisible}  />
        <AppraisalList {...parentMethods} appraisalVisible={appraisalVisible} />
        <SignatureAddModal {...parentMethods}  signatureAddVisible={signatureAddVisible} />
      </PageHeaderLayout>
    );
  }
}
