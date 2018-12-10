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
  Modal,
  Table,
} from 'antd';
import moment from 'moment/moment';
import PageLeftTreeMenu from "../../../components/PageLeftTreeMenu";
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PersonAddModal from './UserAddModal';
import PersonViewModal from './UserViewModal';
import PersonEditModal from './UserEditModal';
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
const { confirm } = Modal;
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

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
export default class UserList extends PureComponent {
  state = {
    PersonAddVisible: false, // 用户新增
    PersonViewVisible: false, // 查看
    PersonEditVisible: false,  // 编辑
    rowInfo: ``, // 当前操作行的数据
    expandForm: false,
    selectedRows: [],
    formValues: {},
    DistributionRoleVisible: false, // 分配角色
    BatchDisRoleVisible: false, // 批量分配角色
    DistributionAuthorityVisible: false, // 分配权限
    BatchDisAuthorityVisible: false, // 批量分配权限
    OrgRangeBillVisible: false, // 组织范围
    leftTreeVal: ``,
    choiceTypeKey:``,
    choiceTypeValue: ``,
    billTableTypeTree:[], // 左边树形列表
    openKey: '',
    selectedKey:'',
    firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    permItemGroup: [], // 子组件权限右侧数据
    roleGroup: [], // 子组件角色右侧数据
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: res => {
        if (res.meta.status !== '000000') {
          message.error(res.meta.errmsg);
        } else {
          //
        }
      },
    }); // 列表数据查询

    dispatch({
      type: 'billTable/getDictTreeByTypeId',
      payload: {
        page: 1,
        pageSize: 9999,
        dictTypeId:"84ef4a13ee0d11e88aa5186024a65a7c", // 父节点的id
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {
          message.error("获取类型失败！"+res.data.alert_msg)
        }else{
          this.setState({
            billTableTypeTree : res.data.list, // 获取的树的数据
          });
        }
      },
    });  // 查询树形结构
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

    dispatch({
      type: 'user/fetch', // 翻页时，上一页下一页刷新列表
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
      type: 'user/fetch',
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

  // 简单搜索和高级搜索切换
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  // 删除方法
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
              type: 'user/removeMore',
              payload: {
                ids: thisParam.state.selectedRows.map(row => row.id).join(','),
              },
              callback: () => {
                thisParam.setState({
                  selectedRows: [],
                });
                thisParam.props.dispatch({
                  type: 'user/fetch',
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

  // 左边树形菜单 点击事件
  menuClick = e => {
    const { billTableTypeTree } = this.state;
    console.log(e.key);
    let vailData = "";
    if (billTableTypeTree && billTableTypeTree[0].children) {
      vailData =  billTableTypeTree[0].children.map((params) => {
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
  };

  // 左边树形菜单 打开收缩事件
  openMenu = v => {
    this.setState({
      openKey: v[v.length - 1],
      firstHide: false,
    })
  };

  // 获取选中的行
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
        type: 'user/fetch',
        payload: values,
        callback: res => {
          if (res.meta.status !== '000000') {
            message.error(res.meta.errmsg); // 返回错误信息
          } else {
            this.setState({
              selectedRows: [],
            });
            message.success('查询完成!');
          }
        },
      });
    });
  };

  // 用户 <新增> modal显隐方法
  handlePersonAddVisible = (flag)=> {
    this.setState({
      PersonAddVisible: !!flag,
    });
  };

  // 用户 <查看> modal显隐方法
  handlePersonViewVisible = (flag, record) => {
    this.setState({
      PersonViewVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  // 用户 <编辑> modal显隐方法
  handlePersonEditVisible = (flag, record) => {
    this.setState({
      PersonEditVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  //  <批量分配角色> modal显隐方法
  handleBatchDisRoleVisible = flag => {
    this.setState({
      BatchDisRoleVisible: !!flag,
    });
  };

  //  <分配权限> modal显隐方法
  handleDistributionAuthorityVisible = (flag, record) => {
    const { dispatch } = this.props;
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    dispatch({
      type: 'userPerm/fetch',
      payload: {},
      callback: (res) => {
        if (res.meta.status !== "000000") {
          message.error(res.data.alert_msg);
        } else if(res.data.list) {
          this.setState({
            permItemGroup: res.data.list.map(item => item.permId),
          })
        }
      },
    });
    this.setState({
      DistributionAuthorityVisible: !!flag,
      rowInfo:{
        ...record,
      },
    });
  };

  //  <批量分配权限> modal显隐方法
  handleBatchDisAuthorityVisible = flag => {
    this.setState({
      BatchDisAuthorityVisible: !!flag,
    });
  };

  //  <组织范围> modal显隐方法
  handleOrgRangeBillVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      OrgRangeBillVisible: !!flag,
    });
  };

  // 分配角色 modal显隐方法
  handleDistributionRoleVisible = (flag, record) => {
    const { dispatch } = this.props;
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    dispatch({
      type: 'userRole/fetch',
      payload: {},
      callback: (res) => {
        if (res.meta.status !== "000000") {
          message.error(res.data.alert_msg);
        } else {
          const resVal = res.data.list;
          if (resVal) {
            this.setState({
              roleGroup: resVal.map(item => item.roleId ),
            })
          }
        }
      },
    });
    this.setState({
      DistributionRoleVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  showDeleteMessage = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/remove',
      payload: {
        id: record.id,
        deleteFlag: 0,
      },
      callback: res => {
        if (res.meta.status !== '000000') {
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            selectedRows: [],
          });
          dispatch({
            type: 'user/fetch',
            payload: {},
          });
          message.success('人员删除成功!');
        }
      },
    });
  };

  // 公司状态启用方法
  handleCancelCancel = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/cancelCancel',
      payload: {
        id: record.id,
        status: 1,
      },
      callback: res => {
        if (res.meta.statusCode !== '000000') {
          message.error('res.meta'); // 返回错误信息
        }
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'user/fetch',
          payload: {},
        });
        message.success('人员启用成功!');
      },
    });
  };

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
    const { user: { data }, loading } = this.props;
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
      choiceTypeKey,
      choiceTypeValue,
      billTableTypeTree,
      permItemGroup,
      roleGroup,
    } = this.state;
    const columns = [
      {
        title: '用户账户',
        dataIndex: 'userName',
        fixed: 'left',
        width: 150,
      },
      {
        title: '所属用户组',
        dataIndex: 'group',
      },
      {
        title: '所属公司',
        dataIndex: 'company',
      },
      {
        title: '用户实名',
        dataIndex: 'person',
      },
      {
        title: '账号生效日期',
        dataIndex: 'effectiveDate',
      },
      {
        title: '缺省公司',
        dataIndex: 'defaultOrg',
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
            <a onClick={() => this.showDeleteMessage(true, record)}>删除</a>
           {/* <Divider type="vertical" />
            <a onClick={() => this.handleDistributionAuthorityVisible(true, record)}>分配权限</a>*/}
          </Fragment>
        ),
      },
    ];
    const batchMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="cancelcancel">启用</Menu.Item>
        <Menu.Item key="cancel">禁用</Menu.Item>
      </Menu>
    );

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
                menus={this.state.billTableTypeTree}
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
                    onClick={() => this.handlePersonAddVisible(true)}
                  >
                    新建
                  </Button>
                  {selectedRows.length > 0 && (
                    <span>
                      <Button
                        type="primary"
                        onClick={() => this.handleDistributionAuthorityVisible(true, selectedRows[0])}
                      >
                        分配权限
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => this.handleDistributionRoleVisible(true, selectedRows[0])}
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
          <PersonAddModal
            {...parentMethods}
            PersonAddVisible={PersonAddVisible}
            choiceTypeValue={choiceTypeValue}
            choiceTypeKey={choiceTypeKey}
          />
          <PersonViewModal
            {...parentMethods}
            PersonViewVisible={PersonViewVisible}
            rowInfo={rowInfo}
          />
          <PersonEditModal
            {...parentMethods}
            PersonEditVisible={PersonEditVisible}
            rowInfo={rowInfo}
          />
          <DistributionRoleModal
            {...parentMethods}
            DistributionRoleVisible={DistributionRoleVisible}
            rowInfo={rowInfo}
            roleGroup={roleGroup}
          />
          <BatchDisRoleModal
            {...parentMethods}
            BatchDisRoleVisible={BatchDisRoleVisible}
          />
          <DistributionAuthorityModal
            {...parentMethods}
            DistributionAuthorityVisible={DistributionAuthorityVisible}
            rowInfo={rowInfo}
            permItemGroup={permItemGroup}
          />
          <BatchDisAuthorityModal
            {...parentMethods}
            BatchDisAuthorityVisible={BatchDisAuthorityVisible}
          />
          <OrgRangeBill {...parentMethods} OrgRangeBillVisible={OrgRangeBillVisible} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
