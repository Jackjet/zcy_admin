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
import PageLeftTreeMenu from '../../../components/PageLeftTreeMenu';
import StandardTable from '../../../components/StandardTable/index';
import GenerateReportModal from './GenerateReportModal';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import ProjectAddModal from './ProAddModal';
import ProjectPlanAddModal from './ProjectPlan/ProjectPlanAddModal';
import ProjectProcessAddModal from './ProjectProcess/ProjectProcessAddModal';
import ProjectApplyAddModal from './ProjectApprovalLinkModal';
import ProjectChildrenAddModal from './ProjectChildrenAddModal';
import ProjectViewTabs from './ProViewModal';
import ProjectEditModal from './ProEditModal';
import AppraisalList from './Appraisal/AppraisalList';
import SignatureAddModal from './SignatureAndSealInfoManage/SignatureAddModal';

const { confirm } = Modal;
const { Content, Sider } = Layout;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = [
  'success',
  'error',
  'default',
  'processing',
  'warning',
  'default',
  'processing',
  'warning',
  'error',
  'success',
];
const status = [
  '收款完成',
  '备忘',
  '经理审批',
  '盖章',
  '稽核审批',
  '生成报告号',
  '转职复核',
  '主签复核',
  '已销毁',
  '完成',
];

@connect(({ project, loading }) => ({
  project,
  loading: loading.models.project,
}))
@Form.create()
export default class ProjectList extends PureComponent {
  state = {
    proAddVisible: false, // 项目新增modal显示
    projectApplyAddVisible: false,
    projectChildrenAddVisible: false, // 子项目新增modal显示
    projectEditVisible: false, // 项目编辑modal显示
    projectTabsVisible: false, // 项目查看modal显示
    expandForm: false, // 简单搜索和高级搜索之间切换
    selectedRows: [], // 获取选中的行的集合
    choiceTypeKey: '', // 左边树点击时的key
    choiceTypeValue: '', // 左边树点击时的val
    rowInfo: {}, // 获取当前行的数据
    formValues: {}, // form表单的数据集
    projectPlanAddVisible: false, // 项目计划新增modal显示
    projectProcessAddVisible: false, // 项目审核新增
    appraisalVisible: false, // 评价
    signatureAddVisible: false, // 签字。盖章
    proTypeTree:[], // 左边树形列表
    openKey: '',
    selectedKey:'',
    firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    generateReportVisible: false,
    messageClickData: null,
  };

