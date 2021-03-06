import React, { PureComponent, Fragment } from 'react';
import moment from 'moment/moment';
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
  Collapse,
  Badge,
} from 'antd';

import StandardTable from 'components/StandardTable';
import ArchivesAddModal from '../add/ArchivesAddModal';
import ArchivesViewModal from '../select/ArchivesViewModal';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';

const { Option } = Select;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['success', 'error', 'processing'];
const status = ['已入库', '已销毁', '销毁审批中'];

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
// PureComponent优化Component的性能
export default class ArchivesWarehousing extends PureComponent {
  state = {
    visitAddVisible: false,
    visitViewVisible: false,
    visitEditVisible: false,
    followUpVisible: false,
    archivesAddVisible: false,
    archivesViewVisible: false,
    rowInfo: {},
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }
  // 选中的条数已经选中的价格的和   参数（页码，过滤，把东西分类检出）
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

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
  // 重置查询的值
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

  // 批量处理的操作选择
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
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

  // 点击新增显示弹窗
  handleVisitAddVisible = flag => {
    this.setState({
      visitAddVisible: !!flag,
    });
  };

  handleVisitViewVisible = flag => {
    this.setState({
      visitViewVisible: !!flag,
    });
  };

  handleArchivesAddVisible = flag => {
    this.setState({
      archivesAddVisible: !!flag,
    });
  };
  handleArchivesViewVisible = flag => {
    this.setState({
      archivesViewVisible: !!flag,
    });
  };

  // 新增功能实现
  handleAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功111');
    this.setState({
      visitAddVisible: false,
    });
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
  showViewMessage = (flag, record) => {
    this.setState({
      archivesViewVisible: !!flag,
      rowInfo: record,
    });
  };

  showEditMessage = (flag, record) => {
    this.setState({
      archivesViewVisible: !!flag,
      rowInfo: record,
    });
  };

  handleDestroyApply = record => {
    const { dispatch } = this.props;
    confirm({
      title: `申请删除档案编码编码为：${record.archivesCode}`,
      content: (
        <div>
          <p>档案名称:{record.archivesName}</p>
          <p>销毁人:{record.archivesCode}</p>
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
  };

  // 查询表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="项目编号">
              {getFieldDecorator('no')(<Input placeholder="项目编号" style={{ width: 200 }} />)}
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
    const { rule: { data }, loading } = this.props;
    const { selectedRows, archivesAddVisible, archivesViewVisible, rowInfo } = this.state;
    const columns = [
      {
        title: '档案编号',
        dataIndex: 'archivesCode',
      },
      {
        title: '项目编号',
        dataIndex: 'projectCode',
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
      },
      {
        title: '客户',
        dataIndex: 'Cus',
      },
      {
        title: '档案名称',
        dataIndex: 'archivesName',
      },
      {
        title: '档案管理员',
        dataIndex: 'archivesManager',
      },
      {
        title: '归档日期',
        dataIndex: 'fileDate',
      },
      {
        title: '档案状态',
        dataIndex: 'archivesStatus',
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
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '存放位置',
        dataIndex: 'savePlace',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showViewMessage(true, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.showEditMessage(true, record)}>编辑</a>
            <Divider type="vertical" />
            {`${record.archivesStatus}` === '0' && (
              <a onClick={() => this.handleDestroyApply(record)}>销毁申请</a>
            )}
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const ArchivesAddMethods = {
      handleArchivesAddVisible: this.handleArchivesAddVisible,
    };
    const ArchivesViewMethods = {
      handleArchivesViewVisible: this.handleArchivesViewVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleArchivesAddVisible(true)}>
                新建档案
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
        <ArchivesAddModal {...ArchivesAddMethods} archivesAddVisible={archivesAddVisible} />
        <ArchivesViewModal
          {...ArchivesViewMethods}
          archivesViewVisible={archivesViewVisible}
          rowInfo={rowInfo}
        />
      </PageHeaderLayout>
    );
  }
}
