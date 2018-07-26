import React, { PureComponent, Fragment } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Transfer,
  Modal,
  Icon,
  message,
  Popover,
  Collapse,
  Button,
} from 'antd';
import StandardTable from 'components/StandardTable';
import { connect } from 'dva';
import ArchivesBorrowRecordModal from '../add/ArchivesBorrowRecordModal';
import styles from './style.less';


const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  visitors: '拜访对象',
  visitType: '拜访方式',
  connectBusiness: '关联商机',
  visitDate: '拜访日期',
  communication: '交流内容',
  participants: '参与人员',
  remarks: '备注',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};


@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class ArchivesBorrowingModal extends PureComponent {
  state = {
    width: '90%',
    selectedRows: [],
    // 高级搜索是否隐藏状态
    expandForm: false,
    BorrowRecordVisible: false,
    rowInfo: [],
    mockData: [],
    targetKeys: [],
  };
  componentDidMount() {
    this.getMock();
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }



  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  };
  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  };

  // 选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
      type: 'rule/fetch',
      payload: {},
    });
  };

  // 展开高级搜索方法
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleBorrowRecordVisible = flag => {
    this.setState({
      BorrowRecordVisible: !!flag,
    });
  };

  showViewMessage =(flag, text, record)=> {
    this.setState({
      BorrowRecordVisible: !!flag,
      rowInfo: record,
    });
  };

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

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

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  // 高级搜索
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="项目编号">
              {getFieldDecorator('no',{

              })(<Input placeholder="项目编号" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="项目">
              {getFieldDecorator('phone',{

              })(<Input placeholder="项目" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="客户">
              {getFieldDecorator('contract',{

              })(
                <Input placeholder="客户" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="项目负责人">
              {getFieldDecorator('customer',{

              })(
                <Input placeholder="项目负责人" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="档案名称">
              {getFieldDecorator('status',{

              })(
                <Input placeholder="档案名称" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="归档日期">
              {getFieldDecorator('address',{

              })(
                <Input placeholder="归档日期" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <Form.Item label="存放位置">
              {getFieldDecorator('date', {
                rules: [{ required: false, message: '请选择创建日期' }],
              })(
                <Input placeholder="请选择创建日期" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起
            </Button>
          </span>
        </div>
      </Form>
    );
  }

  // 判断简单 还是 高级搜索
  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  // 简单查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="项目">
              {getFieldDecorator('customerCode',{

              })(
                <Input placeholder="项目" />
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="存放位置">
              {getFieldDecorator('place',{

              })(
                <Input placeholder="存放位置" />
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                高级搜索
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }



  render() {
    const { form, dispatch, submitting, archivesBorrowingVisible, handleArchivesBorrowingVisible, rule: { data }, loading } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedRows, BorrowRecordVisible, rowInfo } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
          handleArchivesBorrowingVisible(false);
        }
      });
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
    const columns = [
      {
        title: '档案编号',
        dataIndex: 'dictID',
      },
      {
        title: '项目名称',
        dataIndex: 'code',
      },
      {
        title: '客户',
        dataIndex: 'dictTypeName',
      },
      {
        title: '档案管理员',
        dataIndex: 'remarks',
      },
      {
        title: '归档日期',
        dataIndex: 'remarks',
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <Fragment>
            <a onClick={() =>this.showViewMessage(true, text, record, index)} >借阅</a>
          </Fragment>
        ),
      },
    ];
    const ArchivesBorrowRecordMethods = {
      handleBorrowRecordVisible: this.handleBorrowRecordVisible,
    };
    return (
      <Modal
        title="拜访新增"
        style={{ top: 150 }}
        // 对话框是否可见
        visible={archivesBorrowingVisible}
        width="80%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleArchivesBorrowingVisible()}
      >
        <div>
          <Card>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <Collapse defaultActiveKey={['1']} >
                <Panel header="档案" key="1">
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={columns}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </Panel>
              </Collapse>
              <ArchivesBorrowRecordModal {...ArchivesBorrowRecordMethods} BorrowRecordVisible={BorrowRecordVisible} handleArchivesBorrowingVisible={handleArchivesBorrowingVisible} rowInfo={rowInfo} />
            </div>
          </Card>
        </div>
      </Modal>

    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ArchivesBorrowingModal));
