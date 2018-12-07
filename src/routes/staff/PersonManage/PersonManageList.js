import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  message,
  Divider,
  Layout,
  Badge,
} from 'antd';
import moment from 'moment/moment';
import PageLeftTreeMenu from '../../../components/PageLeftTreeMenu/index';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PersonAddModal from './PersonAddModal';
import PersonViewModal from './PersonViewModal';
import PersonEditModal from './PersonEditModal';
import DistributionRoleModal from './Role/DistributionRoleModal';
import DistributionAuthorityModal from './Authority/DistributionAuthorityModal';
import BatchDisAuthorityModal from './Authority/BatchDisAuthorityModal';
import BatchDisRoleModal from './Role/BatchDisRoleModal';
import OrgRangeBill from './OrgRange/OrgRangeBill';
import styles from './style.less';

// 提示信息配置  高度 消失时间 条数
message.config({
  top: 100, // 提示框弹出位置
  duration: 3, // 自动关闭延时，单位秒
  maxCount: 1, // 最大显示数目
});
const { Content, Sider } = Layout;
const statusMap = ['default', 'success'];
const status = ['离职', '在职'];
const sexStatusMap = ['warning', 'processing'];
const sexValue = ['女', '男'];
const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ person, loading }) => ({
  person,
  loading: loading.models.person,
}))
@Form.create()
export default class PersonManageList extends PureComponent {
  state = {
    PersonAddVisible: false, // 人员新增modal显隐状态
    PersonViewVisible: false, // 人员查看modal显隐状态
    PersonEditVisible: false, // 人员编辑modal显隐状态
    rowInfo: ``, // 选择的当前行的数据
    selectedRows: [], // 选择的行的集合
    formValues: {}, // 搜索框的值
    DistributionRoleVisible: false, // 分配角色modal显隐状态
    BatchDisRoleVisible: false, // 批量分配角色modal显隐状态
    DistributionAuthorityVisible: false, // 分配权限modal显隐状态
    BatchDisAuthorityVisible: false, // 批量分配权限modal显隐状态
    OrgRangeBillVisible: false, // 组织范围modal显隐状态
    orgTreeMenu:[], // 左侧树形的集合
    openKey: '', // 打开的父节点的key
    selectedKey:'',
    firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    currentPagination: [], // 获取当前行和页大小
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/getLeftTreeMenu',
      callback: (res) => {
        if(res.meta.status !== '000000' ) {
          message.error(res.data.alert_msg);
        } else {
          this.setState({
            orgTreeMenu : res.data.list,
          });
        }
      },
    });
    dispatch({
      type: 'person/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: res => {
        console.log(res.data);
        if (res.meta.status !== '000000') {
          message.error(res.data.alert_msg);
        } else {
          //
        }
      },
    });
  }

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

    this.setState({
      currentPagination: {
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    });

    dispatch({
      type: 'person/fetch',
      payload: params,
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
      type: 'person/fetch',
      payload: {},
      callback: res => {
        if (res.meta.status !== '000000') {
          message.error(res.meta.errmsg);
        } else {
          message.success('重置完成!');
        }
      },
    });
  };

  handleMenuClick = e => {
    const thisParam = this;
    const nameUser = thisParam.state.selectedRows.map(row => row.name).join(`,\n`);
    switch (e.key) {
      case 'remove':
        confirm({
          title: '确定删除以下公司?',
          content: (
            <div>
              <p>公司名称: {nameUser}</p>
              <p>操作人:当前登录用户</p>
              <p>时间:{moment().format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          ),
          onOk() {
            thisParam.props.dispatch({
              type: 'person/removeMore',
              payload: {
                ids: thisParam.state.selectedRows.map(row => row.id).join(','),
              },
              callback: () => {
                thisParam.setState({
                  selectedRows: [],
                });
                thisParam.props.dispatch({
                  type: 'person/fetch',
                  payload: {
                    page: 1,
                    pageSize: 10,
                  },
                });
                message.success('人员已删除');
              },
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      case '1':
        this.handleBatchDisRoleVisible(true);
        break;
      case '2':
        this.handleBatchDisAuthorityVisible(true);
        break;
      default:
        break;
    }
  };

  // 获取行数
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'person/fetch',
        payload: values,
        callback: res => {
          if (res.meta.status !== '000000') {
            message.error(res.data.alert_msg); // 返回错误信息
          } else {
            message.success('查询完成!');
          }
        },
      });
    });
  };

  // 人员 <新增> modal显隐方法
  handlePersonAddVisible = flag => {
    this.setState({
      PersonAddVisible: !!flag,
    });
  };

  // 人员 <查看> modal显隐方法
  handlePersonViewVisible = (flag, record) => {
    this.setState({
      PersonViewVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  // 人员 <编辑> modal显隐方法
  handlePersonEditVisible = (flag, record) => {
    this.setState({
      PersonEditVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  // <批量分配角色> modal显隐方法
  handleBatchDisRoleVisible = flag => {
    this.setState({
      BatchDisRoleVisible: !!flag,
    });
  };

  // <分配权限> modal显隐方法
  handleDistributionAuthorityVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      DistributionAuthorityVisible: !!flag,
    });
  };
  // <批量分配权限> modal显隐方法
  handleBatchDisAuthorityVisible = flag => {
    this.setState({
      BatchDisAuthorityVisible: !!flag,
    });
  };

  // <组织范围> modal显隐方法
  handleOrgRangeBillVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      OrgRangeBillVisible: !!flag,
    });
  };

  // <分配角色> modal显隐方法
  handleDistributionRoleVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      DistributionRoleVisible: !!flag,
    });
  };

  // 人员 <删除> 方法
  handleDeleteMsg = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'person/remove',
      payload: {
        id: record.id,
        deleteFlag: 0,
        uid: JSON.parse(localStorage.getItem("user")).id,
      },
      callback: (res) => {
        if (res.meta.status !== '000000') {
          message.error(res.data.alert_msg);
        } else {
          this.setState({
            selectedRows: [],
          });
          dispatch({
            type: 'person/fetch',
            payload: {},
          });
          message.success('人员删除成功!');
        }
      },
    });
  };

  // 人员 <状态> 启用方法
  handleCancelCancel = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'person/cancelCancel',
      payload: {
        id: record.id,
        status: 1,
        uid: JSON.parse(localStorage.getItem("user")).id,
      },
      callback: res => {
        if (res.meta.statusCode !== '000000') {
          message.error(res.data.alert_msg); // 返回错误信息
        }
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'person/fetch',
          payload: {
            page: this.state.currentPagination.page,
            pageSize: this.state.currentPagination.pageSize,
            keyWord: this.state.formValues.keyWord,
          },
        });
        message.success('人员启用成功!');
      },
    });
  };

  // 暂时有问题
  menuClick = e => {
    console.log(e.key);
    this.props.dispatch({
      type: 'company/getInfoById',
      payload: {
        parentId: e.key,
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {
          message.error(res.data.alert_msg);
        }
      },
    });
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyWord')(<Input placeholder="请输入关键字" />)}
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

  render() {
    const { person: { data }, loading } = this.props;
    const {
      selectedRows,
      PersonAddVisible,
      PersonViewVisible,
      PersonEditVisible,
      rowInfo,
      DistributionRoleVisible,
      BatchDisRoleVisible,
      DistributionAuthorityVisible,
      BatchDisAuthorityVisible,
      OrgRangeBillVisible,
    } = this.state;
    const columns = [
      {
        title: '工号',
        dataIndex: 'number',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        filters: [
          {
            text: sexValue[0],
            value: 0,
          },
          {
            text: sexValue[1],
            value: 1,
          },
        ],
        onFilter: (value, record) => record.sex.toString() === value,
        render(val) {
          return <Badge status={sexStatusMap[val]} text={sexValue[val]} />;
        },
      },
      {
        title: '岗位',
        dataIndex: 'post',
      },
      {
        title: '移动电话',
        dataIndex: 'mobilePhone',
      },
      {
        title: '办公电话',
        dataIndex: 'officePhone',
      },
      {
        title: '状态',
        dataIndex: 'personStatus',
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
        title: '操作',
        render: record => (
          <Fragment>
            <a onClick={() => this.handlePersonViewVisible(true, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.handlePersonEditVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDeleteMsg(true, record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handlePersonAddVisible: this.handlePersonAddVisible,
      handlePersonViewVisible: this.handlePersonViewVisible,
      handlePersonEditVisible: this.handlePersonEditVisible,
      handleDistributionRoleVisible: this.handleDistributionRoleVisible,
      handleBatchDisRoleVisible: this.handleBatchDisRoleVisible,
      handleDistributionAuthorityVisible: this.handleDistributionAuthorityVisible,
      handleBatchDisAuthorityVisible: this.handleBatchDisAuthorityVisible,
      handleOrgRangeBillVisible: this.handleOrgRangeBillVisible,
    };

    return (
      <PageHeaderLayout>
        <Card>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={140} style={{ background: '#fff' }}>
              <PageLeftTreeMenu
                menus={this.state.orgTreeMenu}
                onClick={this.menuClick}
                mode="inline"
                selectedKeys={[this.state.selectedKey]}
                openKeys={this.state.firstHide ? null : [this.state.openKey]}
                onOpenChange={this.openMenu}
              />
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.handlePersonAddVisible(true)}
                  >
                    新建
                  </Button>
                  {/*{selectedRows.length > 0 && (
                    <span>
                      <Button
                        type="primary"
                        onClick={() => this.handleDistributionAuthorityVisible(true)}
                      >
                        分配权限
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => this.handleDistributionRoleVisible(true)}
                      >
                        分配角色
                      </Button>
                      <Button type="primary" onClick={() => this.handleOrgRangeBillVisible(true)}>
                        组织范围维护
                      </Button>
                      <Dropdown overlay={batchMenu}>
                        <Button>
                          批量操作 <Icon type="down" />
                        </Button>
                      </Dropdown>
                    </span>
                  )}*/}
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
          <PersonAddModal {...parentMethods} PersonAddVisible={PersonAddVisible} />
          <PersonViewModal {...parentMethods} PersonViewVisible={PersonViewVisible} rowInfo={rowInfo} />
          <PersonEditModal {...parentMethods} PersonEditVisible={PersonEditVisible} rowInfo={rowInfo} />
          <DistributionRoleModal {...parentMethods} DistributionRoleVisible={DistributionRoleVisible} />
          <BatchDisRoleModal {...parentMethods} BatchDisRoleVisible={BatchDisRoleVisible} />
          <DistributionAuthorityModal {...parentMethods} DistributionAuthorityVisible={DistributionAuthorityVisible} />
          <BatchDisAuthorityModal {...parentMethods} BatchDisAuthorityVisible={BatchDisAuthorityVisible} />
          <OrgRangeBill {...parentMethods} OrgRangeBillVisible={OrgRangeBillVisible} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
