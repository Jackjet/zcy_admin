import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Menu,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Layout,
  Popconfirm,
} from 'antd';
import PageLeftTreeMenu from '../../../components/PageLeftTreeMenu';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import CusAddModal from './CusAddModal';
import CusViewTabs from './CusViewModal.js';
import ContactsAddModal from './ContactsAddModal';
import CusDistributionModal from './CusDistributionModal';
import CusEditModal from './CusEditModal';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;
const { Content, Sider } = Layout;
const FormItem = Form.Item;

// 遍历key 用于table组件的分页器
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default','success', 'error'];
const status = ['新建','启用', '停用'];
const industry = [
  '制造业',
  '服务业',
  '房地产建筑',
  '三农业务',
  '政府购买',
  '商业',
  '非营利组织',
  '其他',
];

@connect(({ cusInfoManage, loading }) => ({
  cusInfoManage,
  loading: loading.models.cusInfoManage,
}))
@Form.create()
export default class CustomerList extends PureComponent {
  state = {
    customerAddVisible: false,  // 客户增加状态
    customerEditVisible: false,  // 客户编辑状态
    customerViewVisible: false,  // 客户查看状态
    contactsVisible: false,  // 联系人状态
    /*customerDistributionVisible: false, // 客户分配*/
    selectedRows: [],  // 选中的行
    formValues: {}, // 接收查询输入框的值
    rowInfo: {}, // 当前操作行的数据

    orgTreeMenu:[],
    openKey: '',
    selectedKey:'',
    firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
  };

  // 生命周期方法 加载页面
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
      type: 'cusInfoManage/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {
          message.error(res.meta.errmsg);
        }
      },
    });
  }

  // 分页器分页方法
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
      type: 'cusInfoManage/fetch',
      payload: params,
    });
  };

  // 搜索重置方法
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cusInfoManage/fetch',
      payload: {},
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          message.success('重置完成!');
        }
      },
    });
  };

  // 选中行删除方法
  handleDeleteMoreClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    confirm({
      title: `确认删除编码为：${selectedRows.map(row => row.customerCode).join(',')}的客户`,
      keyboard: false,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        dispatch({
          type: 'company/remove',
          payload: {
            ids: selectedRows.map(row => row.id).join(','),
          },
        });
        message.success('删除成功');
      },
      onCancel() {
        message.error(`编码为的客户：${selectedRows.map(row => row.customerCode).join(',')}未删除`);
      },
    });
    this.setState({
      selectedRows: [],
    });
  };

  // 信息单个删除方法
  handleDeleteMsg =(flag, record)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusInfoManage/remove',
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
            type: 'cusInfoManage/fetch',
            payload: {
              page: res.data.pagination.current,
              pageSize: res.data.pagination.pageSize,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('删除成功!');
        }

      },
    });
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
        type: 'cusInfoManage/fetch',
        payload: values,
        callback: (res) => {
          if(res.meta.status !== '000000'){
            message.error(res.meta.errmsg);  // 返回错误信息
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

  // 隐藏和显示 <客户> 编辑界面
  handleCustomerEditVisible = (flag, record )=> {
    this.setState({
      customerEditVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  // 隐藏和显示 <客户> 查看界面
  handleCustomerViewVisible = (flag, record) => {
    this.setState({
      customerViewVisible: !!flag,
      rowInfo: {
        ...record,
      },
    });
  };

  // 隐藏和显示 <联系人> 增加界面
  handleContactsVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      contactsVisible: !!flag,
    });
  };

 /* handleCustomerDistributionVisible = flag => {
    this.setState({
      customerDistributionVisible: !!flag,
    });
  }; // 客户分配*/

  // 左边组织架构点击方法
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

  // 简单查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyWord', {})(
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
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { cusInfoManage: { data }, loading } = this.props;
    const {
      selectedRows,
      customerAddVisible,
      customerEditVisible,
      contactsVisible,
      customerViewVisible,
      /*customerDistributionVisible,*/
      rowInfo,
    } = this.state;

    const columns = [
      {
        title: '编码',
        dataIndex: 'number',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
      },
      {
        title: '所属公司',
        dataIndex: 'companyId',
      },
      {
        title: '行业',
        dataIndex: 'industry',
        filters: [
          {
            text: industry[0],
            value: 0,
          },
          {
            text: industry[1],
            value: 1,
          },
          {
            text: industry[2],
            value: 2,
          },
          {
            text: industry[3],
            value: 3,
          },
          {
            text: industry[4],
            value: 4,
          },
          {
            text: industry[5],
            value: 5,
          },
          {
            text: industry[6],
            value: 6,
          },
          {
            text: industry[7],
            value: 7,
          },
        ],
        onFilter: (value, record) => record.industry.toString() === value,
        render(val) {
          return <Badge status text={industry[val]} />;
        },
      },
      {
        title: '手机',
        dataIndex: 'phone',
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 1,
          },
          {
            text: status[1],
            value: 2,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleCustomerViewVisible(true, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleCustomerEditVisible(true, record)}>编辑</a>
            {record.status === 1 && (
              <span>
                <Divider type="vertical" />
                <a>启用</a>
              </span>
            )}
            {record.status === 0 && (
              <span>
                <Divider type="vertical" />
                <a>停用</a>
              </span>
            )}
            <Divider type="vertical" />
            <Popconfirm title="确认删除?" onConfirm={() =>this.handleDeleteMsg(true, record)} okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handleCustomerAddVisible: this.handleCustomerAddVisible,
      handleCustomerEditVisible: this.handleCustomerEditVisible,
      handleContactsVisible: this.handleContactsVisible,
      handleCustomerViewVisible: this.handleCustomerViewVisible,
      /*handleCustomerDistributionVisible: this.handleCustomerDistributionVisible,*/
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
              <div>
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                  <div className={styles.tableListOperator}>
                    {selectedRows.length > 0 && (
                      <span>
                        {/*<Button
                          type="primary"
                          onClick={() => this.handleCustomerDistributionVisible(true)}
                        >
                          客户分配
                        </Button>*/}
                        <Button type="primary" onClick={() => this.handleContactsVisible(true)}>
                          设置联系人
                        </Button>
                      </span>
                    )}
                    {selectedRows.length > 1 && (
                      <span>
                        <Button type="primary" onClick={() => this.handleDeleteMoreClick(true)}>
                          批量删除
                        </Button>
                      </span>
                    )}
                  </div>
                  <StandardTable
                    /* scroll={{ x: 1500}}*/
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={columns}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </div>
            </Content>
          </Layout>
        </Card>
        <CusAddModal {...parentMethods} customerAddVisible={customerAddVisible} />
        <CusEditModal {...parentMethods} customerEditVisible={customerEditVisible} rowInfo={rowInfo} />
        <ContactsAddModal {...parentMethods} contactsVisible={contactsVisible} />
        <CusViewTabs {...parentMethods} customerViewVisible={customerViewVisible} rowInfo={rowInfo} />
        {/*<CusDistributionModal {...ParentMethods} customerDistributionVisible={customerDistributionVisible} />*/}
      </PageHeaderLayout>
    );
  }
}
