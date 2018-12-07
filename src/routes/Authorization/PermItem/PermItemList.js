import React, { PureComponent } from 'react';
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
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import styles from './style.less';
import PermItemAddModal from './PermItemAddModal';


const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ permItem, loading }) => ({
  permItem,
  loading: loading.models.permItem,
}))
@Form.create()
export default class PermItemList extends PureComponent {
  state = {
    permItemAddVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'permItem/fetch',
      payload: {},
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

    dispatch({
      type: 'permItem/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'permItem/fetch',
      payload: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'permItem/remove',
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

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
        type: 'permItem/fetch',
        payload: values,
      });
    });
  };

  handlePermItemAddVisible = (flag) => {
    this.setState({
      permItemAddVisible: !!flag,
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
              <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(true)}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { permItem: { data }, loading } = this.props;
    const {
      selectedRows,
      permItemAddVisible,
    } = this.state;

    const columns = [
      {
        title: '编号',
        dataIndex: 'number',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '路径',
        dataIndex: 'path',
      },
      {
        title: '上级',
        dataIndex: 'parentId',
      },
      {
        title: '操作类型',
        dataIndex: 'action',
      },
    ];

    const batchMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethod = {
      handlePermItemAddVisible: this.handlePermItemAddVisible,
    };

    return (
      <div>
        <Card bordered={false}>
          <div>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handlePermItemAddVisible(true)}
                >
                  新建权限对象
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
          </div>
        </Card>
        <PermItemAddModal {...parentMethod} permItemAddVisible={permItemAddVisible} />
      </div>
    );
  }
}