  // 加载组建时,加载列表数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'billTable/getDictTreeByTypeId',
      payload: {
        page: 1,
        pageSize: 9999,
        dictTypeId:"1821fe9feef711e89655186024a65a7c",
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {
          message.error("获取类型失败！"+res.data.alert_msg)
        }else{
          this.setState({
            proTypeTree : res.data.list,
          });
        }
      },
    });
  }

  // 分页器上一页下一页方法，刷新页面
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'project/fetch',
      payload: params,
    });
  };

  // 页表查询方法
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

  // 重置方法
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

  // 简单查询和高级查询切换
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
  }; // 批量操作 点击方法

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  }; // 获取当前选中的行


  handleGenerateReportVisible = (flag) => {
    this.setState({
      generateReportVisible: !!flag,
    });
  };

  // 项目新增显示隐藏方法
  handleProAddVisible = flag => {
    if (this.state.choiceTypeKey) {
      this.setState({
        proAddVisible: !!flag,
      });
    } else {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warning('请选择工程类别');
      return false;
    }
  };

  // 审批环节显示隐藏方法
  handleProjectApplyAddVisible = flag => {
    this.setState({
      projectApplyAddVisible: !!flag,
    });
  };

  // 审批环节显示隐藏方法 并 传参数
  showProjectApplyAddVisible = (flag, record) => {
    this.setState({
      projectApplyAddVisible: !!flag,
      rowInfo: record,
    });
  };

  // 项目计划显示隐藏方法
  handleProjectPlanAddVisible = flag => {
    this.setState({
      projectPlanAddVisible: !!flag,
    });
  };

  // 项目新增过程汇报方法
  handleProjectProcessAddVisible = flag => {
    this.setState({
      projectProcessAddVisible: !!flag,
    });
  };

  // 项目新增子项目方法
  handleProjectChildrenAddVisible = flag => {
    this.setState({
      projectChildrenAddVisible: !!flag,
    });
  };

  // 考评启动方法
  handleAppraisalVisible = flag => {
    this.setState({
      appraisalVisible: !!flag,
    });
  };

  // 项目编辑方法
  handleProjectEditVisible = flag => {
    this.setState({
      projectEditVisible: !!flag,
    });
  };

  // 项目编辑方法 带入当前行数据
  showEditMessage = (flag, record) => {
    this.setState({
      projectEditVisible: !!flag,
      rowInfo: record,
    });
  };

  // 项目基本信息查看方法
  handleProjectTabsVisible = flag => {
    this.setState({
      projectTabsVisible: !!flag,
    });
  };

  // 项目基本信息查看方法 带入当前行数据
  showViewMessage = (flag, record) => {
    this.setState({
      projectTabsVisible: !!flag,
      rowInfo: {
        ...record,
        projectType: `招标代理业务项目`,
        BillSource: `工程造价`,
      },
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
  }; // 删除方法
  handleSignatureAddVisible = flag => {
    this.setState({
      signatureAddVisible: !!flag,
    });
  }; // 签章申请方法

  menuClick = e => {
    const { proTypeTree } = this.state;
    console.log(e.key);
    let vailData = "";
    if (proTypeTree && proTypeTree[0].children) {
      vailData =  proTypeTree[0].children.map((params) => {
        if(e.key === params.key){
          return params.title;
        }
        return "";
      })
    }
    this.setState({
      selectedKey: e.key,
      choiceTypeKey: e.key,
      choiceTypeValue: vailData,
    });
    // 根据id 查询列表
    /*if(e.key){
      const { dispatch } = this.props;
      dispatch({
        type: 'dict/fetch',
        payload: {
          page: 1,
          pageSize: 10,
          dictTypeId:e.key,
        },
        callback: (res) => {
          if(res.meta.status !== '000000' ) {
            message.error("查询出错，请稍后再试！")
          }else{
            //

          }
        },
      });
    }*/
  }; // 左边树形菜单 点击事件
  openMenu = v => {
    this.setState({
      openKey: v[v.length - 1],
      firstHide: false,
    })
  }; // 左边树形菜单 打开收缩事件

  handleGetMenuValue = MenuValue => {
    this.setState({
      choiceTypeKey: MenuValue.key,
      choiceTypeValue: MenuValue.item.props.children,
    });
  }; // 获取左边树点击的节点的key和val

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
          <Menu.Item key="0">全部</Menu.Item>
          <Menu.Item key="1">工程造价业务项目</Menu.Item>
          <Menu.Item key="2">可研报告</Menu.Item>
          <Menu.Item key="3">招标代理业务项目</Menu.Item>
          <Menu.Item key="4">司法鉴定</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }

  handleDestroyApply = record => {
    const { dispatch } = this.props;
    confirm({
      title: `申请删除项目编码为：${record.projectCode}`,
      content: (
        <div>
          <p>项目名称:{record.projectName}</p>
          <p>销毁人:{record.projectName}</p>
          <p>销毁时间:{moment().format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
      ),
      keyboard: false,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        dispatch({
          type: 'rule/remove',
          payload: {
            no: record.no,
          },
        });
        message.success('申请成功');
      },
      onCancel() {},
    });
    this.setState({
      selectedRows: [],
    });
  }; // 申请销毁方法

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyWord')(
                <Input placeholder="请输入关键字" />
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
  } // 简单查询

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
  } // 高级查询

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  } // 简单查询高级查询切换

  render() {
    const { project: { data }, loading } = this.props;
    const {
      selectedRows,
      proAddVisible,
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
      generateReportVisible,
      messageClickData,
    } = this.state;
    const columns = [
      {
        title: '项目编号',
        dataIndex: 'number',
        width: 90,
        fixed: 'left',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showViewMessage(true, record)}>{text}</a>
          </Fragment>
        ),
      },
      {
        title: '项目名称',
        dataIndex: 'name',
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
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showProjectApplyAddVisible(true, record)}>审批环节</a>
            <Divider type="vertical" />
            <a onClick={() => this.showEditMessage(true, record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={this.handleDeleteClick}>删除</a>
            {`${record.projectStatus}` !== '8' && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => this.handleDestroyApply(record)}>销毁申请</a>
              </span>
            )}
            {`${record.projectStatus}` === '4' && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => this.handleSignatureAddVisible(true, record)}>签章申请</a>
              </span>
            )}
            {`${record.projectStatus}` === '9' && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => this.handleAppraisalVisible(true)}>启动考评</a>
              </span>
            )}
          </Fragment>
        ),
      },
    ];
    const parentMethods = {
      handleProAddVisible: this.handleProAddVisible,
      handleProjectApplyAddVisible: this.handleProjectApplyAddVisible,
      handleProjectChildrenAddVisible: this.handleProjectChildrenAddVisible,
      handleProjectTabsVisible: this.handleProjectTabsVisible,
      handleProjectEditVisible: this.handleProjectEditVisible,
      handleProjectPlanAddVisible: this.handleProjectPlanAddVisible,
      handleProjectProcessAddVisible: this.handleProjectProcessAddVisible,
      handleAppraisalVisible: this.handleAppraisalVisible,
      handleSignatureAddVisible: this.handleSignatureAddVisible,
      handleGenerateReportVisible: this.handleGenerateReportVisible,
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={140} style={{ background: '#fff' }}>
              <PageLeftTreeMenu
                menus={this.state.proTypeTree} // 菜单列表值
                onClick={this.menuClick}
                mode="inline"
                selectedKeys={[this.state.selectedKey]}
                openKeys={this.state.firstHide ? null : [this.state.openKey]}
                onOpenChange={this.openMenu}
              />
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.handleProAddVisible(true)}
                  >
                    新建
                  </Button>
                  {/*<Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.handleGenerateReportVisible(true)}
                  >
                    测试项目生成
                  </Button>*/}
                  {selectedRows.length > 0 && (
                    <span>
                      <Button
                        type="primary"
                        onClick={() => this.handleProjectChildrenAddVisible(true)}
                      >
                        新增子项目
                      </Button>
                      <Button type="primary" onClick={() => this.handleProjectPlanAddVisible(true)}>
                        新增项目计划
                      </Button>
                      <Button type="primary">新增工时</Button>
                      <Button
                        type="primary"
                        onClick={() => this.handleProjectProcessAddVisible(true)}
                      >
                        新增过程汇报
                      </Button>
                    </span>
                  )}
                </div>
                <StandardTable
                  scroll={{ x: 1500 }}
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
        <ProjectAddModal {...parentMethods} proAddVisible={proAddVisible} choiceTypeValue={choiceTypeValue} messageClickData={messageClickData} rowInfo={rowInfo} />
        <ProjectChildrenAddModal{...parentMethods} projectChildrenAddVisible={projectChildrenAddVisible} />
        <ProjectViewTabs {...parentMethods} projectTabsVisible={projectTabsVisible} rowInfo={rowInfo} />
        <ProjectEditModal{...parentMethods} projectEditVisible={projectEditVisible} rowInfo={rowInfo} />
        <ProjectPlanAddModal {...parentMethods} projectPlanAddVisible={projectPlanAddVisible} />
        <ProjectApplyAddModal {...parentMethods}  projectApplyAddVisible={projectApplyAddVisible}  rowInfo={rowInfo} />
        <ProjectProcessAddModal {...parentMethods} projectProcessAddVisible={projectProcessAddVisible} />
        <AppraisalList {...parentMethods} appraisalVisible={appraisalVisible} />
        <SignatureAddModal {...parentMethods} signatureAddVisible={signatureAddVisible} />
        <GenerateReportModal {...parentMethods} generateReportVisible={generateReportVisible} />
      </PageHeaderLayout>
    );
  }
}
