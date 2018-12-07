import React, { PureComponent } from 'react';
import { Card, Form, Icon, Col, Row, DatePicker, Input, Select, Popover, Modal, Table, Button,message } from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Search } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

class AssignRoleModal extends PureComponent {
  state = {
    width: '100%',
    selectedRows: [],
    currentPagination: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.props.dispatch({
      type: 'userRole/fetch',
      payload: {},
      callback: (res)=>{
        if (res.meta.status === "000000"){
          message.error(res.data.alert_msg);
        }
      },
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  // 分页器方法
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state; // 拿到搜索框中的值
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
        total: pagination.total,
      },
    });
    dispatch({
      type: 'role/fetch',
      payload: params,
    });
  };

  // 选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  // 查询控件
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { rowInfo } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="角色">
              {getFieldDecorator('roleId',{
                initialValue: rowInfo === null?"":rowInfo.name,
              })(
                <Search
                  placeholder="角色"
                  onSearch={() =>this.handleAllRole()}
                />
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="组织">
              {getFieldDecorator('orgId')(
                <Search placeholder="组织" />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { userRole: {data}, form, dispatch, loading, AssignUserVisible, handleAssignUserVisible, rowInfo } = this.props;
    const { selectedRows, currentPagination } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          form.resetFields();
          handleAssignUserVisible(false);
        }
      });
    };
    const cancelDate = () => {
      handleAssignUserVisible(false);
    };
    const columns = [
      {
        title: '分配组织编码',
        dataIndex: 'userId',
        width: 120,
      },
      {
        title: '分配组织名称',
        dataIndex: 'permId',
        width: 120,
      },
      {
        title: '用户名',
        dataIndex: 'account',
        width: 120,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 120,
      },
      {
        title: '用户实名',
        dataIndex: 'realName',
        width: 120,
      },
      {
        title: '所属单位',
        dataIndex: 'unit',
        width: 120,
      },
    ];
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="分配用户"
        style={{ top: 20 }}
        visible={AssignUserVisible}
        width="55%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText="提交"
      >
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
      </Modal>
    );
  }
}

export default connect(({ userRole, loading }) => ({
  userRole,
  loading: loading.models.userRole,
}))(Form.create()(AssignRoleModal));
