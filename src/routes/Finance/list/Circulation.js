import React, { PureComponent } from 'react';
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
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;
const cnumcol = {
  style: {
    paddingLeft: 10,
  },
};

const remarkcol = {
  style: {
    paddingLeft: 34,
  },
};

const formhz11 = {
  wrapperCol: {
    style: {
      width: '50%',
    },
  },
  style: {
    width: '80%',
    paddingLeft: 24,
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

class Circulation extends PureComponent {
  state = {};

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

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
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
                    <Select placeholder="请委托方名称" style={{ width: 200 }}>
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
                <Form.Item label={fieldLabels.standardCharge}>
                  {getFieldDecorator('standardCharge', {
                    rules: [{ required: true, message: '请输入标准收费' }],
                  })(<Input placeholder="请输入标准收费" className={styles['ant-input-lg']} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={fieldLabels.realCharge}>
                  {getFieldDecorator('realCharge', {
                    rules: [{ required: true, message: '请输入实际收费' }],
                  })(<Input placeholder="请输入实际收费" className={styles['ant-input-lg']} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={fieldLabels.discountRate}>
                  {getFieldDecorator('discountRate', {
                    rules: [{ required: true, message: '请输入折扣率' }],
                  })(<Input placeholder="请输入折扣率" className={styles['ant-input-lg']} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col>
                <Form.Item {...cnumcol} label={fieldLabels.entrustType}>
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
                <Form.Item label={fieldLabels.acceptancePerson}>
                  {getFieldDecorator('acceptancePerson', {
                    rules: [{ required: true, message: '请输入承接人' }],
                  })(<Input placeholder="请输入承接人" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={fieldLabels.acceptanceDate}>
                  {getFieldDecorator('acceptanceDate', {
                    rules: [{ required: true, message: '请选择承接日期' }],
                  })(<DatePicker placeholder="请选择承接日期" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={fieldLabels.acceptanceDepartment}>
                  {getFieldDecorator('acceptanceDepartment', {
                    rules: [{ required: true, message: '请输入承接部门' }],
                  })(<Input placeholder="请输入承接部门" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={fieldLabels.businessSource}>
                  {getFieldDecorator('businessSource', {
                    rules: [{ required: true, message: '请输入业务来源' }],
                  })(<Input placeholder="请输入业务来源" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item label={fieldLabels.planedProjectImplementationDate}>
                  {getFieldDecorator('planedProjectImplementationDate', {
                    rules: [{ required: true, message: '请选择计划项目实施时间' }],
                  })(<DatePicker placeholder="请选择计划项目实施时间" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={fieldLabels.planedIssueReportingDate}>
                  {getFieldDecorator('planedIssueReportingDate', {
                    rules: [{ required: true, message: '请选择计划出具报告时间' }],
                  })(<DatePicker placeholder="请选择计划出具报告时间" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col>
                <Form.Item {...remarkcol} label={fieldLabels.competentPartnerApproval}>
                  {getFieldDecorator('competentPartnerApproval', {
                    rules: [{ required: false, message: '请输入主管合伙人审批' }],
                  })(<Input placeholder="请输入主管合伙人审批" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...remarkcol} label={fieldLabels.ImplementSignature}>
                  {getFieldDecorator('ImplementSignature', {
                    rules: [{ required: false, message: '请输入项目实施部门负责人签名' }],
                  })(<Input placeholder="请输入项目实施部门负责人签名" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...remarkcol} label={fieldLabels.pursuitSignature}>
                  {getFieldDecorator('pursuitSignature', {
                    rules: [{ required: false, message: '请输入落实项目负责人签名' }],
                  })(<Input placeholder="请输入落实项目负责人签名" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...remarkcol} label={fieldLabels.projectMembers}>
                  {getFieldDecorator('projectMembers', {
                    rules: [{ required: false, message: '请输入计划项目组成员' }],
                  })(<Input placeholder="请输入计划项目组成员" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...remarkcol} label={fieldLabels.technicalSupervisionSignature}>
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
                <Form.Item label={fieldLabels.planChangeReason}>
                  {getFieldDecorator('planChangeReason', {
                    rules: [{ required: true, message: '请输入计划调整理由' }],
                  })(<Input placeholder="请输入计划调整理由" className={styles['ant-input-lg']} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col>
                <Form.Item {...cnumcol} label={fieldLabels.technicalSupervisionOpinion}>
                  {getFieldDecorator('technicalSupervisionOpinion', {
                    rules: [{ required: false, message: '请输入项目实施部门负责人意见' }],
                  })(<Input placeholder="请输入项目实施部门负责人意见" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col>
                <Form.Item label={fieldLabels.technicalSupervisionOpinion}>
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
                <Form.Item label={fieldLabels.auditOpinion}>
                  {getFieldDecorator('auditOpinion', {
                    rules: [{ required: true, message: '请输入审计意见' }],
                  })(<Input placeholder="请输入审计意见" className={styles['ant-input-lg']} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={fieldLabels.CPA_Signature}>
                  {getFieldDecorator('CPA_Signature', {
                    rules: [{ required: true, message: '请输入签字注册会计师' }],
                  })(
                    <Input placeholder="请输入签字注册会计师" className={styles['ant-input-lg']} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
                <Button style={{ marginLeft: 8 }}>取消</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(Circulation));
