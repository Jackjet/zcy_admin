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
  Modal,
  message,
  Divider,
  Popconfirm,
  Layout,
  Badge,
} from 'antd';
import moment from "moment/moment";
import PageLeftTreeMenu from '../../../../components/PageLeftTreeMenu';
import StandardTable from '../../../../components/StandardTable';
import styles from './OrgUnitList.less';
import OrgUnitAddModal from '../add/OrgUnitAddModal';
import OrgUnitViewModal from '../select/OrgUnitViewModal';
import OrgUnitEditModal from '../edit/OrgUnitEditModal';


const { confirm } = Modal;
const statusMap = ['error', 'success', 'processing'];
const statusText = ['禁用' ,'启用' ,'提交'];
const industry =['否','是'];
const { Content, Sider } = Layout;
const FormItem = Form.Item;
message.config({
  top: 100, // 提示框弹出位置
  duration: 3, // 自动关闭延时，单位秒
  maxCount: 1, // 最大显示数目
});

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ company, loading }) => ({
  company,
  loading: loading.models.company,
}))
@Form.create()
export default class OrgUnitList extends PureComponent {
  state = {
    OrgUnitAddVisible: false,
    OrgUnitViewVisible: false,
    OrgUnitEditVisible: false,
    rowInfo:``,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    openKeys: ['sub1'],
    pageCurrent:``,
    pageSizeCurrent:``,
    currentTreekey:``,
    orgTreeMenu:[],
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
            orgTreeMenu : res.data.list,
          });
        } else {
          message.error(res.meta.errmsg);
        }
      },
    });
    dispatch({
      type: 'company/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {

        }else{
          //

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
  }; // 左边树收起其他展开的所有菜单

  rootSubmenuKeys = ['sub1', 'sub2', 'sub1']; // 左边菜单树叶子的key

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, pageCurrent, pageSizeCurrent } = this.state;

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
    this.setState({
      pageCurrent: params.page,
      pageSizeCurrent: params.pageSize,
    });
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'company/fetch',
      payload: params,
    });
  }; // 分页器的下一页 第几页 方法

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'company/fetch',
      payload: {},
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          message.success('重置完成!');
        }

      },
    });

  }; // 搜索的重置方法

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }; // 简单查询和高级搜索切换

  handleMenuClick = e => {
    const thisParam = this;
    const nameCompany = thisParam.state.selectedRows.map(row => row.name ).join(`,\n`);
    switch (e.key) {
      case 'remove':
        confirm({
          title: '确定删除以下公司?',
          content:(
            <div>
              <p>公司名称: {nameCompany}</p>
              <p>操作人:当前登录用户</p>
              <p>时间:{moment().format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          ),
          onOk() {
            thisParam.props.dispatch({
              type: 'company/removeMore',
              payload: {
                ids : thisParam.state.selectedRows.map(row => row.id ).join(','),
              },
              callback: () => {
                thisParam.setState({
                  selectedRows: [],
                });
                thisParam.props.dispatch({
                  type: 'company/fetch',
                  payload: {
                    page: 1,
                    pageSize: 10,
                  },
                });
                message.success('公司已删除');
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
  }; // 批量操作中的删除操作方法

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  }; // 控制选中的行的方法

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
        type: 'company/fetch',
        payload: values,
        callback: (res) => {
          if(res.meta.status !== '000000'){
            message.error(res.meta.errmsg);  // 返回错误信息
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

  handleTreeMenuClick = e => {
    console.log('click ', e);
    this.setState({
      currentTreekey: e.key,
    });
  }; // 左边菜单树点击方法

  handleOrgUnitAddVisible = flag => {
    this.setState({
      OrgUnitAddVisible: !!flag,
    });
    if(!flag){
      this.props.dispatch({
        type: 'company/fetch',
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
  }; // 公司新增modal显隐方法

  handleOrgUnitViewVisible = flag => {
    this.setState({
      OrgUnitViewVisible: !!flag,
    });
  }; // 公司查看modal显隐方法

  handleOrgUnitEditVisible = flag => {
    this.setState({
      OrgUnitEditVisible: !!flag,
    });
    if(!flag){
      this.props.dispatch({
        type: 'company/fetch',
        payload: {
          page: 1,
          pageSize: 10,
        },
        callback: (res) => {
          if(res.meta.status !== '000000' ) {
            message.error(res.meta.errmsg);  // 返回错误信息
            // this.props.data = res.data;
          } else {
            message.success("公司更新成功!")
          }
        },
      })
    }
  }; // 公司编辑modal显隐方法

  showViewMessage =(flag, record)=> {

    this.setState({
      OrgUnitViewVisible: !!flag,
      rowInfo: record,
    });
  }; // 公司查看modal显隐方法并且传当前行的数据

  showEditMessage =(flag, record)=> {
    this.setState({
      OrgUnitEditVisible: !!flag,
      rowInfo: record,
    });
  }; // 公司编辑modal显隐方法并且传当前行的数据

  showDeleteMessage =(flag, record)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/remove',
      payload: {
        id: record.id,
        deleteFlag: 0,
      },
      callback: ( res ) => {
        if (res.meta.status !== "000000") {
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            selectedRows: [],
          });
          dispatch({
            type: 'company/fetch',
            payload: {
              page: this.state.pageCurrent,
              pageSize: this.state.pageSizeCurrent,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('公司删除成功!');
        }

      },
    });
  }; // 公司信息单个删除方法

  handleCancelCancel = (record) => {

    const { dispatch } = this.props;
    dispatch({
      type: 'company/cancelCancel',
      payload: {
        id:record.id,
        status: 1,
      },
      callback: (res) => {
        if(res.meta.status !== '000000'){
          message.error("res.meta");  // 返回错误信息
        } else {
          this.setState({
            selectedRows: [],
          });
          dispatch({
            type: 'company/fetch',
            payload: {
              page: this.state.pageCurrent,
              pageSize: this.state.pageSizeCurrent,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('启用成功!');
        }
      },
    });

  }; // 公司状态启用方法

  handleCancel = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/cancel',
      payload: {
        id:record.id,
        status: 0,
      },
      callback: (res) => {
        if(res.meta.status !== '000000'){
          message.error("res.meta");  // 返回错误信息
        }
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'company/fetch',
          payload: {
            page: this.state.pageCurrent,
            pageSize: this.state.pageSizeCurrent,
            keyWord: this.state.formValues.keyWord,
          },
        });
        message.warning('编码规则已禁用!');
      },
    });

  }; // 公司状态禁用方法

  menuClick = e => {
    console.log(e.key);
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


  treeMenu() {
    const { SubMenu } = Menu;
    return (
      <Menu
        mode="inline"
        onClick={this.handleTreeMenuClick}
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 130 }}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <span>至诚集团</span>
            </span>
          }
        >
          <Menu.Item key="1">浙江至诚会计师事务所有限公司</Menu.Item>
          <Menu.Item key="2">杭州至诚税务师事务所有限公司</Menu.Item>
          <Menu.Item key="3">浙江中嘉资产评估有限公司</Menu.Item>
        </SubMenu>
      </Menu>
    );
  } // 左边树显示方法

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
  } // 简单查询样式显示

  renderForm() {
    return this.renderSimpleForm();
  } // 切换回简单查询方法

  render() {
    const { company: { data }, loading } = this.props;
    const { selectedRows, OrgUnitAddVisible, OrgUnitViewVisible, OrgUnitEditVisible, rowInfo } = this.state;
    const columns = [
      {
        title: '组织编号',
        dataIndex: 'number',
      },
      {
        title: '组织名称',
        dataIndex: 'name',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '负责人',
        dataIndex: 'principal',
      },
      {
        title: '状态',
        dataIndex: 'status',
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
        ],
        onFilter: (value, record) => record.industry.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={statusText[val]} />;
        },
      },
      {
        title: '分公司',
        dataIndex: 'isBranch',
        align: 'center',
        width: 100,
        filters: [
          {
            text: industry[0],
            value: 0,
          },
          {
            text: industry[1],
            value: 1,
          },
        ],
        onFilter: (value, record) => record.industry.toString() === value,
        render(val) {
          return <Badge status text={industry[val]} />;
        },
      },
      {
        title: '地址',
        dataIndex: 'address',
      },

      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showViewMessage(true, record)}>查看</a>
            {
            (statusText[record.status] === `提交` || statusText[record.status] === `禁用`) && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => this.showEditMessage(true, record)} >编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="确认删除?" onConfirm={() =>this.showDeleteMessage(true, record)} okText="是" cancelText="否">
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a onClick={() =>this.handleCancelCancel(record)} >启用</a>
              </span>
            )
          }
            {
              (statusText[record.status] === `启用`) && (
                <span>
                  <Divider type="vertical" />
                  <a onClick={() =>this.handleCancel(record)} >禁用</a>
                </span>
              )
            }
          </Fragment>
        ),
      },
    ];
    const batchMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleOrgUnitAddVisible: this.handleOrgUnitAddVisible,
      handleOrgUnitViewVisible: this.handleOrgUnitViewVisible,
      handleOrgUnitEditVisible: this.handleOrgUnitEditVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={140} style={{ background: '#fff' }}>
             {/* {this.treeMenu()}*/}
              <PageLeftTreeMenu
                 /*menus={router.menus}*/
                menus={this.state.orgTreeMenu}
                onClick={this.menuClick}
                mode="inline"
                selectedKeys={[this.state.selectedKey]}
                openKeys={this.state.firstHide ? null : [this.state.openKey]}
                onOpenChange={this.openMenu}
              />
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280}}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.handleOrgUnitAddVisible(true)}
                  >
                    新建
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
          <OrgUnitAddModal {...parentMethods} OrgUnitAddVisible={OrgUnitAddVisible} />
          <OrgUnitViewModal {...parentMethods} OrgUnitViewVisible={OrgUnitViewVisible} rowInfo={rowInfo} />
          <OrgUnitEditModal {...parentMethods} OrgUnitEditVisible={OrgUnitEditVisible} rowInfo={rowInfo} />
        </Card>
      </div>
    );
  }
}
