import React, { PureComponent, Fragment } from 'react';
import {
  Tabs,
  Icon,
  Form,
  Modal,
  Card,
  Select,
  message,
  Row,
  Col,
  Input,
  Checkbox,
  DatePicker,
  Popover,
  Divider,
  Button,
  Badge,
  Upload,
} from 'antd';
import { connect } from 'dva';
import moment from "moment/moment";
import StandardTable from '../../components/StandardTable/index';
import ProcedureList from './ProcedureProject.js';
import ReceiptPlanAddModal from '../project/add/ReceiptPlanAddModal';
import ReceiptPlanEditModal from '../project/edit/ReceiptPlanEditModal';
import ReceiptPlanViewModal from '../project/select/ReceiptPlanViewModal';
import styles from '../project/contractTabsInfo/style.less';


const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { RangePicker } = DatePicker;
const { TextArea } = Input;
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
const ContractTypeOption = ["工程造价业务项目","咨询报告","招标"];
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

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class ContractViewTabs extends PureComponent {
  state = {
    width: '100%',
    receiptPlanAddVisible: false,
    receiptPlanEditVisible: false,
    receiptPlanViewVisible: false,
    rowInfoCurrent:{},
    choiceCheckBox:'',
    contractOptionData:[],
    selectedRows: {},
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

  handleDeleteClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'rule/remove',
      payload: {
        no: selectedRows.map(row => row.no).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleChoiceContractType = () =>{
    const optionData = ContractTypeOption.map((data, index) => {
      const value = `${data}`;
      return <Option value={value}>{value}</Option>;
    });
    this.setState({
      contractOptionData: optionData,
    });
  };

  handleGetOptionValue=(value)=>{
    this.setState({
      choiceCheckBox:`${value}`,
    });
  };

  handleReceiptPlanAddVisible = flag => {
    this.setState({
      receiptPlanAddVisible: !!flag,
    });
  };
  handleReceiptPlanEditVisible = flag => {
    this.setState({
      receiptPlanEditVisible: !!flag,
    });
  };
  handleReceiptPlanViewVisible = flag => {
    this.setState({
      receiptPlanViewVisible: !!flag,
    });
  };

  showEditMessage =(flag, record)=> {
    this.setState({
      receiptPlanEditVisible: !!flag,
      rowInfoCurrent: record,
    });
  };

  showViewMessage =(flag, record)=> {
    this.setState({
      receiptPlanViewVisible: !!flag,
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
    const { form, dispatch, submitting, contractTabsVisible, handleContractTabsVisible, rowInfo, rule: { data }, loading } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedRows, receiptPlanAddVisible, receiptPlanEditVisible, receiptPlanViewVisible, rowInfoCurrent, choiceCheckBox, contractOptionData } = this.state;
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
          handleContractTabsVisible(false);
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

    const receiptPlanAddMethods = {
      handleReceiptPlanAddVisible: this.handleReceiptPlanAddVisible,
    };

    const receiptPlanEditMethods = {
      handleReceiptPlanEditVisible: this.handleReceiptPlanEditVisible,
    };

    const receiptPlanViewMethods = {
      handleReceiptPlanViewVisible: this.handleReceiptPlanViewVisible,
    };


    const fieldLabels = {
      contractCode: '合同编码',
      contractType: '合同类别',
      years: '年度',
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
      fzperson: '项目负责人',
      remark: '备注',
    };
    const columnsProject = [
      {
        title: '项目编号',
        dataIndex: 'no',
        render: text => (
          <a className={styles.a} onClick={() => this.handleCheckVisible(true)}>
            {text}
          </a>
        ),
      },
      {
        title: '项目名称',
        dataIndex: 'name',
        render: text => (
          <a className={styles.a} onDoubleClick={() => this.handleCheckVisible(true)}>
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
        dataIndex: 'cusname',
      },
      {
        title: '客户联系人',
        dataIndex: 'cuslinkmen',
      },
      {
        title: '执行时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];
    const columnsReceiptPlan = [
      {
        title: '收款阶段名称',
        dataIndex: 'no',
      },
      {
        title: '收款比例',
        dataIndex: 'name',
      },
      {
        title: '收款金额（元）',
        dataIndex: 'linkman',
      },
      {
        title: '收款时间',
        dataIndex: 'status',
      },
      {
        title: '收款的条件说明',
        dataIndex: 'company',
      },
      {
        title: '状态',
        dataIndex: 'fee',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() =>this.showViewMessage(true, record)} >查看</a>
            <Divider type="vertical" />
            <a onClick={() =>this.showEditMessage(true, record)} >编辑</a>
            <Divider type="vertical" />
            <a onClick={this.handleDeleteClick} >删除</a>
          </Fragment>
        ),
      },
    ];
    const columnsReceiptInfo = [
      {
        title: '合同标题',
        dataIndex: 'no',
      },
      {
        title: '开票金额（元）',
        dataIndex: 'name',
      },
      {
        title: '收款金额（元）',
        dataIndex: 'linkman',
      },
      {
        title: '收款时间',
        dataIndex: 'status',
      },
      {
        title: '收款类型',
        dataIndex: 'company',
      },
      {
        title: '承办人',
        dataIndex: 'fee',
      },
      {
        title: '备注',
        dataIndex: 'fee',
      },
    ];
    const columnsInvoiceInfo = [
      {
        title: '发票号',
        dataIndex: 'no',
      },
      {
        title: '合同编号',
        dataIndex: 'name',
      },
      {
        title: '发票金额（元）',
        dataIndex: 'linkman',
      },
      {
        title: '开票时间',
        dataIndex: 'status',
      },
      {
        title: '状态',
        dataIndex: 'company',
      },
      {
        title: '开票人',
        dataIndex: 'fee',
      },
      {
        title: '备注',
        dataIndex: 'fee',
      },
    ];

    return (

      <Modal
        title="(协议)合同基本信息查看"
        style={{ top: 20 }}
        visible={contractTabsVisible}
        width="75%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleContractTabsVisible()}
        footer={null}
      >
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <Icon type="copy" />基本信息
              </span>
            }
            key="1"
          >
            <div>
              <Card>
                <Form layout="horizontal">
                  <Row className={styles['fn-mb-15']}>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.contractCode}>
                        {getFieldDecorator('contractCode', {
                          rules: [{ required: true, message: '不重复的数字' }],
                          initialValue:`${rowInfo.contractCode}`,
                        })(
                          <Input disabled placeholder="自动生成" />
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.contractType}>
                        {getFieldDecorator('contractType', {
                          rules: [{ required: true, message: '请选择合同类别' }],
                        })(
                          <Select disabled onChange={this.handleGetOptionValue} onMouseEnter={this.handleChoiceContractType} placeholder="请选择合同类别" >
                            {contractOptionData}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.years}>
                        {getFieldDecorator('years', {
                          rules: [{ required: true, message: '请选择年度' }],
                        })(
                          <Select disabled placeholder="请选择年度" >
                            <Option key="z">2018</Option>
                            <Option key="f">2019</Option>
                            <Option key="fd">2020</Option>
                            <Option key="sn">2021</Option>
                            <Option key="zf">2022</Option>
                            <Option key="sy">2023</Option>
                            <Option key="jr">2024</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={styles['fn-mb-15']}>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.contractTitle}>
                        {getFieldDecorator('contractTitle', {
                          rules: [{ required: true, message: '请输入合同标题' }],
                        })(
                          <Input disabled placeholder="请输入合同标题" />
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.projectName}>
                        {getFieldDecorator('projectName', {
                          rules: [{ required: true, message: '请输入项目名称' }],
                        })(
                          <Select disabled placeholder="请输入项目名称" >
                            <Option key="c">项目A</Option>
                            <Option key="h">项目B</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8} >
                      <Form.Item {...formItemLayout} label={fieldLabels.contractStatus}>
                        {getFieldDecorator('contractStatus', {
                          rules: [{ required: true, message: '请选择合同性质' }],
                        })(
                          <Select disabled placeholder="请选择合同性质" >
                            <Option key="c">工程</Option>
                            <Option key="h">建设</Option>
                            <Option key="h">其它</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>


                  <Row className={styles['fn-mb-15']}>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.dfCompany}>
                        {getFieldDecorator('dfCompany', {
                          rules: [{ required: false, message: '对方公司' }],
                        })(
                          <Select disabled placeholder="对方公司" >
                            <Option key="xiao">请选择</Option>
                            <Option key="z">公司A</Option>
                            <Option key="f">公司B</Option>
                            <Option key="fd">公司C</Option>
                            <Option key="sn">公司D</Option>
                            <Option key="zf">公司E</Option>
                            <Option key="sy">公司F</Option>
                            <Option key="jr">公司H</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.authorizedAgent}>
                        {getFieldDecorator('authorizedAgent', {
                          rules: [{ required: false, message: '客户授权代理人' }],
                        })(
                          <Select disabled placeholder="请选择客户授权代理人" >
                            <Option key="xiao">请选择</Option>
                            <Option key="z">公司A</Option>
                            <Option key="f">公司B</Option>
                            <Option key="fd">公司C</Option>
                            <Option key="sn">公司D</Option>
                            <Option key="zf">公司E</Option>
                            <Option key="sy">公司F</Option>
                            <Option key="jr">公司H</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={23} pull={5}>
                      <Form.Item {...formItemLayout} label={fieldLabels.businessType}>
                        {getFieldDecorator('businessType')(
                          <Checkbox.Group disabled style={{ width: '100%' }}>
                            <Row>
                              { ( choiceCheckBox === `工程造价业务项目`|| choiceCheckBox===`咨询报告` ) && (
                                <span>
                                  <Col span={6}>
                                    <Checkbox value="A">预算编制</Checkbox>
                                  </Col>
                                  <Col span={6}>
                                    <Checkbox value="B">结算编制</Checkbox>
                                  </Col>
                                  <Col span={6}>
                                    <Checkbox value="D">咨询审核</Checkbox>
                                  </Col>
                                  <Col span={6}>
                                    <Checkbox value="E">预算审核</Checkbox>
                                  </Col>
                                  <Col span={6}>
                                    <Checkbox value="F">结算审核</Checkbox>
                                  </Col>
                                  <Col span={6}>
                                    <Checkbox value="H">咨询报告</Checkbox>
                                  </Col>
                                </span>
                              )}
                              { ( choiceCheckBox === `招标`|| choiceCheckBox===`咨询报告` ) && (
                                <span>
                                  <Col span={6}>
                                    <Checkbox value="G">政府采购招标代理</Checkbox>
                                  </Col>
                                  <Col span={6}>
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
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.totalAmount}>
                        {getFieldDecorator('totalAmount', {
                          rules: [{ required: true, message: '请输入总金额' }],
                        })(<Input disabled placeholder="请输入合同标题" />)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.fzperson}>
                        {getFieldDecorator('fzperson', {
                          rules: [{ required: true, message: '请选择负责人' }],
                        })(
                          <Select disabled placeholder="请选择负责人" >
                            <Option key="c">公司员工1</Option>
                            <Option key="h">公司员工2</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={styles['fn-mb-15']}>
                    <Col span={23} offset={2}>
                      <Form.Item {...formItemLayout} label={fieldLabels.attachment}>
                        {getFieldDecorator('  attachment ', {
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
                    <Col span={23} pull={5}>
                      <Form.Item {...formItemLayout} label={fieldLabels.remark}>
                        {getFieldDecorator('remark')(
                          <TextArea disable placeholder="请输入备注信息" rows={4}  style={{width:'170%'}} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="copy" />流程图
              </span>
            }
            key="6"
          >
            <ProcedureList />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="api" />所含项目
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
                    columns={columnsProject}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </Card>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="team" />收款计划
              </span>
            }
            key="3"
          >
            <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <div className={styles.tableListOperator}>
                    <Button icon="plus" type="primary" onClick={() => this.handleReceiptPlanAddVisible(true)}>
                      新建
                    </Button>
                  </div>
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={columnsReceiptPlan}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </Card>
              <ReceiptPlanAddModal {...receiptPlanAddMethods} receiptPlanAddVisible={receiptPlanAddVisible} />
              <ReceiptPlanEditModal {...receiptPlanEditMethods} receiptPlanEditVisible={receiptPlanEditVisible} rowInfoCurrent={rowInfoCurrent} />
              <ReceiptPlanViewModal {...receiptPlanViewMethods} receiptPlanViewVisible={receiptPlanViewVisible} rowInfoCurrent={rowInfoCurrent} />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="switcher" />收款信息
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
                    columns={columnsReceiptInfo}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </Card>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="line-chart" />发票信息
              </span>
            }
            key="5"
          >
            <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={columnsInvoiceInfo}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
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
}))(Form.create()(ContractViewTabs));
