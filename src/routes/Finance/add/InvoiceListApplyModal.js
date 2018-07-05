import React, { PureComponent } from 'react';
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
  Divider,
  Button,
  Popover,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;
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
};

class InvoiceListApplyModal extends PureComponent {
  state = {
    width: '90%',
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
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting, invoiceApplyVisible, handleInvoiceApplyVisible } = this.props;
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
          this.setState({
            invoiceApplyVisible: false,
          });
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
    return (
      <Modal
        title="申请开票"
        style={{ top: 150 }}
        // 对话框是否可见
        visible={invoiceApplyVisible}
        width="60%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleInvoiceApplyVisible()}
      >
        <div>
          <Card>
            <Divider orientation="left">项目承接与分配阶段</Divider>
            <Form layout="inline">
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.clientName}>
                    {getFieldDecorator('clientName', {
                      rules: [{ required: true, message: '请委托方名称' }],
                    })(
                      <Select  placeholder="请委托方名称" style={{ width: 200 }}>
                        <Option value="0">杭州客户</Option>
                        <Option value="g">新昌客户</Option>
                        <Option value="y">诸暨客户</Option>
                        <Option value="q">河南客户</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.projectUnitName}>
                    {getFieldDecorator('projectUnitName', {
                      rules: [{ required: true, message: '请选择项目单位名称' }],
                    })(
                      <Select placeholder="请选择项目单位名称" style={{ width: 200 }}>
                        <Option value="0">杭州客户</Option>
                        <Option value="g">新昌客户</Option>
                        <Option value="y">诸暨客户</Option>
                        <Option value="q">河南客户</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.businessType}>
                    {getFieldDecorator('businessType', {
                      rules: [{ required: true, message: '请选择业务类型' }],
                    })(
                      <Select placeholder="请选择业务类型" style={{ width: 200 }}>
                        <Option value="0">杭州客户</Option>
                        <Option value="g">新昌客户</Option>
                        <Option value="y">诸暨客户</Option>
                        <Option value="q">河南客户</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.specificBusinessType}>
                    {getFieldDecorator('specificBusinessType', {
                      rules: [{ required: true, message: '请选择具体业务类型' }],
                    })(
                      <Select placeholder="请选择具体业务类型" style={{ width: 200 }}>
                        <Option value="0">杭州客户</Option>
                        <Option value="g">新昌客户</Option>
                        <Option value="y">诸暨客户</Option>
                        <Option value="q">河南客户</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item {...formhz11} label={fieldLabels.standardCharge}>
                    {getFieldDecorator('standardCharge', {
                      rules: [{ required: true, message: '请输入标准收费' }],
                    })(<Input placeholder="请输入标准收费" className={styles['ant-input-lg']} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formhz11} label={fieldLabels.realCharge}>
                    {getFieldDecorator('realCharge', {
                      rules: [{ required: true, message: '请输入实际收费' }],
                    })(<Input placeholder="请输入实际收费" className={styles['ant-input-lg']} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formhz11} label={fieldLabels.discountRate}>
                    {getFieldDecorator('discountRate', {
                      rules: [{ required: true, message: '请输入折扣率' }],
                    })(<Input placeholder="请输入折扣率" className={styles['ant-input-lg']} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.entrustType}>
                    {getFieldDecorator('entrustType', {
                      rules: [{ required: false, message: '请选择委托类型' }],
                    })(
                      <Select placeholder="请选择委托类型" style={{ width: 200 }}>
                        <Option value="0">首年</Option>
                        <Option value="g">第二年</Option>
                        <Option value="y">第三年</Option>
                        <Option value="q">三年以上</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={6}>
                  <Form.Item {...formhz11} label={fieldLabels.acceptancePerson}>
                    {getFieldDecorator('acceptancePerson', {
                      rules: [{ required: true, message: '请输入承接人' }],
                    })(<Input placeholder="请输入承接人" />)}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item {...formhz11} label={fieldLabels.acceptanceDate}>
                    {getFieldDecorator('acceptanceDate', {
                      rules: [{ required: true, message: '请选择承接日期' }],
                    })(<DatePicker placeholder="请选择承接日期" />)}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item {...formhz11} label={fieldLabels.acceptanceDepartment}>
                    {getFieldDecorator('acceptanceDepartment', {
                      rules: [{ required: true, message: '请输入承接部门' }],
                    })(<Input placeholder="请输入承接部门" />)}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item {...formhz11} label={fieldLabels.businessSource}>
                    {getFieldDecorator('businessSource', {
                      rules: [{ required: true, message: '请输入业务来源' }],
                    })(<Input placeholder="请输入业务来源" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.planedProjectImplementationDate}>
                    {getFieldDecorator('planedProjectImplementationDate', {
                      rules: [{ required: true, message: '请选择计划项目实施时间' }],
                    })(<DatePicker placeholder="请选择计划项目实施时间" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.planedIssueReportingDate}>
                    {getFieldDecorator('planedIssueReportingDate', {
                      rules: [{ required: true, message: '请选择计划出具报告时间' }],
                    })(<DatePicker placeholder="请选择计划出具报告时间" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.competentPartnerApproval}>
                    {getFieldDecorator('competentPartnerApproval', {
                      rules: [{ required: false, message: '请输入主管合伙人审批' }],
                    })(<Input placeholder="请输入主管合伙人审批" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.ImplementSignature}>
                    {getFieldDecorator('ImplementSignature', {
                      rules: [{ required: false, message: '请输入项目实施部门负责人签名' }],
                    })(<Input placeholder="请输入项目实施部门负责人签名" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.pursuitSignature}>
                    {getFieldDecorator('pursuitSignature', {
                      rules: [{ required: false, message: '请输入落实项目负责人签名' }],
                    })(<Input placeholder="请输入落实项目负责人签名" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.projectMembers}>
                    {getFieldDecorator('projectMembers', {
                      rules: [{ required: false, message: '请输入计划项目组成员' }],
                    })(<Input placeholder="请输入计划项目组成员" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.technicalSupervisionSignature}>
                    {getFieldDecorator('technicalSupervisionSignature', {
                      rules: [{ required: false, message: '请输入负责项目技术督导人签名' }],
                    })(<Input placeholder="请输入负责项目技术督导人签名" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="left">项目实施阶段</Divider>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.projectPersonChange}>
                    {getFieldDecorator('projectPersonChange', {
                      rules: [{ required: true, message: '请输入项目组人员调整' }],
                    })(<Input placeholder="请输入项目组人员调整" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.planedDateChange}>
                    {getFieldDecorator('planedDateChange', {
                      rules: [{ required: true, message: '请输入计划时间调整' }],
                    })(<Input placeholder="请输入计划时间调整" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.planChangeReason}>
                    {getFieldDecorator('planChangeReason', {
                      rules: [{ required: true, message: '请输入计划调整理由' }],
                    })(<Input placeholder="请输入计划调整理由" className={styles['ant-input-lg']} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.technicalSupervisionOpinion}>
                    {getFieldDecorator('technicalSupervisionOpinion', {
                      rules: [{ required: false, message: '请输入项目实施部门负责人意见' }],
                    })(<Input placeholder="请输入项目实施部门负责人意见" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.technicalSupervisionOpinion}>
                    {getFieldDecorator('technicalSupervisionOpinion', {
                      rules: [{ required: true, message: '请输入负责项目技术督导人意见' }],
                    })(<Input placeholder="请输入负责项目技术督导人意见" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="left">项目完成阶段</Divider>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.projectResponsiblePerson}>
                    {getFieldDecorator('projectResponsiblePerson', {
                      rules: [{ required: true, message: '请输入项目负责人' }],
                    })(<Input placeholder="请输入项目负责人" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.actualSubmissionDate}>
                    {getFieldDecorator('actualSubmissionDate', {
                      rules: [{ required: true, message: '请选择实际提交报告日期' }],
                    })(<DatePicker placeholder="请选择实际提交报告日期" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.comprehensiveUnitSignature}>
                    {getFieldDecorator('comprehensiveUnitSignature', {
                      rules: [{ required: true, message: '请选择综合部签收人' }],
                    })(<Input placeholder="请选择综合部签收人" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.signDate}>
                    {getFieldDecorator('signDate', {
                      rules: [{ required: true, message: '请选择签收日期' }],
                    })(<DatePicker placeholder="请选择签收日期" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.auditOpinion}>
                    {getFieldDecorator('auditOpinion', {
                      rules: [{ required: true, message: '请输入审计意见' }],
                    })(<Input placeholder="请输入审计意见" className={styles['ant-input-lg']} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.CPA_Signature}>
                    {getFieldDecorator('CPA_Signature', {
                      rules: [{ required: true, message: '请输入签字注册会计师' }],
                    })(
                      <Input placeholder="请输入签字注册会计师" className={styles['ant-input-lg']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </Modal>

    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(InvoiceListApplyModal));
