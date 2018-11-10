import React, { PureComponent } from 'react';
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
  Button,
  Popover,
} from 'antd';
import { connect } from 'dva';
import StandardTable from 'components/StandardTable';
import styles from './style.less';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Option } = Select;

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

const fieldLabels = {
  applicationNumber: '申请单号',
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
};

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class InvoiceTabs extends PureComponent {
  state = {
    width: '100%',
    selectedRows: [],
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
    const {
      form,
      dispatch,
      submitting,
      invoiceTabsVisible,
      handleInvoiceTabsVisible,
      rule: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
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
          handleInvoiceTabsVisible(false);
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
        dataIndex: 'invoiceMoneyAlready',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
    ];
    return (
      <Modal
        title="申请开票"
        style={{ top: 150 }}
        // 对话框是否可见
        visible={invoiceTabsVisible}
        width="75%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleInvoiceTabsVisible()}
        okText="提交"
      >
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <Icon type="team" />开票申请流转
              </span>
            }
            key="1"
          >
            <div>
              <Form layout="horizontal">
                <Divider orientation="left">项目承接与分配阶段</Divider>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.applicationNumber}>
                      {getFieldDecorator('applicationNumber', {
                        rules: [{ required: true, message: '请委托方名称' }],
                      })(<Input placeholder="申请单号" style={{ width: 150 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.clientName}>
                      {getFieldDecorator('clientName', {
                        rules: [{ required: true, message: '请委托方名称' }],
                      })(
                        <Select placeholder="请委托方名称" style={{ width: 150 }}>
                          <Option value="0">杭州客户</Option>
                          <Option value="g">新昌客户</Option>
                          <Option value="y">诸暨客户</Option>
                          <Option value="q">河南客户</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.projectUnitName}>
                      {getFieldDecorator('projectUnitName', {
                        rules: [{ required: false, message: '请选择项目单位名称' }],
                      })(
                        <Select placeholder="请选择项目单位名称" style={{ width: 150 }}>
                          <Option value="0">杭州客户</Option>
                          <Option value="g">新昌客户</Option>
                          <Option value="y">诸暨客户</Option>
                          <Option value="q">河南客户</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.businessSource}>
                      {getFieldDecorator('businessSource', {
                        rules: [{ required: false, message: '请输入业务来源' }],
                      })(<Input placeholder="请输入业务来源" style={{ width: 150 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.businessType}>
                      {getFieldDecorator('businessType', {
                        rules: [{ required: false, message: '请选择业务类型' }],
                      })(
                        <Select placeholder="请选择业务类型" style={{ width: 150 }}>
                          <Option value="0">杭州客户</Option>
                          <Option value="g">新昌客户</Option>
                          <Option value="y">诸暨客户</Option>
                          <Option value="q">河南客户</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.specificBusinessType}>
                      {getFieldDecorator('specificBusinessType', {
                        rules: [{ required: false, message: '请选择具体业务类型' }],
                      })(
                        <Select placeholder="请选择具体业务类型" style={{ width: 150 }}>
                          <Option value="0">杭州客户</Option>
                          <Option value="g">新昌客户</Option>
                          <Option value="y">诸暨客户</Option>
                          <Option value="q">河南客户</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.entrustType}>
                      {getFieldDecorator('entrustType', {
                        rules: [{ required: false, message: '请选择委托类型' }],
                      })(
                        <Select placeholder="请选择委托类型" style={{ width: 150 }}>
                          <Option value="0">首年</Option>
                          <Option value="g">第二年</Option>
                          <Option value="y">第三年</Option>
                          <Option value="q">三年以上</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.standardCharge}>
                      {getFieldDecorator('standardCharge', {
                        rules: [{ required: false, message: '请输入标准收费' }],
                      })(<Input placeholder="请输入标准收费" style={{ width: 150 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.realCharge}>
                      {getFieldDecorator('realCharge', {
                        rules: [{ required: false, message: '请输入实际收费' }],
                      })(<Input placeholder="请输入实际收费" style={{ width: 150 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.discountRate}>
                      {getFieldDecorator('discountRate', {
                        rules: [{ required: false, message: '请输入折扣率' }],
                      })(<Input placeholder="请输入折扣率" style={{ width: 150 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.acceptancePerson}>
                      {getFieldDecorator('acceptancePerson', {
                        rules: [{ required: false, message: '请输入承接人' }],
                      })(<Input placeholder="请输入承接人" style={{ width: 150 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.acceptanceDate}>
                      {getFieldDecorator('acceptanceDate', {
                        rules: [{ required: false, message: '请选择承接日期' }],
                      })(<DatePicker placeholder="请选择承接日期" style={{ width: 150 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.acceptanceDepartment}>
                      {getFieldDecorator('acceptanceDepartment', {
                        rules: [{ required: false, message: '请输入承接部门' }],
                      })(<Input placeholder="请输入承接部门" style={{ width: 150 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['row-h']}>
                  <Col span={12}>
                    <Form.Item
                      {...formItemLayout}
                      label={fieldLabels.planedProjectImplementationDate}
                    >
                      {getFieldDecorator('planedProjectImplementationDate', {
                        rules: [{ required: false, message: '请选择计划项目实施时间' }],
                      })(
                        <DatePicker placeholder="请选择计划项目实施时间" style={{ width: 200 }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.planedIssueReportingDate}>
                      {getFieldDecorator('planedIssueReportingDate', {
                        rules: [{ required: false, message: '请选择计划出具报告时间' }],
                      })(
                        <DatePicker placeholder="请选择计划出具报告时间" style={{ width: 200 }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['row-h']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.competentPartnerApproval}>
                      {getFieldDecorator('competentPartnerApproval', {
                        rules: [{ required: false, message: '请输入主管合伙人审批' }],
                      })(<Input placeholder="请输入主管合伙人审批" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['row-h']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.ImplementSignature}>
                      {getFieldDecorator('ImplementSignature', {
                        rules: [{ required: false, message: '请输入项目实施部门负责人签名' }],
                      })(
                        <Input placeholder="请输入项目实施部门负责人签名" style={{ width: 200 }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.pursuitSignature}>
                      {getFieldDecorator('pursuitSignature', {
                        rules: [{ required: false, message: '请输入落实项目负责人签名' }],
                      })(<Input placeholder="请输入落实项目负责人签名" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['row-h']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.projectMembers}>
                      {getFieldDecorator('projectMembers', {
                        rules: [{ required: false, message: '请输入计划项目组成员' }],
                      })(<Input placeholder="请输入计划项目组成员" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...formItemLayout}
                      label={fieldLabels.technicalSupervisionSignature}
                    >
                      {getFieldDecorator('technicalSupervisionSignature', {
                        rules: [{ required: false, message: '请输入负责项目技术督导人签名' }],
                      })(
                        <Input placeholder="请输入负责项目技术督导人签名" style={{ width: 200 }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Divider orientation="left">项目实施阶段</Divider>
                <Row className={styles['row-h']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.projectPersonChange}>
                      {getFieldDecorator('projectPersonChange', {
                        rules: [{ required: false, message: '请输入项目组人员调整' }],
                      })(<Input placeholder="请输入项目组人员调整" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.planedDateChange}>
                      {getFieldDecorator('planedDateChange', {
                        rules: [{ required: false, message: '请输入计划时间调整' }],
                      })(<Input placeholder="请输入计划时间调整" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.planChangeReason}>
                      {getFieldDecorator('planChangeReason', {
                        rules: [{ required: false, message: '请输入计划调整理由' }],
                      })(<Input placeholder="请输入计划调整理由" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['row-h']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.ImplementOpinion}>
                      {getFieldDecorator('ImplementOpinion', {
                        rules: [{ required: false, message: '请输入项目实施部门负责人意见' }],
                      })(
                        <Input placeholder="请输入项目实施部门负责人意见" style={{ width: 200 }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['row-h']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.technicalSupervisionOpinion}>
                      {getFieldDecorator('technicalSupervisionOpinion', {
                        rules: [{ required: false, message: '请输入负责项目技术督导人意见' }],
                      })(
                        <Input placeholder="请输入负责项目技术督导人意见" style={{ width: 200 }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Divider orientation="left">项目完成阶段</Divider>
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.projectResponsiblePerson}>
                      {getFieldDecorator('projectResponsiblePerson', {
                        rules: [{ required: false, message: '请输入项目负责人' }],
                      })(<Input placeholder="请输入项目负责人" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.actualSubmissionDate}>
                      {getFieldDecorator('actualSubmissionDate', {
                        rules: [{ required: false, message: '请选择实际提交报告日期' }],
                      })(
                        <DatePicker placeholder="请选择实际提交报告日期" style={{ width: 200 }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.comprehensiveUnitSignature}>
                      {getFieldDecorator('comprehensiveUnitSignature', {
                        rules: [{ required: false, message: '请选择综合部签收人' }],
                      })(<Input placeholder="请选择综合部签收人" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.signDate}>
                      {getFieldDecorator('signDate', {
                        rules: [{ required: false, message: '请选择签收日期' }],
                      })(<DatePicker placeholder="请选择签收日期" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.auditOpinion}>
                      {getFieldDecorator('auditOpinion', {
                        rules: [{ required: false, message: '请输入审计意见' }],
                      })(<Input placeholder="请输入审计意见" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.CPA_Signature}>
                      {getFieldDecorator('CPA_Signature', {
                        rules: [{ required: false, message: '请输入签字注册会计师' }],
                      })(<Input placeholder="请输入签字注册会计师" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="api" />开票信息
              </span>
            }
            key="2"
          >
            <div>
              <Collapse defaultActiveKey={['1', '2']}>
                <Panel header="开票信息" key="1">
                  <Card>
                    <Form layout="horizontal">
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.invoiceName}>
                            {getFieldDecorator('invoiceName', {
                              rules: [{ required: false, message: '请选择开票名称' }],
                            })(
                              <Select placeholder="请选择开票名称" style={{ width: 150 }}>
                                <Option value="杭州客户">杭州客户</Option>
                                <Option value="新昌客户">新昌客户</Option>
                                <Option value="诸暨客户">诸暨客户</Option>
                                <Option value="河南客户">河南客户</Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.invoiceMoney}>
                            {getFieldDecorator('invoiceMoney', {
                              rules: [{ required: false, message: '请输入开票金额' }],
                            })(
                              <Input disabled placeholder="自动计算带出" style={{ width: 150 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.invoicePersonnel}>
                            {getFieldDecorator('invoicePersonnel', {
                              rules: [{ required: false, message: '请选择开票人员' }],
                            })(
                              <Select placeholder="请选择开票人员" style={{ width: 150 }}>
                                <Option value="人员A">人员A</Option>
                                <Option value="人员B">人员B</Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.invoiceCompany}>
                            {getFieldDecorator('invoiceCompany', {
                              rules: [{ required: false, message: '请选择开票公司' }],
                            })(
                              <Select placeholder="请选择开票公司" style={{ width: 150 }}>
                                <Option value="杭州客户">杭州客户</Option>
                                <Option value="新昌客户">新昌客户</Option>
                                <Option value="诸暨客户">诸暨客户</Option>
                                <Option value="河南客户">河南客户</Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.specificBusinessType}>
                            {getFieldDecorator('specificBusinessType', {
                              rules: [{ required: false, message: '请选择开票类型' }],
                            })(
                              <Select placeholder="请选择开票类型" style={{ width: 150 }}>
                                <Option value="服务业发展">服务业发展</Option>
                                <Option value="增值税发票">增值税发票</Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.taxNumber}>
                            {getFieldDecorator('taxNumber', {
                              rules: [{ required: true, message: '请输入税号' }],
                            })(<Input placeholder="请输入税号" style={{ width: 150 }} />)}
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
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(InvoiceTabs));
