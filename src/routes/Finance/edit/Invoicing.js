import React, { PureComponent, Fragment } from 'react';
import {
  Select,
  Card,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Divider,
  Checkbox,
  Button,
  Icon,
  Modal,
  message,
  Collapse,
  Popover,
} from 'antd';
import { connect } from 'dva';
import StandardTable from 'components/StandardTable';
import styles from '../add/style.less';

const { Panel } = Collapse;
const { Option } = Select;
const FormItem = Form.Item;
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
  clientName: '委托方名称',
  projectUnitName: '项目单位名称',
  businessType: '业务类型',
  specificBusinessType: '具体业务类型',
  standardCharge: '标准收费',
  realCharge: '实际收费',
  discountRate: '折扣率',
  entrustType: '委托类型',
  acceptancePerson: '承接人',
  acceptanceDate: '承接日期',
  acceptanceDepartment: '承接部门',
  businessSource: '业务来源',
  planedProjectImplementationDate: '计划项目实施时间',
  planedIssueReportingDate: '计划出具报告时间',
  competentPartnerApproval: '主管合伙人审批',
  ImplementSignature: '项目实施部门负责人签名',
  pursuitSignature: '落实项目负责人签名',
  projectMembers: '计划项目组成员',
  technicalSupervisionSignature: '负责项目技术督导人签名',
  projectPersonChange: '项目组人员调整',
  planedDateChange: '计划时间调整',
  planChangeReason: '计划调整理由',
  ImplementOpinion: '项目实施部门负责人意见',
  technicalSupervisionOpinion: '负责项目技术督导人意见',
  projectResponsiblePerson: '项目负责人',
  actualSubmissionDate: '实际提交报告日期',
  comprehensiveUnitSignature: '综合部签名',
  signDate: '签收日期',
  auditOpinion: '审计意见',
  CPA_Signature: '签名注册会计师',
  invoiceName: '开票名称',
  invoiceMoney: '开票金额',
  invoiceCompany: '开票公司',
  invoiceType: '开票类型',
  invoicePersonnel: '开票人员',
  taxNumber: '税号',
  invoiceNumber: '发票号码',
  invoiceDate: '开票时间',
};

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class Invoicing extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="合同标题">
              {getFieldDecorator('no')(<Input placeholder="请输入" style={{ width: 200 }} />)}
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
    const {
      form,
      dispatch,
      submitting,
      invoicingVisible,
      handleInvoicingVisible,
      rule: { data },
      loading,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedRows } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
          handleInvoicingVisible(false);
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
        title: '申请开票金额（元）',
        dataIndex: 'invoiceMondyAlready',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
    ];
    return (
      <Modal
        title="开票"
        style={{ top: 150 }}
        // 对话框是否可见
        visible={invoicingVisible}
        width="60%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleInvoicingVisible()}
      >
        <div>
          <Collapse defaultActiveKey={['1', '2']}>
            <Panel header="开票信息" key="1">
              <Card>
                <Form layout="inline">
                  <Row className={styles['fn-mb-15']}>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceName}>
                        {getFieldDecorator('invoiceName', {
                          rules: [{ required: false, message: '请选择开票名称' }],
                        })(
                          <Select disabled placeholder="请选择开票名称" style={{ width: 200 }}>
                            <Option value="杭州客户">杭州客户</Option>
                            <Option value="新昌客户">新昌客户</Option>
                            <Option value="诸暨客户">诸暨客户</Option>
                            <Option value="河南客户">河南客户</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceMoney}>
                        {getFieldDecorator('invoiceMoney', {
                          rules: [{ required: false, message: '请输入开票金额' }],
                        })(<Input disabled placeholder="请输入开票金额" style={{ width: 200 }} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceNumber}>
                        {getFieldDecorator('invoiceNumber', {
                          rules: [{ required: false, message: '请输入开票号码' }],
                        })(<Input placeholder="请选择开票名称" style={{ width: 200 }} />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceDate}>
                        {getFieldDecorator('invoiceDate', {
                          rules: [{ required: false, message: '请输入开票时间' }],
                        })(<DatePicker placeholder="请输入开票时间" style={{ width: 200 }} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceCompany}>
                        {getFieldDecorator('invoiceCompany', {
                          rules: [{ required: false, message: '请选择开票公司' }],
                        })(<Input disabled placeholder="请选择开票公司" style={{ width: 200 }} />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.specificBusinessType}>
                        {getFieldDecorator('specificBusinessType', {
                          rules: [{ required: false, message: '请选择开票类型' }],
                        })(<Input disabled placeholder="请选择开票类型" style={{ width: 200 }} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['row-h']}>
                    <Col>
                      <Form.Item {...formhz11} label={fieldLabels.invoicePersonnel}>
                        {getFieldDecorator('invoicePersonnel', {
                          rules: [{ required: false, message: '请选择开票人员' }],
                        })(<Input disabled placeholder="请选择开票人员" style={{ width: 200 }} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Item {...formhz11} label={fieldLabels.taxNumber}>
                        {getFieldDecorator('taxNumber', {
                          rules: [{ required: false, message: '请输入税号' }],
                        })(
                          <Input
                            disabled
                            placeholder="请输入税号"
                            className={styles['ant-input-lg']}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Panel>
            <Panel header="合同列表" key="2">
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
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(Invoicing));
