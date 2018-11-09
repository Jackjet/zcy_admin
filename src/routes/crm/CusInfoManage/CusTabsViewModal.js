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
  Popover,
  Cascader,
  Collapse,
  Badge,
} from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable';
import VisitListViewModal from '../VisitManage/VisitListViewModal.js';
import Salesman from './Salesman.js';
import ProjectInfo from '../../Project/select/ProjectInfo';
import ContractViewInfo from '../../Project/select/ContractInfo';
import styles from './style.less';

const industry =['制造业','服务业','房地产建筑','三农业务','政府购买','商业','非营利组织','其他'];
const statusMap = ['default', 'processing', 'success', 'error'];
const cusStatus = ['启用', '禁用'];

const { TextArea } = Input;
const { Panel } = Collapse;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const fieldLabels = {
  cusCode: '客户编码',
  cusLevel: '客户等级',
  industry: '所属行业',
  cusName: '客户名称',
  dateRange: '生效日期',
  simpleName: '简称',
  pinyin: ' 拼 音 码 ',
  url: '网站主页',
  taxCode: '税务登记号',
  cusMobilePhone: '移动手机',
  email: '电子邮箱',
  cusCompanyPhone: '公司电话',
  postalCode: '邮政编码',
  region: '所在区域',
  incomeTax: '所得税征收方式',
  cusCompany: '所属公司',
  address: '详细地址',
  remark: '备注',
  cusStatus: '状态',
  cusCompanyName:'单位名称',
  cusCompanyAddress:'单位地址',
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
    const { form, dispatch, submitting, tabsViewVisible, handleTabsViewVisible, rowInfo, rule: { data }, loading } = this.props;
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
    const cancelDate = () => {
      form.resetFields();
      handleTabsViewVisible(false);
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
    return (
      <Modal
        title="客户基本信息查看"
        style={{ top: 20 }}
        visible={tabsViewVisible}
        width="80%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
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
              <Panel header="客户基本信息" key="1">
                <div>
                  <Card>
                    <Form layout="horizontal">
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusName}>
                            {getFieldDecorator('cusName', {
                              rules: [{ required: true, message: '请输入客户名称' }],
                              initialValue :`${rowInfo.cusName}`,
                            })(<Input readOnly placeholder="请输入客户名称" />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.industry}>
                            {getFieldDecorator('industry', {
                              rules: [{ required: true, message: '请选择行业' }],
                              initialValue :`${industry[rowInfo.industry]}`,
                            })(
                              <Input readOnly placeholder="请选择行业" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusCompany}>
                            {getFieldDecorator('cusCompany', {
                              rules: [{ required: true, message: '所属公司' }],
                              initialValue :`${rowInfo.cusCompany}`,
                            })(
                              <Input readOnly placeholder="所属公司" />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.incomeTax}>
                            {getFieldDecorator('incomeTax', {
                              rules: [{ required: false, message: '请选择所得税征收方式' }],
                            })(
                              <Input readOnly placeholder="请选择所得税征收方式" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.taxCode}>
                            {getFieldDecorator('taxCode', {
                              rules: [{ required: false, message: '请输入税务登记号' }],
                            })(
                              <Input readOnly placeholder="请输入税务登记号" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusStatus}>
                            {getFieldDecorator('cusStatus', {
                              rules: [{ required: true, message: '状态' }],
                              initialValue :`${cusStatus[rowInfo.cusStatus]}`,
                            })(
                              <Input readOnly placeholder="请选择状态" />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusCode}>
                            {getFieldDecorator('cusCode', {
                              rules: [{ required: false, message: '请输入客户编码' }],
                              initialValue:`${rowInfo.cusCode}`,
                            })(
                              <Input readOnly placeholder="请输入客户编码" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.pinyin}>
                            {getFieldDecorator('pinyin', {
                              rules: [{ required: false, message: '请输入拼音码' }],
                            })(
                              <Input readOnly placeholder="请输入拼音码" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.simpleName}>
                            {getFieldDecorator('simpleName', {
                              rules: [{ required: false, message: '请输入简称' }],
                            })(<Input readOnly placeholder="请输入简称" />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusMobilePhone}>
                            {getFieldDecorator('cusMobilePhone', {
                              rules: [{ required: true, message: '请输入手机号码' }],
                              initialValue :`${rowInfo.cusMobilePhone}`,
                            })(
                              <Input readOnly placeholder="请输入手机号码" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.email}>
                            {getFieldDecorator('email', {
                              rules: [{ required: false, message: '请输入电子邮箱' }],
                            })(
                              <Input readOnly placeholder="请输入电子邮箱" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.cusCompanyPhone}>
                            {getFieldDecorator('cusCompanyPhone', {
                              rules: [{ required: false, message: '请输入公司电话' }],
                            })(
                              <Input readOnly placeholder="请输入公司电话" />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.postalCode}>
                            {getFieldDecorator('postalCode', {
                              rules: [{ required: false, message: '请输入邮政编码' }],
                            })(
                              <Input readOnly placeholder="请输入邮政编码" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item {...formItemLayout} label={fieldLabels.region}>
                            {getFieldDecorator('region', {
                              rules: [{ required: true, message: '请选择所在区域' }],
                            })(
                              <Cascader
                                readOnly
                                options={optionshz}
                                placeholder="请选择所在区域"
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label={fieldLabels.url}>
                            {getFieldDecorator('url', {
                              rules: [{ required: false, message: '请输入网站主页' }],
                            })(
                              <Input readOnly placeholder="请输入网站主页" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item {...formItemLayout} label={fieldLabels.address}>
                            {getFieldDecorator('address', {
                              rules: [{ required: false, message: '请输入详细地址' }],
                            })(
                              <Input readOnly placeholder="请输入详细地址" />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={23} pull={5}>
                          <Form.Item {...formItemLayout} label={fieldLabels.remark}>
                            {getFieldDecorator('remark', {
                              rules: [{ required: false, message: '请输入备注' }],
                            })(
                              <TextArea readOnly placeholder="请输入备注" />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </div>
              </Panel>
              <Panel header="开票信息" key="2">
                <Card>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.cusCompanyName}>
                        {getFieldDecorator('cusCompanyName', {
                          rules: [{ required: false, message: '请输入单位名称' }],
                        })(<Input readOnly placeholder="请输入单位名称" className={styles['fn-mb-15']} />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.cusCompanyAddress}>
                        {getFieldDecorator('cusCompanyAddress', {
                          rules: [{ required: false, message: '请输入单位地址' }],
                        })(<Input readOnly placeholder="请输入单位地址" className={styles['fn-mb-15']} />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.taxNumber}>
                        {getFieldDecorator('taxNumber', {
                          rules: [{ required: false, message: '请输入税号' }],
                        })(<Input readOnly placeholder="请输入税号" className={styles['fn-mb-15']} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.openAccountBank}>
                        {getFieldDecorator('openAccountBank', {
                          rules: [{ required: false, message: '请输入开户银行' }],
                        })(<Input readOnly placeholder="请输入开户银行" className={styles['fn-mb-15']} />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.bankAccount}>
                        {getFieldDecorator('bankAccount', {
                          rules: [{ required: false, message: '请输入银行账户' }],
                        })(<Input readOnly placeholder="请输入银行账户" className={styles['fn-mb-15']} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Panel>
              <Panel header="客户联系人" key="3">
                <div>
                  <Card>
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
                <Icon type="api" />所属业务员
              </span>
            }
            key="2"
          >
            <Salesman />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="switcher" />所属项目
              </span>
            }
            key="3"
          >
            <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={columnsProject}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
                <ProjectInfo {...projectViewMethods} projectViewVisible={projectViewVisible} rowInfoCurrent={rowInfoCurrent} />
              </Card>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="line-chart" />所属合同
              </span>
            }
            key="4"
          >
            <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={columnsContract}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </Card>
              <ContractViewInfo {...contractViewMethods} contractViewVisible={contractViewVisible} rowInfoCurrent={rowInfoCurrent} />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="eye" />客户拜访信息
              </span>
            }
            key="5"
          >
            <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <div className={styles.tableListOperator}>
                    <StandardTable
                      selectedRows={selectedRows}
                      loading={loading}
                      data={data}
                      columns={columnsVisit}
                      onSelectRow={this.handleSelectRows}
                      onChange={this.handleStandardTableChange}
                    />
                  </div>
                </div>
              </Card>
              <VisitListViewModal {...visitViewMethods} visitViewVisible={visitViewVisible} rowInfo={rowInfoCurrent} />
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
