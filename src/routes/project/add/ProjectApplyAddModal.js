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
} from 'antd';
import StandardTable from 'components/StandardTable';
import { connect } from 'dva';
import styles from './style.less';

const { Step } = Steps;
const mockData = [];
for (let i = 0; i < 10; i++) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
};
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
  listType: 'picture',
  defaultFileList: [...fileList],
  className: styles['upload-list-inline'],
};
const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;
const optionshz = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
const CustomerOption = ['贵宾', '重要客户', '一般客户', '潜在客户'];
const IndustryOption = ['制造业','服务业','房地产建筑','三农业务','政府购买','商业','金融','非营利组织','其他'];
const IncomeTaxOption = ['查账征收','核定征收'];
const statusOption = ['保存','启用','禁用'];


/*const fieldLabels = {
  customerCode: '客户编码',
  customerLevel: '客户等级',
  industry: '所属行业',
  customerName: '客户名称',
  dateRange: '生效日期',
  simpleName: '简称',
  pinyin: ' 拼 音 码 ',
  url: '网站主页',
  taxCode: '税务登记号',
  mobilePhone: '移动电话',
  email: '电子邮箱',
  companyPhone: '办公电话',
  postalCode: '邮政编码',
  region: '所在区域',
  incomeTax: '所得税征收方式',
  company: '所属公司',
  address: '详细地址',
  remark: '备注',
  status: '状态',
  companyName:'单位名称',
  companyAddress:'单位地址',
  taxNumber:'税号',
  openAccountBank:'开户银行',
  bankAccount:'银行账户',
};*/

