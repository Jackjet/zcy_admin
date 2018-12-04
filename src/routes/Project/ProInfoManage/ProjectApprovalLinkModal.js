import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  // TimePicker,
  Input,
  InputNumber,
  Select,
  Popover,
  Modal,
  Cascader,
  Collapse,
  Checkbox,
  Upload,
  Tree,
  Transfer,
  Steps,
  Divider,
  Table,
  message,
} from 'antd';
import moment from 'moment/moment';
import StandardTable from 'components/StandardTable';
import { connect } from 'dva';
import styles from './style.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { Step } = Steps;
const mockData = [];
for (let i = 0; i < 10; i += 1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
}
const { TreeNode } = Tree;
const fileList = [
  {
    uid: -1,
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: -2,
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
];
const props2 = {
  action: '//jsonplaceholder.typicode.com/posts/',
  listType: 'text',
  defaultFileList: [...fileList],
  className: styles['upload-list-inline'],
};
const { Search } = Input;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;
const fieldLabels = {
  ProjectCode: '项目编码',
  ReportName: '报告名称',
  type: '项目类别',
  years: '年度',
  name: '项目名称',
  dateRange: '生效日期',
  cuslink: '客户联系人',
  customer: '客户',
  url: '网站主页',
  taxcode: '税务登记号',
  fzcompany: '负责公司',
  fzperson: '项目负责人',
  fee: '项目费用',
  startdate: '开始日期',
  enddate: '结束日期',
  biztype: '业务类别',
  content: '项目内容',
  address: '详细地址',
  remark: '备注',
  status: '状态',
  jfw: '交付物',
  demand: '客户需求',
  attachment: '附件',
  companyName: '单位名称',
  companyAddress: '单位地址',
  taxNumber: '税号',
  openAccountBank: '开户银行',
  bankAccount: '银行账户',
  contractCode: '合同编码',
  contractType: '合同类别',
  projectName: '项目名称',
  contractStatus: '合同性质',
  contractTitle: '合同标题',
  dfCompany: '对方公司',
  authorizedAgent: '客户授权代理人',
  PartyAcompany: '甲方公司',
  PartyBcompany: '乙方公司',
  fatherContract: '父合同',
  signDate: '签订日期',
  paymentMethod: '付款方式',
  businessType: '业务类别',
  contractSignPlace: '合同签订地点',
  contractSubject: '合同标的',
  startDate: '开始日期',
  endDate: '结束日期',
  totalAmount: '合同金额',
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
class ProjectApplyAddModal extends PureComponent {
  state = {
    width: '100%',
    selectedRows: [],
    targetKeys: [],
    selectedKeys: [],
    applyDate: moment(Date.now()),
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleUploadFile = info => {
    console.log(`${info.file.name}+1111`);
  };

  handleOnChange = info => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      console.log(`${info.file.name}`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      this.handleUploadFile(info);
      console.log(`${info.file.name}`);
    }
  };

  handleChange = nextTargetKeys => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  // 选中的行
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
      projectApplyAddVisible,
      handleProjectApplyAddVisible,
      rule: { data },
      loading,
      rowInfo,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedKeys, selectedRows, applyDate } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          form.resetFields();
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handleProjectApplyAddVisible(false);
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handleProjectApplyAddVisible(false);
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
    const uploadProps = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      onChange: this.handleOnChange,
    };
    const uploadColumns = [
      {
        title: '文件名称',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '操作',
        dataIndex: 'age',
        key: 'age',
        render: text => <a>{text}</a>,
      },
      {
        title: '版本',
        dataIndex: 'address',
        key: 'address',
        render: text => <a>{text}</a>,
      },
    ];
    const uploadData = [
      {
        key: '1',
        name: '文件1',
        age: '在线编辑',
        address: '3.0',
      },
      {
        key: '2',
        name: '文件2',
        age: '在线编辑',
        address: '2.0',
      },
      {
        key: '3',
        name: '文件3',
        age: '在线编辑',
        address: '1.0',
      },
    ];
    const columns = [
      {
        title: '清单编号',
        dataIndex: 'dictID',
      },
      {
        title: '文档名称',
        dataIndex: 'code',
      },
      {
        title: '页/份数',
        dataIndex: 'dictTypeName',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
    ];
    const columnsProcess = [
      {
        title: '项目频度',
        dataIndex: 'projectRate',
      },
      {
        title: '计划时间',
        dataIndex: 'planDate',
      },
      {
        title: '工程阶段',
        dataIndex: 'stage',
      },
      {
        title: '问题',
        dataIndex: 'problem',
      },
      {
        title: '协助',
        dataIndex: 'assist',
      },
    ];
    return (
      <Modal
        title="项目审批流"
        style={{ top: 20 }}
        visible={projectApplyAddVisible}
        width="100%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText="提交"
      >
        <div>
          <Form layout="horizontal">
            <Card>
              <Steps>
                <Step status="finish" title="项目信息" />
                <Step status="finish" title="人员分配" />
                <Step status="process" title="资料上传" icon={<Icon type="loading" />} />
                <Step status="wait" title="生成合同" />
                <Step status="wait" title="报告审核" />
                <Step status="wait" title="生成报告号" />
                <Step status="wait" title="报告文印/盖章" />
                <Step status="wait" title="项目归档" />
                <Step status="wait" title="生成知识体系" />
              </Steps>
            </Card>
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel header="项目信息" key="1">
                <Row className={styles['fn-mb-15']}>
                  <Col span={23} pull={5}>
                    <Form.Item {...formItemLayout} label={fieldLabels.name}>
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入项目名称' }],
                        initialValue:
                          `${rowInfo.customerName}` === 'undefined'
                            ? ''
                            : `${rowInfo.customerName}`,
                      })(<Input readOnly placeholder="请输入项目名称" style={{ width: '140%' }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.type}>
                      {getFieldDecorator('type', {
                        rules: [{ required: true, message: '请选择项目类别' }],
                        initialValue: `${rowInfo.projectType}`,
                      })(<Input readOnly placeholder="请选择项目类别" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.years}>
                      {getFieldDecorator('years', {
                        rules: [{ required: true, message: '请选择年度' }],
                        initialValue: `${moment().format('YYYY')}`,
                      })(<Input readOnly placeholder="请选择年度" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.status}>
                      {getFieldDecorator('status', {
                        rules: [{ required: true, message: '请选择项目状态' }],
                        initialValue: `新建`,
                      })(<Input readOnly placeholder="请选择项目状态" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="项目编号">
                      {getFieldDecorator('number', {
                        rules: [{ required: false, message: '请输入项目编码' }],
                        initialValue:
                          `${rowInfo.projectCode}` === 'undefined' ? '' : `${rowInfo.projectCode}`,
                      })(<Input readOnly placeholder="自动带出" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.customer}>
                      {getFieldDecorator('customer', {
                        rules: [{ required: true, message: '请选择客户' }],
                      })(
                        <Search
                          readOnly
                          placeholder="请选择客户"
                          onSearch={this.handleChoiceCusVisible}
                          style={{ width: 200 }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.cuslink}>
                      {getFieldDecorator('cuslink', {
                        rules: [{ required: true, message: '请选择客户联系人' }],
                      })(
                        <div>
                          <Input readOnly placeholder="请选择客户联系人" style={{ width: '63%' }} />
                          <Divider type="vertical" />
                          <a>新增联系人</a>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.fzcompany}>
                      {getFieldDecorator('fzcompany', {
                        rules: [{ required: true, message: '负责公司' }],
                      })(<Input readOnly placeholder="负责公司" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="项目负责人">
                      {getFieldDecorator('fzperson', {
                        rules: [{ required: true, message: '项目负责人' }],
                      })(<Input readOnly placeholder="负责公司" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="项目部门">
                      {getFieldDecorator('fzperson', {
                        rules: [{ required: true, message: '项目部门' }],
                      })(<Input readOnly placeholder="自动带出" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.fee}>
                      {getFieldDecorator('fee', {
                        rules: [{ required: true, message: '请输入项目费用' }],
                      })(<Input readOnly placeholder="请输入项目费用" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="业务来源">
                      {getFieldDecorator('billSource', {
                        rules: [{ required: true, message: '业务来源' }],
                        initialValue: `${rowInfo.BillSource}`,
                      })(<Input readOnly placeholder="业务来源" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  {`${rowInfo.BillSource}` === `合伙人` && (
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="合伙人">
                        {getFieldDecorator('partner')(
                          <Input readOnly style={{ width: '100%' }} placeholder="合伙人" />
                        )}
                      </Form.Item>
                    </Col>
                  )}
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="施工单位">
                      {getFieldDecorator('shigongdanwei', {})(
                        <Search
                          readOnly
                          placeholder="施工单位"
                          onSearch={this.handleConstructUnitVisible}
                          style={{ width: 200 }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="合同编号">
                      {getFieldDecorator('contractCode')(
                        <div>
                          <Input readOnly style={{ width: '68%' }} placeholder="合同编号" />
                          <Divider type="vertical" />
                          <a>新增合同</a>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="开始时间">
                      {getFieldDecorator('startDate')(
                        <Input readOnly style={{ width: '100%' }} placeholder="请输入开始时间" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.endDate}>
                      {getFieldDecorator('endDate')(
                        <Input readOnly style={{ width: '100%' }} placeholder="请输入结束日期" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} />
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="指派编号">
                      {getFieldDecorator('zhipaiCode')(
                        <Input
                          readOnly
                          placeholder="指派编号+弹出项目指派列表"
                          style={{ width: 200 }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} />
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={23} pull={5}>
                    <Form.Item {...formItemLayout} label={fieldLabels.biztype}>
                      {getFieldDecorator('biztype', {})(
                        <Checkbox.Group style={{ width: '100%' }}>
                          <Row>
                            {(`${rowInfo.projectType}` === `工程造价业务项目` ||
                              `${rowInfo.projectType}` === `可研报告`) && (
                              <span>
                                <Col span={8}>
                                  <Checkbox value="A">预算编制</Checkbox>
                                </Col>
                                <Col span={8}>
                                  <Checkbox value="B">结算编制</Checkbox>
                                </Col>
                                <Col span={8}>
                                  <Checkbox value="D">咨询审核</Checkbox>
                                </Col>
                                <Col span={8}>
                                  <Checkbox value="E">预算审核</Checkbox>
                                </Col>
                                <Col span={8}>
                                  <Checkbox value="F">结算审核</Checkbox>
                                </Col>
                                <Col span={8}>
                                  <Checkbox value="H">咨询报告</Checkbox>
                                </Col>
                              </span>
                            )}

                            {(`${rowInfo.projectType}` === `招标代理业务项目` ||
                              `${rowInfo.projectType}` === `可研报告`) && (
                              <span>
                                <Col span={8}>
                                  <Checkbox value="G">政府采购招标代理</Checkbox>
                                </Col>
                                <Col span={8}>
                                  <Checkbox value="C">建设工程招标代理</Checkbox>
                                </Col>
                              </span>
                            )}
                          </Row>
                        </Checkbox.Group>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={23} pull={5}>
                    <Form.Item {...formItemLayout} label={fieldLabels.attachment}>
                      {getFieldDecorator('attachment ', {
                        initialValue: '1',
                      })(
                        <Upload {...props2}>
                          <Button type="primary">
                            <Icon type="upload" /> 上传附件
                          </Button>
                          <span>
                            *只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif，最多上传5个附件
                          </span>
                        </Upload>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Divider orientation="left">{rowInfo.projectType}</Divider>
                {`${rowInfo.projectType}` === `工程造价业务项目` && (
                  <div>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="项目个数">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="项目个数" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="送审金额">
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="送审金额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核减额">
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="合伙人" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核增额">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="核增额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="建筑面积">
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="建筑面积" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核定或预算总造价">
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="核定或预算总造价" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={23} pull={5}>
                        <Form.Item {...formItemLayout} label="备注">
                          {getFieldDecorator('shigongdanwei')(
                            <TextArea style={{ width: '100%' }} placeholder="备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
                {`${rowInfo.projectType}` === `可研报告` && (
                  <div>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="项目个数">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="项目个数" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="送审金额">
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="送审金额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核减额">
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="合伙人" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核增额">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="核增额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="建筑面积">
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="建筑面积" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核定或预算总造价">
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="核定或预算总造价" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={23} pull={5}>
                        <Form.Item {...formItemLayout} label="备注">
                          {getFieldDecorator('shigongdanwei')(
                            <TextArea style={{ width: '100%' }} placeholder="备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
                {`${rowInfo.projectType}` === `招标代理业务项目` && (
                  <div>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="招标公告发布">
                          {getFieldDecorator('shigongdanwei')(
                            <DatePicker style={{ width: '100%' }} placeholder="招标公告发布" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="招标文件发布">
                          {getFieldDecorator('contractCode')(
                            <DatePicker style={{ width: '100%' }} placeholder="招标文件发布" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="开标日期">
                          {getFieldDecorator('shigongdanwei')(
                            <DatePicker style={{ width: '100%' }} placeholder="开标日期" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="结束日期">
                          {getFieldDecorator('contractCode')(
                            <DatePicker style={{ width: '100%' }} placeholder="结束日期" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="项目个数">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="项目个数" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="控制价">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="控制价" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="中标价">
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="中标价" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={21} pull={3}>
                        <Form.Item {...formItemLayout} label="备注">
                          {getFieldDecorator('shigongdanwei')(
                            <TextArea style={{ width: '100%' }} placeholder="备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
              </Panel>
              <Panel header="人员分配" key="2">
                <Row className={styles['fn-mb-15']}>
                  <Col span={5} offset={6}>
                    <Form.Item {...formItemLayout} label={fieldLabels.assignor}>
                      {getFieldDecorator('assignor', {})(
                        <div className={styles.divBorder}>
                          <Tree defaultExpandAll>
                            <TreeNode title="杭州至诚" key="0-0">
                              <TreeNode title="管理层1" key="0-0-0">
                                <TreeNode title="员工1" key="0-0-0-0" />
                                <TreeNode title="员工2" key="0-0-0-1" />
                              </TreeNode>
                              <TreeNode title="管理层2" key="0-0-1">
                                <TreeNode title="小卒1" key="0-0-1-0" />
                                <TreeNode title="小卒2" key="0-0-1-1" />
                              </TreeNode>
                            </TreeNode>
                            <TreeNode title="义务至诚" key="0-1">
                              <TreeNode title="董事会" key="0-1-0">
                                <TreeNode title="主管1" key="0-1-0-0" />
                                <TreeNode title="主管2" key="0-1-0-1" />
                              </TreeNode>
                              <TreeNode title="财务部" key="0-1-1">
                                <TreeNode title="会计1" key="0-1-1-0" />
                              </TreeNode>
                            </TreeNode>
                          </Tree>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={13}>
                    <Form.Item>
                      {getFieldDecorator('personal', {})(
                        <div>
                          <Transfer
                            dataSource={mockData}
                            titles={['可选人员', '已选人员']}
                            targetKeys={this.state.targetKeys}
                            listStyle={{
                              width: 200,
                              height: 200,
                            }}
                            selectedKeys={selectedKeys}
                            onChange={this.handleChange}
                            onSelectChange={this.handleSelectChange}
                            render={item => item.title}
                          />
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="资料上传" key="3">
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="底稿">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: false, message: '请输入单位名称' }],
                      })(
                        <div>
                          <Upload {...uploadProps}>
                            <Button>
                              <Icon type="upload" /> 底稿
                            </Button>
                          </Upload>
                          <br />
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="文档">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: false, message: '请输入单位名称' }],
                      })(
                        <div>
                          <Upload {...uploadProps}>
                            <Button>
                              <Icon type="upload" /> 文档
                            </Button>
                          </Upload>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="图片">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: false, message: '请输入单位名称' }],
                      })(
                        <div>
                          <Upload {...uploadProps}>
                            <Button>
                              <Icon type="upload" /> 图片
                            </Button>
                          </Upload>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} push={2}>
                    <Form.Item {...formItemLayout} lable="文档列表">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: false, message: '请输入单位名称' }],
                      })(
                        <div style={{ marginTop: -25 }}>
                          <Table
                            showHeader={false}
                            pagination={false}
                            columns={uploadColumns}
                            dataSource={uploadData}
                          />
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="过程管理" key="11">
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columnsProcess}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </Panel>
              <Panel header="生成合同" key="4">
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.contractCode}>
                      {getFieldDecorator('contractCode', {
                        rules: [{ required: true, message: '不重复的数字' }],
                      })(<Input placeholder="自动生成" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.contractTitle}>
                      {getFieldDecorator('contractTitle', {
                        rules: [{ required: true, message: '请输入合同标题' }],
                      })(<Input placeholder="请输入合同标题" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.totalAmount}>
                      {getFieldDecorator('totalAmount', {
                        rules: [{ required: true, message: '请输入总金额' }],
                      })(<Input placeholder="请输入合同标题" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.contractStatus}>
                      {getFieldDecorator('contractStatus', {
                        rules: [{ required: true, message: '请选择合同性质' }],
                      })(
                        <Select placeholder="请选择合同性质">
                          <Option value="c">工程</Option>
                          <Option value="h">建设</Option>
                          <Option value="h">其它</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.dfCompany}>
                      {getFieldDecorator('dfCompany', {
                        rules: [{ required: false, message: '对方公司' }],
                      })(
                        <Select placeholder="对方公司">
                          <Option value="xiao">请选择</Option>
                          <Option value="z">公司A</Option>
                          <Option value="f">公司B</Option>
                          <Option value="fd">公司C</Option>
                          <Option value="sn">公司D</Option>
                          <Option value="zf">公司E</Option>
                          <Option value="sy">公司F</Option>
                          <Option value="jr">公司H</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.authorizedAgent}>
                      {getFieldDecorator('authorizedAgent', {
                        rules: [{ required: false, message: '客户授权代理人' }],
                      })(
                        <Select placeholder="请选择客户授权代理人">
                          <Option value="xiao">请选择</Option>
                          <Option value="z">公司A</Option>
                          <Option value="f">公司B</Option>
                          <Option value="fd">公司C</Option>
                          <Option value="sn">公司D</Option>
                          <Option value="zf">公司E</Option>
                          <Option value="sy">公司F</Option>
                          <Option value="jr">公司H</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={24} pull={4}>
                    <Form.Item {...formItemLayout} label={fieldLabels.attachment}>
                      {getFieldDecorator('attachment ', {
                        initialValue: '1',
                      })(
                        <Upload {...props2}>
                          <Button type="primary">
                            <Icon type="upload" /> 上传附件
                          </Button>
                          <span>
                            *只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif，最多上传5个附件
                          </span>
                        </Upload>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={24} pull={4}>
                    <Form.Item {...formItemLayout} label={fieldLabels.remark}>
                      {getFieldDecorator('remark')(
                        <TextArea placeholder="请输入备注信息" rows={4} style={{ width: '170%' }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="审核报告" key="5">
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="底稿">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: false, message: '请输入单位名称' }],
                      })(
                        <div>
                          <Upload {...uploadProps}>
                            <Button>
                              <Icon type="upload" /> 底稿
                            </Button>
                          </Upload>
                          <br />
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="文档">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: false, message: '请输入单位名称' }],
                      })(
                        <div>
                          <Upload {...uploadProps}>
                            <Button>
                              <Icon type="upload" /> 终稿
                            </Button>
                          </Upload>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="图片">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: false, message: '请输入单位名称' }],
                      })(
                        <div>
                          <Upload {...uploadProps}>
                            <Button>
                              <Icon type="upload" /> 图片
                            </Button>
                          </Upload>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} push={2}>
                    <Form.Item {...formItemLayout} lable="底稿文档列表">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: false, message: '底稿文档列表' }],
                      })(
                        <div style={{ marginTop: -25 }}>
                          <Table
                            showHeader={false}
                            pagination={false}
                            columns={uploadColumns}
                            dataSource={uploadData}
                          />
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} push={2}>
                    <Form.Item {...formItemLayout} lable="终稿文档列表">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: false, message: '终稿文档列表' }],
                      })(
                        <div style={{ marginTop: -25 }}>
                          <Table
                            showHeader={false}
                            pagination={false}
                            columns={uploadColumns}
                            dataSource={uploadData}
                          />
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="生成报告号" key="6">
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="报告号">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: true, message: '报告号' }],
                      })(
                        <div>
                          <Input readOnly placeholder="报告号" className={styles['fn-mb-15']} />
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item {...formItemLayout}>
                      {getFieldDecorator('button', {})(
                        <div>
                          <Button type="primary">生成报告号</Button>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="报告日期">
                      {getFieldDecorator('companyAddress', {
                        rules: [{ required: true, message: '报告日期' }],
                        initialValue: this.state.applyDate,
                      })(
                        <DatePicker placeholder="报告日期" showTime format="YYYY-MM-DD HH:mm:ss" />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="报告文印/盖章" key="7">
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="报告名称">
                      {getFieldDecorator('ReportName', {
                        rules: [{ required: true, message: '报告名称' }],
                      })(<Input placeholder="自动带出" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="申请（盖章）时间">
                      {getFieldDecorator('ApplyData', {
                        rules: [{ required: true, message: '申请（盖章）时间' }],
                        initialValue: this.state.applyDate,
                      })(
                        <DatePicker placeholder="申请时间" showTime format="YYYY-MM-DD HH:mm:ss" />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="报告事由">
                      {getFieldDecorator('ReportCause', {
                        rules: [{ required: true, message: '报告事由' }],
                      })(<Input placeholder="报告事由" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="文印份数">
                      {getFieldDecorator('PrintingCopies', {
                        rules: [{ required: true, message: '文印份数' }],
                        initialValue: `1`,
                      })(<InputNumber placeholder="文印份数" min={1} max={99} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="项目归档" key="8">
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="档案号">
                      {getFieldDecorator('visitors', {
                        rules: [{ required: false, message: '档案号' }],
                      })(<Input placeholder="档案号" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="归档日期">
                      {getFieldDecorator('visitType', {
                        rules: [{ required: false, message: '归档日期' }],
                      })(<Input placeholder="归档日期" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="档案名称">
                      {getFieldDecorator('visitType', {
                        rules: [{ required: false, message: '档案名称' }],
                      })(<Input placeholder="档案名称" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="存放位置">
                      {getFieldDecorator('visitDate', {
                        rules: [{ required: false, message: '存放位置' }],
                      })(<Input placeholder="存放位置" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={24} pull={4}>
                    <Form.Item {...formItemLayout} label="备注">
                      {getFieldDecorator('connectBusiness', {
                        rules: [{ required: false, message: '备注' }],
                      })(<TextArea placeholder="备注" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="生成知识体系" key="9">
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.companyName}>
                      {getFieldDecorator('companyName', {
                        rules: [{ required: true, message: '请输入单位名称' }],
                      })(<Input placeholder="请输入单位名称" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.companyAddress}>
                      {getFieldDecorator('companyAddress', {
                        rules: [{ required: true, message: '请输入单位地址' }],
                      })(<Input placeholder="请输入单位地址" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.taxNumber}>
                      {getFieldDecorator('taxNumber', {
                        rules: [{ required: true, message: '请输入税号' }],
                      })(<Input placeholder="请输入税号" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.openAccountBank}>
                      {getFieldDecorator('openAccountBank', {
                        rules: [{ required: true, message: '请输入开户银行' }],
                      })(<Input placeholder="请输入开户银行" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.bankAccount}>
                      {getFieldDecorator('bankAccount', {
                        rules: [{ required: true, message: '请输入银行账户' }],
                      })(<Input placeholder="请输入银行账户" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="审批信息" key="10">
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.companyName}>
                      {getFieldDecorator('companyName', {
                        rules: [{ required: true, message: '请输入单位名称' }],
                      })(<Input placeholder="请输入单位名称" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.companyAddress}>
                      {getFieldDecorator('companyAddress', {
                        rules: [{ required: true, message: '请输入单位地址' }],
                      })(<Input placeholder="请输入单位地址" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.taxNumber}>
                      {getFieldDecorator('taxNumber', {
                        rules: [{ required: true, message: '请输入税号' }],
                      })(<Input placeholder="请输入税号" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.openAccountBank}>
                      {getFieldDecorator('openAccountBank', {
                        rules: [{ required: true, message: '请输入开户银行' }],
                      })(<Input placeholder="请输入开户银行" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.bankAccount}>
                      {getFieldDecorator('bankAccount', {
                        rules: [{ required: true, message: '请输入银行账户' }],
                      })(<Input placeholder="请输入银行账户" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Form>
        </div>
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ProjectApplyAddModal));
