import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
  message,
  Modal,
  Badge,
} from 'antd';
import moment from "moment/moment";
import PageLeftTreeMenu from '../../components/PageLeftTreeMenu';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import AllocationAddModal from './ProAssignAddModal.js';

message.config({
  top: 100, // 提示框弹出位置
  duration: 3, // 自动关闭延时，单位秒
  maxCount: 1, // 最大显示数目
});
const { confirm } = Modal;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Content,  Sider } = Layout;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ projectAssignment, loading }) => ({
  projectAssignment,
  loading: loading.models.projectAssignment,
}))
@Form.create()
export default class ProAssignList extends PureComponent {
  state = {
    AllocationAddVisible: false, // 新增状态
    selectedRows: [], // 选中行
    formValues: {}, // 表单值
    openKeys: ['sub1'], // treeMenu 的父节点id
    choiceTypeKey: 0,
    choiceTypeValue:'',
    pageCurrent:``, // 当前页
    pageSizeCurrent:``, // 当前页大小
    proTypeTreeMenu:[],
    openKey: '',
    selectedKey:'',
    firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/getLeftTreeMenu',
      callback: (res) => {
        if(res.meta.status === '000000' ) {
          this.setState({
            proTypeTreeMenu : res.data.list,
          });
        } else {
          message.error(res.meta.errmsg);
        }
      },
    });
    dispatch({
      type: 'projectAssignment/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },callback: (res) => {
        if(res.meta.status !== '000000' ) {
          message.error(res.meta.errmsg);
        }
      },
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
  }; // 菜单树父节点开关方法

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => { // reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
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
    this.setState({
      pageCurrent: params.page,
      pageSizeCurrent: params.pageSize,
    });
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'projectAssignment/fetch',
      payload: params,
    });
  }; // 分页器上一页，下一页方法

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'projectAssignment/fetch',
      payload: {},
      callback: res => {
        if (res.meta.status !== '000000') {
          message.error(res.meta.errmsg);
        } else {
          message.success('重置完成!');
        }
      },
    });
  }; // 搜索的重置方法

  handleGetMenuValue = (MenuValue) => {
    this.setState({
      choiceTypeKey: MenuValue.key,
      choiceTypeValue: MenuValue.item.props.children,
    });
  };

  /*handleMenuClick = e => {
    const thisParam = this;
    const nameCompany = thisParam.state.selectedRows.map(row => row.name).join(`,\n`);
    switch (e.key) {
      case 'remove':
        confirm({
          title: '确定删除以下部门?',
          content: (
            <div>
              <p>部门名称: {nameCompany}</p>
              <p>操作人:当前登录用户</p>
              <p>时间:{moment().format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          ),
          onOk() {
            thisParam.props.dispatch({
              type: 'projectAssignment/removeMore',
              payload: {
                ids: thisParam.state.selectedRows.map(row => row.id).join(','),
              },
              callback: () => {
                thisParam.setState({
                  selectedRows: [],
                });
                thisParam.props.dispatch({
                  type: 'projectAssignment/fetch',
                  payload: {
                    page: thisParam.state.pageCurrent,
                    pageSize: thisParam.state.pageSizeCurrent,
                  },
                });
                message.success('部门已删除');
              },
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      default:
        break;
    }
  };*/

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  }; // 获取当前选中的行

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'projectAssignment/fetch',
        payload: values,
        callback: res => {
          if (res.meta.status !== '000000') {
            message.error(res.meta.errmsg); // 返回错误信息
          } else {
            this.setState({
              selectedRows: [],
              pageCurrent: 1,
              pageSizeCurrent: res.data.pagination.pageSize,
            });
            message.success('查询完成!');
          }
        },
      });
    });
  }; // 查询方法

  handleAllocationAddVisible = flag => {
    /*if(this.state.choiceTypeKey === 0) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warning('请选择项目类别');
      return false;
    }*/
    this.setState({
      AllocationAddVisible: !!flag,
    });
    if(!flag){
      this.props.dispatch({
        type: 'projectAssignment/fetch',
        payload: {
          page: this.state.pageCurrent,
          pageSize: this.state.pageSizeCurrent,
        },
        callback: (res) => {
          if(res.meta.status !== '000000' ) {
            message.error(res.meta.errmsg);  // 返回错误信息
          }
        },
      })
    }
  }; // 申请单新增

  rootSubmenuKeys = ['sub1'];

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
          <Menu.Item key="1">工程造价业务项目</Menu.Item>
          <Menu.Item key="2">可研报告</Menu.Item>
          <Menu.Item key="3">招标代理业务项目</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }

  menuClick = e => {
    this.setState({
      selectedKey: e.key,
    });
  };
  openMenu = v => {
    this.setState({
      openKey: v[v.length - 1],
      firstHide: false,
    })
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col span={6}>
            <FormItem label="关键字">
              {getFieldDecorator('keyWord')(<Input placeholder="关键字" />)}
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

  render() {
    const { projectAssignment: { data }, loading } = this.props;
    const { selectedRows, AllocationAddVisible, choiceTypeValue, proTypeTreeMenu } = this.state;

    const columns = [
      {
        title: '指派编号',
        dataIndex: 'number',
        align: 'center',
      },
      {
        title: '项目名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '项目经理',
        dataIndex: 'proMan',
        align: 'center',
      },
      {
        title: '部门经理',
        dataIndex: 'deptMan',
        align: 'center',
      },
      {
        title: '项目状态',
        dataIndex: 'status',
        align: 'center',
      },
      {
        title: '执行（项目创建）时间',
        dataIndex: 'createData',
        align: 'center',
      },
      {
        title: '耗时（天）',
        dataIndex: 'signTime',
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const AllocationAddMethods = {
      handleAllocationAddVisible: this.handleAllocationAddVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={140} style={{ background: '#fff' }}>
              {/*{this.treeMenu()}*/}
              <PageLeftTreeMenu
                menus={proTypeTreeMenu}
                onClick={this.menuClick}
                mode="inline"
                selectedKeys={[this.state.selectedKey]}
                openKeys={this.state.firstHide ? null : [this.state.openKey]}
                onOpenChange={this.openMenu}
              />
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280}}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleAllocationAddVisible(true)}>
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
            </Content>
          </Layout>
        </Card>
        <AllocationAddModal {...AllocationAddMethods} AllocationAddVisible={AllocationAddVisible} choiceTypeValue={choiceTypeValue} />
      </PageHeaderLayout>
    );
  }
}