const fieldLabels = {
  ProjectCode:'项目编码',
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
  companyName:'单位名称',
  companyAddress:'单位地址',
  taxNumber:'税号',
  openAccountBank:'开户银行',
  bankAccount:'银行账户',
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
function onChange(value) {
  console.log(value);
}

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class ProjectApplyAddModal extends PureComponent {
  state = {
    width: '100%',
    levelOptionData: [],
    industryOptionData:[],
    incomeTaxOptionData:[],
    statusOptionData:[],
    selectedRows:[],
    targetKeys:[],
    selectedKeys: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleLevelChange = () => {
    this.setState({
      levelOptionData: CustomerOption.map((data) => {
        const value = `${data}`;
        return <Option key={value}>{value}</Option>;
      }),
    });
  };

  handleIndustryChange = () => {
    this.setState({
      industryOptionData: IndustryOption.map((data) => {
        const value = `${data}`;
        return <Option key={value}>{value}</Option>;
      }),
    });
  };

  handleIncomeTaxChange = () => {
    this.setState({
      incomeTaxOptionData: IncomeTaxOption.map((data) => {
        const value = `${data}`;
        return <Option key={value}>{value}</Option>;
      }),
    });
  };

  handleStatusChange = () => {
    this.setState({
      statusOptionData: statusOption.map((data) => {
        const value = `${data}`;
        return <Option key={value}>{value}</Option>;
      }),
    });
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
    const { form, dispatch, submitting , projectApplyAddVisible, handleProjectApplyAddVisible, rule: { data }, loading} = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedKeys, selectedRows } = this.state;
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
    return (
      <Modal
        title="项目审批流"
        style={{ top: 20 }}
        visible={projectApplyAddVisible}
        width="100%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Form layout="horizontal">
            <Card>
              <Steps>
                <Step status="finish" title="项目信息" />
                <Step status="finish" title="人员分配" />
                <Step status="process" title="资料上传" icon={<Icon type="loading" />} />
                <Step status="wait" title="项目过程" />
                <Step status="wait" title="报告审核" />
                <Step status="wait" title="生成报告号" />
                <Step status="wait" title="报告文印/盖章" />
                <Step status="wait" title="项目归档" />
                <Step status="wait" title="生成知识体系" />
              </Steps>
            </Card>
            <Collapse defaultActiveKey={['1','2']} >
              <Panel header="项目信息" key="1">
                <Row className={styles['fn-mb-15']}>
                  <Col span={23} pull={5}>
                    <Form.Item {...formItemLayout} label={fieldLabels.name}>
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入项目名称' }],
                      })(<Input disabled placeholder="请输入项目名称" className={styles['ant-input-lg']} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.type}>
                      {getFieldDecorator('type', {
                        rules: [{ required: true, message: '请选择项目类别' }],
                      })(
                        <Select disabled placeholder="请选择项目类别" style={{ width: 200 }}>
                          <Option value="0">请选择</Option>
                          <Option value="g">工程造价业务项目</Option>
                          <Option value="y">咨询报告</Option>
                          <Option value="q">招标</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.years}>
                      {getFieldDecorator('years', {
                        rules: [{ required: true, message: '请选择年度' }],
                      })(
                        <Select disabled placeholder="请选择年度" style={{ width: 200 }}>
                          <Option value="xiao">请选择</Option>
                          <Option value="z">2018</Option>
                          <Option value="f">2019</Option>
                          <Option value="fd">2020</Option>
                          <Option value="sn">2021</Option>
                          <Option value="zf">2022</Option>
                          <Option value="sy">2023</Option>
                          <Option value="jr">2024</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.status}>
                      {getFieldDecorator('status', {
                        rules: [{ required: true, message: '请选择项目状态' }],
                      })(
                        <Select disabled placeholder="请选择项目状态" style={{ width: 200 }}>
                          <Option value="c">启用</Option>
                          <Option value="h">禁用</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.ProjectCode}>
                      {getFieldDecorator('ProjectCode', {
                        rules: [{ required: false, message: '请输入项目编码' }],
                      })(<Input disabled placeholder="请输入项目编码" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.customer}>
                      {getFieldDecorator('customer', {
                        rules: [{ required: true, message: '请选择客户' }],
                      })(
                        <Select disabled placeholder="请选择客户" style={{ width: 200 }}>
                          <Option value="xiao">请选择</Option>
                          <Option value="z">客户A</Option>
                          <Option value="f">客户B</Option>
                          <Option value="fd">客户C</Option>
                          <Option value="sn">客户D</Option>
                          <Option value="zf">客户E</Option>
                          <Option value="sy">客户F</Option>
                          <Option value="jr">客户H</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.cuslink}>
                      {getFieldDecorator('cuslink', {
                        rules: [{ required: true, message: '请选择客户联系人' }],
                      })(
                        <Select disabled placeholder="请选择客户联系人" style={{ width: 200 }}>
                          <Option value="xiao">请选择</Option>
                          <Option value="z">客户联系人A</Option>
                          <Option value="f">客户联系人B</Option>
                          <Option value="fd">客户联系人C</Option>
                          <Option value="sn">客户联系人D</Option>
                          <Option value="zf">客户联系人E</Option>
                          <Option value="sy">客户联系人F</Option>
                          <Option value="jr">客户联系人H</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.fzcompany}>
                      {getFieldDecorator('fzcompany', {
                        rules: [{ required: true, message: '负责公司' }],
                      })(
                        <Select disabled placeholder="负责公司" style={{ width: 200 }}>
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
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.fzperson}>
                      {getFieldDecorator('fzperson', {
                        rules: [{ required: true, message: '项目负责人' }],
                      })(
                        <Select disabled placeholder="负责公司" style={{ width: 200 }}>
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
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.fee}>
                      {getFieldDecorator('fee', {
                        rules: [{ required: true, message: '请输入项目费用' }],
                      })(<Input disabled placeholder="请输入项目费用" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.startdate}>
                      {getFieldDecorator('startdate')(
                        <DatePicker disabled style={{ width: 200 }} placeholder="请输入开始日期" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.enddate}>
                      {getFieldDecorator('enddate')(
                        <DatePicker disabled style={{ width: 200 }} placeholder="请输入结束日期" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} />
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={23} pull={5}>
                    <Form.Item {...formItemLayout} label={fieldLabels.biztype}>
                      {getFieldDecorator('biztype')(
                        <Checkbox.Group disabled style={{ width: '100%' }}>
                          <Row>
                            <Col span={8}>
                              <Checkbox value="A">预算编制</Checkbox>
                            </Col>
                            <Col span={8}>
                              <Checkbox value="B">结算编制</Checkbox>
                            </Col>
                            <Col span={8}>
                              <Checkbox value="C">建设工程招标代理</Checkbox>
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
                              <Checkbox value="G">政府采购招标代理</Checkbox>
                            </Col>
                            <Col span={8}>
                              <Checkbox value="H">咨询报告</Checkbox>
                            </Col>
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
              </Panel>
              <Panel header="人员分配" key="2">
                <Row className={styles['fn-mb-15']}>
                  <Col span={5} offset={6}>
                    <Form.Item {...formItemLayout} label={fieldLabels.assignor}>
                      {getFieldDecorator('assignor', {

                      })(
                        <div className={styles.divBorder}>
                          <Tree defaultExpandAll>
                            <TreeNode title="杭州至诚" key="0-0">
                              <TreeNode title="管理层1" key="0-0-0" >
                                <TreeNode title="员工1" key="0-0-0-0"  />
                                <TreeNode title="员工2" key="0-0-0-1" />
                              </TreeNode>
                              <TreeNode title="管理层2" key="0-0-1">
                                <TreeNode title="小卒1" key="0-0-1-0" />
                                <TreeNode title="小卒2" key="0-0-1-1" />
                              </TreeNode>
                            </TreeNode>
                            <TreeNode title="义务至诚" key="0-1">
                              <TreeNode title="董事会" key="0-1-0" >
                                <TreeNode title="主管1" key="0-1-0-0"  />
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
                  <Col span={13} >
                    <Form.Item >
                      {getFieldDecorator('personal', {
                      })(
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
              <Panel header="项目过程" key="4">
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.contractCode}>
                      {getFieldDecorator('contractCode', {
                        rules: [{ required: true, message: '不重复的数字' }],
                      })(
                        <Input placeholder="自动生成" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.contractTitle}>
                      {getFieldDecorator('contractTitle', {
                        rules: [{ required: true, message: '请输入合同标题' }],
                      })(
                        <Input placeholder="请输入合同标题" />
                      )}
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
                  <Col span={12} >
                    <Form.Item {...formItemLayout} label={fieldLabels.contractStatus}>
                      {getFieldDecorator('contractStatus', {
                        rules: [{ required: true, message: '请选择合同性质' }],
                      })(
                        <Select placeholder="请选择合同性质" >
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
                        <Select placeholder="对方公司" >
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
                        <Select placeholder="请选择客户授权代理人" >
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
                        <TextArea placeholder="请输入备注信息" rows={4} style={{width:'170%'}} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="审核报告" key="5">
                <Row className={styles['fn-mb-15']}>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label={fieldLabels.ReportName}>
                      {getFieldDecorator('ReportName', {
                      })(<Input disabled placeholder="报告名称" style={{ width: 200 }} />)}
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
              </Panel>
              <Panel header="生成报告号" key="6">
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="报告号">
                      {getFieldDecorator('companyName', {
                        rules: [{ required: true, message: '报告号' }],
                      })(
                        <div>
                          <Input disabled placeholder="报告号" className={styles['fn-mb-15']} />
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item {...formItemLayout} >
                      {getFieldDecorator('button', {
                      })(
                        <div>
                          <Button type="primary" >生成报告号</Button>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="报告日期">
                      {getFieldDecorator('companyAddress', {
                        rules: [{ required: true, message: '报告日期' }],
                      })(<Input placeholder="报告日期" className={styles['fn-mb-15']} />)}
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
                      })(<Input placeholder="报告名称" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="申请时间">
                      {getFieldDecorator('ApplyData', {
                        rules: [{ required: true, message: '申请时间' }],
                      })(<Input placeholder="申请时间" className={styles['fn-mb-15']} />)}
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
                      })(
                        <InputNumber placeholder="文印份数" min={1} max={99} defaultValue={1} />,
                      )}
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
                      })(
                        <Input placeholder="档案号" style={{ width: 200 }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="归档日期">
                      {getFieldDecorator('visitType', {
                        rules: [{ required: false, message: '归档日期' }],
                      })(
                        <Input placeholder="归档日期" style={{ width: 200 }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={24} pull={4}>
                    <Form.Item {...formItemLayout} label="档案名称">
                      {getFieldDecorator('visitType', {
                        rules: [{ required: false, message: '档案名称' }],
                      })(
                        <Input placeholder="档案名称" style={{ width: 650 }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={24} pull={4}>
                    <Form.Item {...formItemLayout} label="存放位置">
                      {getFieldDecorator('visitDate', {
                        rules: [{ required: false, message: '存放位置' }],
                      })(
                        <Input placeholder="存放位置" style={{ width: 650 }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={24} pull={4}>
                    <Form.Item {...formItemLayout} label="备注">
                      {getFieldDecorator('connectBusiness', {
                        rules: [{ required: false, message: '备注' }],
                      })(
                        <Input placeholder="备注" style={{ width: 650 }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Collapse defaultActiveKey={['1']} >
                  <Panel header="档案" key="1">
                    <div className={styles.tableListOperator}>
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
