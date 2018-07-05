import React, { PureComponent, Fragment } from 'react';
import {
  Tabs,
  Icon,
  Form,
  Card,
  Divider,
  Row,
  Col,
  Select,
  message,
  Modal,
  Input,
  DatePicker,
  Collapse,
} from 'antd';
import { connect } from 'dva';
import StandardTable from 'components/StandardTable';
import DetailedModal from './DetailedModal';
import styles from './style.less';


const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Option } = Select;
const formhz11 = {
  wrapperCol: {
    style: {
      width: '50%',
    },
  },
  style: {
    width: '80%',
  },
};

const fieldLabels = {
  invoiceName: '开票名称',
  invoiceDate:'开票时间',
  invoiceNumber:'发票号码',
  invoiceMoney: '发票金额（元）',
  invoiceType: '开票类型',
  invoiceCompany: '开票公司',
  invoicePersonnel: '开票人员',
  incomeMoneyAlready: '已收入金额（元）',
  status: '收款完成',
};

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class IncomeConfirmModal extends PureComponent {
  state = {
    width: '100%',
    selectedRows: [],
    detailedVisible: false,
  };


  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleDetailedVisible = flag => {
    this.setState({
      detailedVisible: !!flag,
    });
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

  render() {
    const { form, dispatch, submitting, incomeConfirmVisible, handleIncomeConfirmVisible,  rule: { data }, loading } = this.props;
    const { selectedRows, detailedVisible } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
          handleIncomeConfirmVisible(false);
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

    const detailMethods = {
      handleDetailedVisible: this.handleDetailedVisible,
    };
    const columns = [
      {
        title: '合同标题',
        dataIndex: 'contractTitle',
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
      },
      {
        title: '合同金额（元）',
        dataIndex: 'contractMoney',
      },
      {
        title: '已收入金额（元）',
        dataIndex: 'incomeMoneyAlready',
      },
      {
        title: '开票金额（元）',
        dataIndex: 'invoiceMoneyAlready',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
      {
        title: '收入信息',
        render: () => (
          <Fragment>
            <a onClick={this.handleDetailedVisible} >收款明细</a>
          </Fragment>
        ),
      },
    ];
    return (
      <Modal
        title="收入登记"
        style={{ top: 150 }}
        // 对话框是否可见
        visible={incomeConfirmVisible}
        width="60%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleIncomeConfirmVisible()}
      >
        <div>
          <Collapse defaultActiveKey={['1','2']}>
            <Panel header="开票信息" key="1" >
              <Card>
                <Form layout="inline">
                  <Row className={styles['fn-mb-15']}>
                    <Col>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceName}>
                        {getFieldDecorator('invoiceName', {
                          rules: [{ required: false, message: '请选择开票名称' }],
                        })(
                          <Input disabled placeholder="请选择开票名称" style={{ width: 200 }} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceDate}>
                        {getFieldDecorator('invoiceDate', {
                          rules: [{ required: false, message: '请输入开票时间' }],
                        })(
                          <DatePicker disabled  placeholder="请输入开票时间" style={{ width: 200 }} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceNumber}>
                        {getFieldDecorator('invoiceNumber', {
                          rules: [{ required: false, message: '请输入发票号码' }],
                        })(
                          <Input disabled placeholder="请输入发票号码" style={{ width: 200 }} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['row-h']}>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceMoney}>
                        {getFieldDecorator('invoiceMoney', {
                          rules: [{ required: false, message: '请输入发票金额' }],
                        })(
                          <Input disabled placeholder="请输入发票金额" style={{ width: 200 }} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceType}>
                        {getFieldDecorator('invoiceType', {
                          rules: [{ required: false, message: '请输入开票类型' }],
                        })(
                          <Input disabled placeholder="请输入开票类型" style={{ width: 200 }} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['row-h']}>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceCompany}>
                        {getFieldDecorator('invoiceCompany', {
                          rules: [{ required: true, message: '请输入开票公司' }],
                        })(
                          <Input disabled placeholder="请输入开票公司" style={{ width: 200 }} className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoicePersonnel}>
                        {getFieldDecorator('invoicePersonnel', {
                          rules: [{ required: true, message: '请输入开票人员' }],
                        })(
                          <Input disabled placeholder="请输入开票人员" style={{ width: 200 }} className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['row-h']}>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.incomeMoneyAlready}>
                        {getFieldDecorator('incomeMoneyAlready', {
                          rules: [{ required: true, message: '请输入已收入金额' }],
                        })(
                          <Input disabled placeholder="请输入已收入金额" style={{ width: 200 }} className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.status}>
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请输入收款状态' }],
                        })(
                          <Input disabled placeholder="请输入收款状态" style={{ width: 200 }} className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Panel>
            <Panel header="合同信息" key="2" >
              <div className={styles.tableList}>
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Panel>
          </Collapse>
        </div>
        <DetailedModal {...detailMethods} detailedVisible={detailedVisible} />
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(IncomeConfirmModal));
