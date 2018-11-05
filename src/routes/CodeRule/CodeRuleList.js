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
  Select,
  Divider,
  Popconfirm,
  Badge,
} from 'antd';
import moment from "moment/moment";
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import CodeRuleAddModal from './CodeRuleAddModal';

message.config({
  top: 100, // 提示框弹出位置
  duration: 3, // 自动关闭延时，单位秒
  maxCount: 1, // 最大显示数目
});
const statusMap = ['error', 'success', 'processing'];
const statusText = ['禁用' ,'启用' ,'提交'];
const { Option } = Select;
const  { confirm } = Modal;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ company, loading }) => ({
  company,
  loading: loading.models.company,
}))
@Form.create()
// PureComponent优化Component的性能
export default class CodeRuleList  extends PureComponent {
  state = {
    CodeRuleAddVisible: false,
    rowInfo:{},
    selectedRows: [],
    formValues: {},
    pageCurrent:``,
    pageSizeCurrent:``,
  };

  componentDidMount() {
    const { dispatch } = this.props;
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
  // 选中的条数已经选中的价格的和   参数（页码，过滤，把东西分类检出）
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, pageCurrent, pageSizeCurrent } = this.state;

    // Object.keys()方法会返回一个由一个给定对象的自身可枚举属性组成的数组,
    // reduce方法有两个参数，第一个参数是一个callback，用于针对数组项的操作；
    // 第二个参数则是传入的初始值，这个初始值用于单个数组项的操作。
    // 需要注意的是，reduce方法返回值并不是数组，而是形如初始值的经过叠加处理后的操作。

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
      type: 'company/fetch',
      payload: params,
    });
  };
  // 重置查询的值
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
  };

  // 批量处理的操作选择
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
  };

  // 选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 查询功能
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
  };

  // 点击新增显示弹窗
  handleCodeRuleAddVisible = flag => {
    this.setState({
      CodeRuleAddVisible: !!flag,
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
  };


  showDeleteConfirm = () => {
    confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

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
          message.error(res.meta.errmsg);  // 返回错误信息
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
          message.success('公司启用成功!');
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
        message.warning('公司已禁用!');
      },
    });

  }; // 公司状态禁用方法


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
          message.success('编码规则删除成功!');
        }

      },
    });
  }; // 公司信息单个删除方法

  showViewMessage =(flag, record)=> {
    this.setState({
      CodeRuleAddVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage =(flag, record)=> {
    this.setState({
      CodeRuleAddVisible: !!flag,
      rowInfo: record,
    });
  };


  // 查询表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyWord')(
                <Input placeholder="请输入关键字" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
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
    const { company: { data }, loading } = this.props;
    const { selectedRows, CodeRuleAddVisible, rowInfo } = this.state;
    const columns = [
      {
        title: '规则代码',
        dataIndex: 'number',
      },
      {
        title: '规则名称',
        dataIndex: 'name',
      },
      {
        title: '业务对象',
        dataIndex: 'visitMethod',
      },
      {
        title: '启用日期',
        dataIndex: 'visitDate',
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
        title: '创建人',
        dataIndex: 'remarks',
      },
      {
        title: '创建公司',
        dataIndex: 'company',
      },
      {
        title: '应用字段',
        dataIndex: 'code',
      },

      {
        title: '应用字段实名',
        dataIndex: 'entity',
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

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleCodeRuleAddVisible: this.handleCodeRuleAddVisible,
    };

    return (
      <PageHeaderLayout>
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleCodeRuleAddVisible}>
                新建编码规则
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      批量删除 <Icon type="down" />
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
        </Card>
        <CodeRuleAddModal {...parentMethods} CodeRuleAddVisible={CodeRuleAddVisible} />
      </PageHeaderLayout>
    );
  }
}
