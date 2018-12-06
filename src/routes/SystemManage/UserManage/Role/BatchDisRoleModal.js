import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Icon,
  Col,
  Row,
  Input,
  Select,
  Popover,
  Modal,
  Card,
  message,
  Transfer,
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../../components/StandardTable';
import AuthorityView from './AuthorityView';
import styles from '../style.less';

const mockData = [];
for (let i = 0; i < 20; i+=1) {
  mockData.push({
    key: i.toString(),
    title: `权限${i + 1}`,
    description: `权限描述${i + 1}`,
  });
}

const oriTargetKeys = mockData
  .filter(item => +item.key % 3 > 1)
  .map(item => item.key);
const getValue = obj =>
  Object.keys(obj).map(key => obj[key]).join(',');
const { Search } = Input;
const { Option } = Select;
const fieldLabels = {
  cusApplyCode: '客户编号',
  cusApplyName: '客户名称',
  cusApplyNature: '联系人业务性质',
  cusApplyStatus: '状态',
  cusApplyMobilePhone: '移动电话',
  cusApplyContacts: '联系人',
};
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

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class BatchDisRoleModal extends PureComponent {
  state = {
    width: '100%',
    targetKeys: oriTargetKeys,
    selectedKeys: [],
    AuthorityViewVisible: false,
    selectedRows: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
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

// 获取选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  handleChange = (nextTargetKeys, direction) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleAuthorityViewVisible = flag => {
    this.setState({
      AuthorityViewVisible: !!flag,
    });
  };



  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  // 简单查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="用户账户">
              {getFieldDecorator('CusAccount',{

              })(
                <div>
                  <Search placeholder="用户账户" />
                </div>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="指定用户的主角色">
              {getFieldDecorator('MainRole',{

              })(
                <div>
                  <Select placeholder="指定用户的主角色" >
                    <Option value={1}>角色1</Option>
                    <Option value={2}>角色12</Option>
                  </Select>
                </div>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button style={{ marginLeft: 8 }}>
                选择组织
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { form, dispatch, submitting , rule: { data }, loading, BatchDisRoleVisible, handleBatchDisRoleVisible} = this.props;
    const { targetKeys, selectedKeys, AuthorityViewVisible, selectedRows } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handleBatchDisRoleVisible(false);
          form.resetFields();
          message.success('成功申请用户');
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handleBatchDisRoleVisible(false);
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    const parentMethods = {
      handleAuthorityViewVisible: this.handleAuthorityViewVisible,
    };
    // 表头设置
    const columns = [
      {
        title: '组织编码',
        dataIndex: 'cusApplyCode',
      },
      {
        title: '组织名称',
        dataIndex: 'cusApplyName',
      },

    ];
    return (
      <Modal
        title="批量分配角色"
        style={{ top: 20 }}
        visible={BatchDisRoleVisible}
        width="70%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            <div>
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
            </div>
            <Form layout="horizontal">
              <Row>
                <Col span={24} push={5}>
                  <Transfer
                    listStyle={{
                      width: 300,
                      height: 300,
                    }}
                    dataSource={mockData}
                    titles={['可分配角色', '已分配角色']}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    onChange={this.handleChange}
                    onSelectChange={this.handleSelectChange}
                    onScroll={this.handleScroll}
                    render={item => item.title}
                  />
                </Col>
              </Row>
            </Form>
          </Card>
          <AuthorityView {...parentMethods} AuthorityViewVisible={AuthorityViewVisible} />
        </div>
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(BatchDisRoleModal));
