import React, { PureComponent, Fragment } from 'react';
import moment from "moment/moment";
import {
  Tabs,
  Icon,
  Form,
  Modal,
  message,
  Card,
  Col,
  Row,
  Input,
  Select,
  Popover,
  Cascader,
  Collapse,
  Divider,
  Badge,
} from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable';
import VisitListViewModal from '../select/VisitListViewModal.js';
import ProjectInfo from '../../project/select/ProjectInfo';
import ContractViewInfo from '../../project/select/ContractInfo';
import picture from './test.png';
import styles from './style.less';


const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
const { Panel } = Collapse;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const fieldLabels = {
  customerCode: '客户编码',
  customerLevel: '客户等级',
  industry: '所属行业',
  customerName: '客户名称',
  dateRange: '生效日期',
  simpleName: '简称',
  pinyin: ' 拼 音 码 ',
  url: '网站主页',
  taxCode: '税务登记号',
  mobilePhone: '移动手机',
  email: '电子邮箱',
  companyPhone: '公司电话',
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
};
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

function onChange(value) {
  console.log(value);
}
const cnumcol = {
  style: {
    paddingLeft: 10,
  },
};

const cpinyincol = {
  style: {
    paddingLeft: 13,
  },
};

const simplenamecol = {
  style: {
    paddingLeft: 72,
  },
};

const companyphonecol = {
  style: {
    paddingLeft: 37,
  },
};

const addresscol = {
  style: {
    paddingLeft: 10,
  },
};
const urlcol = {
  style: {
    paddingLeft: 10,
  },
};

const remarkcol = {
  style: {
    paddingLeft: 34,
  },
};

const companycol = {
  style: {
    paddingLeft: 10,
  },
};

const statuscol = {
  style: {
    paddingLeft: 27,
  },
};

