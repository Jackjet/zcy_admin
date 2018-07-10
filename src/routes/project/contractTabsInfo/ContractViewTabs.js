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
} from 'antd';
import { connect } from 'dva';
import moment from "moment/moment";
import StandardTable from '../../../components/StandardTable';
import ProcedureList from '../projectTabsInfo/ProcedureProject.js';
import ReceiptPlanAddModal from '../add/ReceiptPlanAddModal';
import ReceiptPlanEditModal from '../edit/ReceiptPlanEditModal';
import ReceiptPlanViewModal from '../select/ReceiptPlanViewModal';
import styles from './style.less';


const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const remarkcol = {
  wrapperCol: {
    style: {
      width: '91.66666667%',
    },
  },
  style: {
    width: '98.66666667%',
  },
};
const formhz13 = {
  labelCol: {
    style: {
      marginBottom: 17,
    },
  },
  wrapperCol: {
    style: {
      width: '92%',
    },
  },
  style: {
    width: '96.66666667%',
  },
};
const formhz12 = {
  wrapperCol: {
    style: {
      width: '92%',
    },
  },
  style: {
    width: '96.66666667%',
  },
};
const formhz11 = {
  wrapperCol: {
    style: {
      width: '60%',
    },
  },
  style: {
    width: '96.66666667%',
  },
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
    const { selectedRows, receiptPlanAddVisible, receiptPlanEditVisible, receiptPlanViewVisible, rowInfoCurrent } = this.state;
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
      projectStatus: '项目状态',
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
      totalAmount: '总金额',
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
        style={{ top: 60 }}
        visible={contractTabsVisible}
        width="80%"
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
                <Form layout="inline">
                  <Row className={styles['row-h']}>
                    <Col span={8}>
                      <Form.Item {...formhz11} label={fieldLabels.contractCode}>
                        {getFieldDecorator('contractCode', {
                          rules: [{required: true, message: '不重复的数字'}],
                          initialValue: `${rowInfo.contractCode}`,
                        })(<Input disabled placeholder="请输入合同编码" />)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item {...formhz11} label={fieldLabels.contractType}>
                        {getFieldDecorator('contractType', {
                          rules: [{ required: true, message: '请选择合同类别' }],
                        })(
                          <Select disabled placeholder="请选择合同类别" style={{ width: 200 }}>
                            <Option value="0">请选择</Option>
                            <Option value="g">工程造价业务项目</Option>
                            <Option value="y">咨询报告</Option>
                            <Option value="q">招标</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item {...formhz11} label={fieldLabels.years}>
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
                  </Row>

                  <Row className={styles['row-h']}>
                    <Col span={8}>
                      <Form.Item {...formhz11} label={fieldLabels.projectName}>
                        {getFieldDecorator('projectName', {
                          rules: [{ required: true, message: '请输入项目名称' }],
                        })(
                          <Select disabled placeholder="请输入项目名称" style={{ width: 200 }}>
                            <Option value="c">项目A</Option>
                            <Option value="h">项目B</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8} offset={8}>
                      <Form.Item {...formhz11} label={fieldLabels.projectStatus}>
                        {getFieldDecorator('projectStatus', {
                          rules: [{ required: true, message: '请选择项目状态' }],
                        })(
                          <Select disabled placeholder="请选择项目状态" style={{ width: 200 }}>
                            <Option value="c">审批中</Option>
                            <Option value="h">已审批</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={styles['row-h']}>
                    <Col>
                      <Form.Item {...formhz12} label={fieldLabels.contractTitle}>
                        {getFieldDecorator('contractTitle', {
                          rules: [{ required: true, message: '请输入合同标题' }],
                        })(<Input disabled placeholder="请输入合同标题" />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={styles['row-h']}>
                    <Col span={8}>
                      <Form.Item {...formhz11} label={fieldLabels.dfCompany}>
                        {getFieldDecorator('dfCompany', {
                          rules: [{ required: false, message: '对方公司' }],
                        })(
                          <Select disabled placeholder="对方公司" style={{ width: 200 }}>
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
                      <Form.Item {...formhz11} label={fieldLabels.authorizedAgent}>
                        {getFieldDecorator('authorizedAgent', {
                          rules: [{ required: false, message: '客户授权代理人' }],
                        })(
                          <Select disabled placeholder="请选择客户授权代理人" style={{ width: 200 }}>
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

                  <Row className={styles['row-h']}>
                    <Col span={8}>
                      <Form.Item {...formhz11} label={fieldLabels.PartyAcompany}>
                        {getFieldDecorator('PartyAcompany', {
                          rules: [{ required: false, message: '请输入甲方公司' }],
                        })(
                          <Select disabled placeholder="请输入甲方公司" style={{ width: 200 }}>
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
                      <Form.Item {...formhz11} label={fieldLabels.PartyBcompany}>
                        {getFieldDecorator('PartyBcompany', {
                          rules: [{ required: false, message: '请输入乙方公司' }],
                        })(
                          <Select disabled placeholder="请输入乙方公司" style={{ width: 200 }}>
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

                  <Row className={styles['row-h']}>
                    <Col span={8}>
                      <Form.Item {...formhz11} label={fieldLabels.fatherContract}>
                        {getFieldDecorator('fatherContract', {
                          rules: [{ required: false, message: '请输入父合同' }],
                        })(
                          <Select disabled placeholder="请输入父合同" style={{ width: 200 }}>
                            <Option value="xiao">请选择</Option>
                            <Option value="z">合同A</Option>
                            <Option value="f">合同B</Option>
                            <Option value="fd">合同C</Option>
                            <Option value="sn">合同D</Option>
                            <Option value="zf">合同G</Option>
                            <Option value="sy">合同H</Option>
                            <Option value="jr">合同I</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item {...formhz11} label={fieldLabels.signDate}>
                        {getFieldDecorator('signDate', {
                          rules: [{ required: false, message: '请输入签订时间' }],
                        })(
                          <Select disabled placeholder="请输入签订时间" style={{ width: 200 }}>
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
                      <Form.Item {...formhz11} label={fieldLabels.paymentMethod}>
                        {getFieldDecorator('paymentMethod', {
                          rules: [{ required: false, message: '请输入付款方式' }],
                        })(
                          <Select disabled placeholder="请输入付款方式" style={{ width: 200 }}>
                            <Option value="xiao">请选择</Option>
                            <Option value="z">支付宝</Option>
                            <Option value="f">微信</Option>
                            <Option value="fd">银行卡</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col>
                      <Form.Item {...formhz13} label={fieldLabels.businessType}>
                        {getFieldDecorator('businessType')(
                          <Checkbox.Group disabled style={{ width: '100%' }}>
                            <Row>
                              <Col span={6}>
                                <Checkbox value="A">预算编制</Checkbox>
                              </Col>
                              <Col span={6}>
                                <Checkbox value="B">结算编制</Checkbox>
                              </Col>
                              <Col span={6}>
                                <Checkbox value="C">建设工程招标代理</Checkbox>
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
                                <Checkbox value="G">政府采购招标代理</Checkbox>
                              </Col>
                              <Col span={6}>
                                <Checkbox value="H">咨询报告</Checkbox>
                              </Col>
                            </Row>
                          </Checkbox.Group>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col>
                      <Form.Item {...formhz12} label={fieldLabels.contractSignPlace}>
                        {getFieldDecorator('contractSignPlace')(
                          <Input disabled placeholder="请输入合同签订地点" />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={styles['fn-mb-15']}>
                    <Col>
                      <Form.Item {...formhz12} label={fieldLabels.contractSubject}>
                        {getFieldDecorator('contractSubject')(<Input disabled placeholder="请输入合同标的" />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles['row-h']}>
                    <Col md={16} sm={24}>
                      <Form.Item label="项目日期">
                        {getFieldDecorator('date', {
                          rules: [{ required: false, message: '请选择日期' }],
                        })(
                          <RangePicker disabled placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={styles['row-h']}>
                    <Col span={12}>
                      <Form.Item label={fieldLabels.totalAmount}>
                        {getFieldDecorator('totalAmount', {
                          rules: [{ required: true, message: '请输入总金额' }],
                        })(<Input disabled placeholder="请输入合同标题" style={{ width: 200 }} />)}
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label={fieldLabels.fzperson}>
                        {getFieldDecorator('fzperson', {
                          rules: [{ required: true, message: '请选择负责人' }],
                        })(
                          <Select disabled placeholder="请选择负责人" style={{ width: 200 }}>
                            <Option value="c">公司员工1</Option>
                            <Option value="h">公司员工2</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={styles['fn-mb-15']}>
                    <Col>
                      <Form.Item {...remarkcol} label={fieldLabels.remark}>
                        {getFieldDecorator('remark')(<TextArea disabled placeholder="请输入备注信息" rows={4} />)}
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
