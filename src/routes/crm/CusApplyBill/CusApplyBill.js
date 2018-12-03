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
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import CustomerApplyAddModal from './CusApplyAddModal';
import CustomerApplyViewModal from './CusApplyViewModal.js';
import EditableTable from '../../EditableTable/EditableTable';
import ContactsAddModal from '../CusInfoManage/ContactsAddModal';
import CustomerApplyEditModal from './CusApplyEditModal';


const { confirm } = Modal;
const { Content } = Layout;
const FormItem = Form.Item;


const statusMap = ['default','processing','success' ];
const linkmanTypeValue = ['工程', '招标', '采购'];
const statusValue = ['待审核', '审核中', '已审核'];

// table分页器遍历key通过","隔开。
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// 设置message信息配置
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
    cusApplyViewVisible: false,  // 客户查看状态
    contactsVisible: false,  // 联系人状态
    salesVisible: false,   // 业务员状态
    selectedRows: [],  // 选中的行
    formValues: {}, // 表单的结果集
    rowInfo: {},  // 当前操作行的数据
    linkmanOptionData: null, // 联系人下拉列表数据
  };

  // 生命周期方法 加载页面
  componentDidMount() {
    this.handleLinkManType();
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
  }

  // 公共列表组建分页
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
      type: 'cusApplication/fetch',
      payload: params,
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
        type: 'cusApplication/fetch',
        payload: {
          ...values,
          keyWord: values.keyWord,
        },
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

  // 搜索(重置)方法
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
  };

  // 信息单个删除方法
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
              pageSize: res.data.pagination.pageSize,
              page: res.data.pagination.page,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('删除成功!');
        }
      },
    });
  };

  // 选中行批量删除方法
  handleDeleteMoreClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    confirm({
      title: `确认删除?`,
      keyboard: false,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        dispatch({
          type: 'rule/remove',
          payload: {
            ids: selectedRows.map(row => row.id).join(','),
          },
        });
        message.success('删除成功');
        this.setState({
          selectedRows: [],
        });
      },
      onCancel() {
        message.warning(`未删除`);
      },
    });
  };

  // 接收子页面查询到的下拉列表的optionData值
  handleLinkManType = (optionData) => {
    this.setState({
      linkmanOptionData: optionData,
    });
  };

  // 隐藏和显示 <客户增加> 界面
  handleCusApplyAddVisible = flag => {
    this.setState({
      cusApplyAddVisible: !!flag,
    });
  };

  // 隐藏和显示 <客户编辑> 界面
  handleCusApplyEditVisible = (flag, record) => {
    this.setState({
      cusApplyEditVisible: !!flag,
      rowInfo: {
        ...record,
        keyWord: this.state.formValues.keyWord,
      },
    });
  };

  // 隐藏和显示 <客户申请查看> 界面
  handleCusApplyViewVisible = (flag, record) => {
    const validData = {
      ...record,
      status: statusValue[record.status],
      linkmanTypeId: this.state.linkmanOptionData.map((params) => {
        if(record.linkmanTypeId === params.id){
          return params.name;
        }
        return "";
      }),
    };
    this.setState({
      cusApplyViewVisible: !!flag,
      rowInfo: validData,
    });
  };

  // 隐藏和显示 <联系人增加> 界面
  handleContactsVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      contactsVisible: !!flag,
    });
  };

  // 隐藏和显示 <业务员申请查看> Tabs
  handleSalesVisible = flag => {
    if (this.state.selectedRows.length > 1) {
      message.warning('不支持多行选择');
      return false;
    }
    this.setState({
      salesVisible: !!flag,
    });
  };

  // 提交客户申请单
  handleCancelCancel = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/cancelCancel',
      payload: {
        id: record.id,
        key: record.key,
        status: 1,
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
              page: res.data.pagination.page,
              pageSize: res.data.pagination.page,
              keyWord: this.state.formValues.keyWord,
            },
          });
          message.success('提交成功!');
        }
      },
    });
  };

  // 查询组建
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
  }

  render() {
    const { cusApplication: { data }, loading } = this.props;
    const {
      selectedRows,
      cusApplyAddVisible,
      cusApplyEditVisible,
      contactsVisible,
      cusApplyViewVisible,
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
            text: linkmanTypeValue[0],
            value: '58f2741fed4311e88ac1186024a65a7c',
          },
          {
            text: linkmanTypeValue[1],
            value: '6a921d2aed4311e88ac1186024a65a7c',
          },
          {
            text: linkmanTypeValue[2],
            value: '8f1a1844ed4311e88ac1186024a65a7c',
          },
        ],
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
          return <Badge status={statusMap[val]} text={statusValue[val]} />;
        },
      },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleCusApplyViewVisible(true, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleCusApplyEditVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            {
              ( record.status === 0 ) && (  // 根据状态显示功能按钮
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

    // 父组件与子组件数据数据传递方法
    const parentMethods = {
      handleCusApplyAddVisible: this.handleCusApplyAddVisible,
      handleCusApplyEditVisible: this.handleCusApplyEditVisible,
      handleContactsVisible: this.handleContactsVisible,
      handleCusApplyViewVisible: this.handleCusApplyViewVisible,
      handleSalesVisible: this.handleSalesVisible,
      handleLinkManType:this.handleLinkManType,
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
                        <Button type="primary" >
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
        <CustomerApplyAddModal {...parentMethods} cusApplyAddVisible={cusApplyAddVisible} linkmanOptionData={linkmanOptionData} />
        <CustomerApplyViewModal {...parentMethods} cusApplyViewVisible={cusApplyViewVisible} rowInfo={rowInfo} />
        <CustomerApplyEditModal{...parentMethods} cusApplyEditVisible={cusApplyEditVisible} rowInfo={rowInfo} />
        <ContactsAddModal {...parentMethods} contactsVisible={contactsVisible} />
        <SalesManage {...parentMethods} salesVisible={salesVisible} />
      </PageHeaderLayout>
    );
  }
}