const formhz11 = {
  wrapperCol: {
    style: {
      width: '91.66666667%',
    },
  },
  style: {
    width: '105%',
  },
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
class CustomerViewTabs extends PureComponent {
  state = {
    width: '100%',
    projectViewVisible: false,
    contractViewVisible: false,
    visitViewVisible: false,
    rowInfoCurrent: {},
    selectedRows: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }


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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleProjectViewVisible = flag => {
    this.setState({
      projectViewVisible: !!flag,
    });
  };
  handleContractViewVisible = flag => {
    this.setState({
      contractViewVisible: !!flag,
    });
  };
  handleVisitViewVisible = flag => {
    this.setState({
      visitViewVisible: !!flag,
    });
  };

  showProjectViewMessage =(flag, record)=> {
    this.setState({
      projectViewVisible: !!flag,
      rowInfoCurrent: record,
    });
  };
  showContractViewMessage =(flag, record)=> {
    this.setState({
      contractViewVisible: !!flag,
      rowInfoCurrent: record,
    });
  };
  showVisitViewMessage =(flag, record)=> {
    this.setState({
      visitViewVisible: !!flag,
      rowInfoCurrent: record,
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
    const { TabPane } = Tabs;
    const { form, dispatch, submitting, applyTabsViewVisible, handleApplyTabsViewVisible, rowInfo, rule: { data }, loading } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedRows, projectViewVisible, rowInfoCurrent, contractViewVisible, visitViewVisible } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          form.resetFields();
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
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


    const columnsContacts = [
      {
        title: '编码',
        dataIndex: 'code',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'mobilePhone',
      },
      {
        title: '办公电话',
        dataIndex: 'companyPhone',
      },
      {
        title: '地址',
        dataIndex: 'address',
      },
      {
        title: '联系人性质',
        dataIndex: 'contractNature',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
    ];
    const columnsProject = [
      {
        title: '项目编号',
        dataIndex: 'no',
        render: (text, record) => (
          <a className={styles.a} onClick={() =>this.showProjectViewMessage(true, record)}>
            {text}
          </a>
        ),
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        render:(text, record) => (
          <a className={styles.a} onDoubleClick={() => this.showProjectViewMessage(true, record)}>
            {text}
          </a>
        ),
      },
      {
        title: '负责人',
        dataIndex: 'linkman',
      },
      {
        title: '项目状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
          {
            text: status[3],
            value: 3,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '负责公司',
        dataIndex: 'company',
      },
      {
        title: '项目费用',
        dataIndex: 'fee',
      },
      {
        title: '客户名称',
        dataIndex: 'cusName',
      },
      {
        title: '客户联系人',
        dataIndex: 'cusLinkmen',
      },
      {
        title: '执行时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];
    const columnsContract = [
      {
        title: '合同编码',
        dataIndex: 'contractCode',
        render: (text, record) => (
          <a className={styles.a} onClick={() =>this.showContractViewMessage(true, record)}>
            {text}
          </a>
        ),
      },
      {
        title: '合同标题',
        dataIndex: 'contractName',
      },
      {
        title: '对方企业',
        dataIndex: 'partnerEnterprise',
      },
      {
        title: '负责人',
        dataIndex: 'linkman',
      },
      {
        title: '业务类别',
        dataIndex: 'businessType',
      },
      {
        title: '签订时间',
        dataIndex: 'signTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },

      {
        title: '总金额',
        dataIndex: 'totalAmount',
      },
    ];
    const columnsVisit = [
      {
        title: '拜访对象',
        dataIndex: 'visitObject',
        render:(text,record)=>(
          <a onClick={()=>this.showVisitViewMessage(true,record)} >{text}</a>
        ),
      },
      {
        title: '关联商机',
        dataIndex: 'associatedBusiness',
      },
      {
        title: '拜访方式',
        dataIndex: 'visitMode',
      },
      {
        title: '拜访日期',
        dataIndex: 'visitData',
      },
      {
        title: '交流内容',
        dataIndex: 'communicationContent',
      },
      {
        title: '参与人员',
        dataIndex: 'participants',
      }];

    const projectViewMethods = {
      handleProjectViewVisible: this.handleProjectViewVisible,
    };
    const contractViewMethods = {
      handleContractViewVisible: this.handleContractViewVisible,
    };
    const visitViewMethods = {
      handleVisitViewVisible: this.handleVisitViewVisible,
    };
    const columnsProcedure = [
      {
        title: '编号',
        dataIndex: 'no',
      },
      {
        title: '环节名称',
        dataIndex: 'name',
      },
      {
        title: '执行人',
        dataIndex: 'linkman',
      },
      {
        title: '审批意见',
        dataIndex: 'status',
      },
      {
        title: '创建时间',
        dataIndex: 'company',
      },
      {
        title: '完成时间',
        dataIndex: 'fee',
      },
      {
        title: '消耗时间',
        dataIndex: 'fee',
      },
    ];
    return (
      <Modal
        title="客户申请单查看"
        style={{ top: 60 }}
        visible={applyTabsViewVisible}
        width="80%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleApplyTabsViewVisible()}
        footer={null}
      >
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <Icon type="team" />基本信息
              </span>
            }
            key="1"
          >
            <Collapse defaultActiveKey={['1','2','3']}>
              <Panel header="客户申请单基本信息" key="1">
                <div>
                  <Card>
                    <Form layout="inline">
                      <Row className={styles['fn-mb-15']}>
                        <Col>
                          <Form.Item {...formhz11} label={fieldLabels.customerName}>
                            {getFieldDecorator('customerName', {
                              rules: [{ required: true, message: '请输入客户名称' }],
                              initialValue :`${rowInfo.customerName}`,
                            })(<Input disabled placeholder="请输入客户名称" className={styles['ant-input-lg']} />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['row-h']}>
                        <Col span={8}>
                          <Form.Item label={fieldLabels.customerLevel}>
                            {getFieldDecorator('customerLevel', {
                              rules: [{ required: true, message: '请选择客户等级' }],
                            })(
                              <Input disabled placeholder="请选择客户等级" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label={fieldLabels.industry}>
                            {getFieldDecorator('industry', {
                              rules: [{ required: true, message: '请选择行业' }],
                            })(
                              <Input disabled placeholder="请选择行业" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label={fieldLabels.incomeTax}>
                            {getFieldDecorator('incomeTax', {
                              rules: [{ required: true, message: '请选择所得税征收方式' }],
                            })(
                              <Input disabled placeholder="请选择所得税征收方式" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['row-h']}>
                        <Col span={8}>
                          <Form.Item {...cnumcol} label={fieldLabels.customerCode}>
                            {getFieldDecorator('customerCode', {
                              rules: [{ required: false, message: '请输入客户编码' }],
                              initialValue:`${rowInfo.customerCode}`,
                            })(
                              <Input disabled placeholder="请输入客户编码" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...cpinyincol} label={fieldLabels.pinyin}>
                            {getFieldDecorator('pinyin', {
                              rules: [{ required: false, message: '请输入拼音码' }],
                            })(
                              <Input disabled placeholder="请输入拼音码" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...simplenamecol} label={fieldLabels.simpleName}>
                            {getFieldDecorator('simpleName', {
                              rules: [{ required: false, message: '请输入简称' }],
                            })(<Input disabled placeholder="请输入简称" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row className={styles['row-h']}>
                        <Col span={8}>
                          <Form.Item label={fieldLabels.mobilePhone}>
                            {getFieldDecorator('mobilepPhone', {
                              rules: [{ required: true, message: '请输入手机号码' }],
                            })(
                              <Input disabled placeholder="请输入手机号码" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label={fieldLabels.email}>
                            {getFieldDecorator('email', {
                              rules: [{ required: true, message: '请输入电子邮箱' }],
                            })(
                              <Input disabled placeholder="请输入电子邮箱" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...companyphonecol} label={fieldLabels.companyPhone}>
                            {getFieldDecorator('companyPhone', {
                              rules: [{ required: true, message: '请输入公司电话' }],
                            })(
                              <Input disabled placeholder="请输入公司电话" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row className={styles['row-h']}>
                        <Col span={8}>
                          <Form.Item label={fieldLabels.postalCode}>
                            {getFieldDecorator('postalCode', {
                              rules: [{ required: true, message: '请输入邮政编码' }],
                            })(
                              <Input disabled placeholder="请输入邮政编码" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item label={fieldLabels.region}>
                            {getFieldDecorator('region', {
                              rules: [{ required: true, message: '请选择所在区域' }],
                            })(
                              <Cascader
                                disabled
                                options={optionshz}
                                onChange={onChange}
                                placeholder="请选择所在区域"
                                style={{ width: 603 }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['row-h']}>
                        <Col span={8}>
                          <Form.Item {...urlcol} label={fieldLabels.url}>
                            {getFieldDecorator('url', {
                              rules: [{ required: false, message: '请输入网站主页' }],
                            })(
                              <Input disabled placeholder="请输入网站主页" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item {...addresscol} label={fieldLabels.address}>
                            {getFieldDecorator('address', {
                              rules: [{ required: false, message: '请输入详细地址' }],
                            })(
                              <Input disabled placeholder="请输入详细地址" style={{ width: 603 }} />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['row-h']}>
                        <Col span={8}>
                          <Form.Item label={fieldLabels.taxCode}>
                            {getFieldDecorator('taxCode', {
                              rules: [{ required: false, message: '请输入税务登记号' }],
                            })(
                              <Input disabled placeholder="请输入税务登记号" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item {...remarkcol} label={fieldLabels.remark}>
                            {getFieldDecorator('remark', {
                              rules: [{ required: false, message: '请输入备注' }],
                            })(
                              <Input disabled placeholder="请输入备注" style={{ width: 603 }} />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['row-h']}>
                        <Col span={8}>
                          <Form.Item {...statuscol} label={fieldLabels.status}>
                            {getFieldDecorator('status', {
                              rules: [{ required: true, message: '状态' }],
                            })(
                              <Input disabled placeholder="请选择状态" disable style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item {...companycol} label={fieldLabels.company}>
                            {getFieldDecorator('company', {
                              rules: [{ required: true, message: '状态' }],
                            })(
                              <Input disabled placeholder="所属公司" style={{ width: 603 }} />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </div>
              </Panel>
              <Panel header="开票信息" key="2">
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.companyName}>
                      {getFieldDecorator('companyName', {
                        rules: [{ required: true, message: '请输入单位名称' }],
                      })(<Input disabled placeholder="请输入单位名称" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.companyAddress}>
                      {getFieldDecorator('companyAddress', {
                        rules: [{ required: true, message: '请输入单位地址' }],
                      })(<Input disabled placeholder="请输入单位地址" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.taxNumber}>
                      {getFieldDecorator('taxNumber', {
                        rules: [{ required: true, message: '请输入税号' }],
                      })(<Input disabled placeholder="请输入税号" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles['fn-mb-15']}>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.openAccountBank}>
                      {getFieldDecorator('openAccountBank', {
                        rules: [{ required: true, message: '请输入开户银行' }],
                      })(<Input disabled placeholder="请输入开户银行" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label={fieldLabels.bankAccount}>
                      {getFieldDecorator('bankAccount', {
                        rules: [{ required: true, message: '请输入银行账户' }],
                      })(<Input disabled placeholder="请输入银行账户" className={styles['fn-mb-15']} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="客户联系人" key="3">
                <div>
                  <Card bordered={false}>
                    <div className={styles.tableList}>
                      <StandardTable
                        selectedRows={selectedRows}
                        loading={loading}
                        data={data}
                        columns={columnsContacts}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange}
                      />
                    </div>
                  </Card>
                </div>
              </Panel>
            </Collapse>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="api" />流程图
              </span>
            }
            key="2"
          >
            <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={columnsProcedure}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
                <div>
                  <img src={picture} alt="流程图" />
                </div>
              </Card>
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
}))(Form.create()(CustomerViewTabs));
