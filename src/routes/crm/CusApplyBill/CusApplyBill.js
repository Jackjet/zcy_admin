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
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Layout,
  Popconfirm,
} from 'antd';
import moment from "moment/moment";
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import CustomerApplyAddModal from './CusApplyAddModal';
import CustomerApplyViewTabs from './CusApplyTabsViewModal.js';
import EditableTable from '../../EditableTable/EditableTable';
import ContactsAddModal from '../CusInfoManage/ContactsAddModal';
import CustomerApplyEditModal from './CusApplyEditModal';


const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Content } = Layout;
const FormItem = Form.Item;


const statusMap = ['default','processing','success' ];
const linkmanTypeValue = ['工程', '招标', '采购'];
const statusValue = ['待审核', '审核中', '已审核'];


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
message.config({
  top: 100, // 提示框弹出位置
  duration: 3, // 自动关闭延时，单位秒
  maxCount: 1, // 最大显示数目
});


// 设置业务员
const SalesManage = Form.create()(props => {
  const { salesVisible, handleSalesVisible } = props;
  const okHandle = () => {
    handleSalesVisible();
  };
  return (
    <Modal
      title="业务员基本信息管理"
      style={{ top: 20 }}
      visible={salesVisible}
      width="40%"
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleSalesVisible()}
    >
      <div className={styles.editPerson}>
        <EditableTable />
      </div>
    </Modal>
  );
});

@connect(({ cusApplication, loading }) => ({
  cusApplication,
  loading: loading.models.cusApplication,
}))
@Form.create()
export default class CusApplyBill extends PureComponent {
  state = {
    cusApplyAddVisible: false, // 客户增加状态
    cusApplyEditVisible: false, // 客户编辑状态
    cusApplyTabsViewVisible: false,  // 客户查看状态
    contactsVisible: false,  // 联系人状态
    salesVisible: false,   // 业务员状态
    selectedRows: [],  // 选中的行
    formValues: {}, // 表单的结果集
    rowInfo: {},  // 当前操作行的数据
    openKeys: ['sub1'],  // 左边菜单树的起始状态
    pageCurrent:``, // 当前页
    pageSizeCurrent:``, // 当前页大小
    linkmanOptionData: [],
  };

  componentDidMount() {
    this.handleLinkManTypeChange();
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/fetch',
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
  } // 生命周期方法 加载页面

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
    this.setState({
      pageCurrent: params.page,
      pageSizeCurrent: params.pageSize,
    });
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'cusApplication/fetch',
      payload: params,
    });
  }; // 公共列表组建分页

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
        type: 'cusApplication/fetch',
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

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cusApplication/fetch',
      payload: {},
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          message.success('重置完成!');
        }
      },
    });
  }; // 搜索(重置)方法

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }; // 普通高级搜索切换方法

  handleDeleteMsg =(flag, record)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/remove',
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
            type: 'cusApplication/fetch',
            payload: {
              page: this.state.pageCurrent,
              pageSize: this.state.pageSizeCurrent,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('删除成功!');
        }

      },
    });
  }; // 信息单个删除方法

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  }; // 获取选中的行



  handleLinkManTypeChange = (optionData) => {
    this.setState({
      linkmanOptionData: optionData,
    }); // 接收子页面查询到的下拉列表的optionData值
  };

  handleCusApplyAddVisible = flag => {
    this.setState({
      cusApplyAddVisible: !!flag,
    });
  }; // 隐藏和显示客户增加界面

  handleCusApplyEditVisible = flag => {
    this.setState({
      cusApplyEditVisible: !!flag,
    });
  }; // 隐藏和显示客户编辑界面

  handleContactsVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      contactsVisible: !!flag,
    });
  }; // 隐藏和显示联系人增加界面

  handleCusApplyTabsViewVisible = flag => {
    this.setState({
      cusApplyTabsViewVisible: !!flag,
    });
  }; // 隐藏和显示客户申请查看Tabs

  handleSalesVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      salesVisible: !!flag,
    });
  }; // 隐藏和显示业务员申请查看Tabs

  showEditMessage = (flag, record) => {
    this.setState({
      cusApplyEditVisible: !!flag,
      rowInfo: {
        ...record,
        keyWord: this.state.formValues.keyWord,
      },
    });
  }; // 编辑modal传送当前行的数据

  handleCancelCancel = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/cancelCancel',
      payload: {
        id: record.id,
        key: record.key,
        status: 2,
      },
      callback: ( res ) => {
        if (res.meta.status !== "000000") {
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            selectedRows: [],
          });
          dispatch({
            type: 'cusApplication/fetch',
            payload: {
              page: this.state.pageCurrent,
              pageSize: this.state.pageSizeCurrent,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('提交成功!');
        }
      },
    });
  }; // 提交客户申请单

  showViewMessage = (flag, record) => {
    this.setState({
      cusApplyTabsViewVisible: !!flag,
      rowInfo: {
        ...record,
        status: statusValue[record.status-1],
        linkmanTypeId: linkmanTypeValue[record.linkmanTypeId],
      },
    });
  };  // 弹窗查看当前行的数据

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyWord', {
              })(
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
  } // 简单查询

  render() {
    const { cusApplication: { data }, loading } = this.props;
    const {
      selectedRows,
      cusApplyAddVisible,
      cusApplyEditVisible,
      contactsVisible,
      cusApplyTabsViewVisible,
      salesVisible,
      rowInfo,
      linkmanOptionData,
    } = this.state;

    const columns = [
      {
        title: '编码',
        dataIndex: 'number',
        width: 150,
        fixed: 'left',
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
        title: '联系人业务性质',
        dataIndex: 'linkmanTypeId',
        filters: [
          {
            text: 1,
            value: 0,
          },
          {
            text: 2,
            value: 1,
          },
          {
            text: 3,
            value: 2,
          },
        ],
        /*filters:() => {
          return  [ {text:1, value:2 } ]
        },*/
        onFilter: (value, record) => record.linkmanTypeId.toString() === value,
        render(val) {
          let linkmanTypeData = "";
          if(linkmanOptionData){
            linkmanTypeData  =  linkmanOptionData.map((params) => {
              if(val === params.id){
                return params.name;
              }
              return "";
            });
          }else {
            linkmanTypeData =  "";
          }
          return <Badge status text={linkmanTypeData} />;
        },
      },
      {
        title: '手机',
        dataIndex: 'phone',
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        filters: [
          {
            text: statusValue[0],
            value: 0,
          },
          {
            text: statusValue[1],
            value: 1,
          },
          {
            text: statusValue[2],
            value: 2,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val-1]} text={statusValue[val-1]} />;
        },
      },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showViewMessage(true, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.showEditMessage(true, record)}>编辑</a>
            <Divider type="vertical" />
            {
              ( record.status === 1 || record.status === 3) && (
                <span>
                  <a onClick={() => this.handleCancelCancel(record)}>提交</a>
                  <Divider type="vertical" />
                  <Popconfirm title="确认删除?" onConfirm={() =>this.handleDeleteMsg(true, record)} okText="是" cancelText="否">
                    <a>删除</a>
                  </Popconfirm>
                </span>
              )
            }
          </Fragment>
        ),
      },
    ];

    const ParentMethods = {
      handleCusApplyAddVisible: this.handleCusApplyAddVisible,
      handleCusApplyEditVisible: this.handleCusApplyEditVisible,
      handleContactsVisible: this.handleContactsVisible,
      handleCusApplyTabsViewVisible: this.handleCusApplyTabsViewVisible,
      handleSalesVisible: this.handleSalesVisible,
      handleLinkManTypeChange:this.handleLinkManTypeChange,
    };

    return (
      <PageHeaderLayout>
        <Card>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <div>
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                  <div className={styles.tableListOperator}>
                    <Button
                      icon="plus"
                      type="primary"
                      onClick={() => this.handleCusApplyAddVisible(true)}
                    >
                      新建客户
                    </Button>
                    {selectedRows.length > 1 && (
                      <span>
                        <Button type="primary" onClick={() => this.handleDeleteMoreClick(true)}>
                          批量删除
                        </Button>
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
              </div>
            </Content>
          </Layout>
        </Card>
        <CustomerApplyAddModal {...ParentMethods} cusApplyAddVisible={cusApplyAddVisible} linkmanOptionData={linkmanOptionData} />
        <CustomerApplyViewTabs {...ParentMethods} cusApplyTabsViewVisible={cusApplyTabsViewVisible} rowInfo={rowInfo} />
        <CustomerApplyEditModal{...ParentMethods} cusApplyEditVisible={cusApplyEditVisible} rowInfo={rowInfo} />
        <ContactsAddModal {...ParentMethods} contactsVisible={contactsVisible} />
        <SalesManage {...ParentMethods} salesVisible={salesVisible} />
      </PageHeaderLayout>
    );
  }
}
