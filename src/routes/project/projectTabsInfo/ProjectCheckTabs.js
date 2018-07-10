import React, { PureComponent, Fragment } from 'react';
import {
  Tabs,
  Icon,
  Form,
  Card,
  message,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Modal,
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';
import moment from "moment/moment";
import StandardTable from 'components/StandardTable';
import ProcedureList from './ProcedureProject.js';
import ProjectMemberList from './ProjectMemberList.js';
import ReportAddModal from '../add/ReportAddModal';
import ReportEditModal from '../edit/ReportEditModal';
import ReportViewModal from '../select/ReportViewModal';

import styles from '../list/Style.less';


const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const cnumcol = {
  style: {
    paddingLeft: 10,
  },
};
const yearscol = {
  style: {
    paddingLeft: 36,
  },
};
const customercol = {
  style: {
    paddingLeft: 36,
  },
};
const feecol = {
  style: {
    paddingLeft: 13,
  },
};
const addresscol = {
  style: {
    paddingLeft: 10,
  },
};
const enddatecol = {
  style: {
    paddingLeft: 23,
  },
};
const startdatecol = {
  style: {
    paddingLeft: 10,
  },
};
const remarkcol = {
  wrapperCol: {
    style: {
      width: '91.66666667%',
    },
  },
  style: {
    width: '98.66666667%',
    paddingLeft: 24,
  },
};
const demandcol = {
  wrapperCol: {
    style: {
      width: '69%',
    },
  },
  style: {
    width: '90%',
    paddingLeft: 20,
  },
};
const jfwcol = {
  wrapperCol: {
    style: {
      width: '78%',
    },
  },
  style: {
    width: '91%',
    paddingLeft: 12,
  },
};
const companycol = {
  style: {
    paddingLeft: 10,
  },
};
const statuscol = {
  style: {
    paddingLeft: 35,
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
      width: '90.2%',
    },
  },
  style: {
    width: '96.66666667%',
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
class ProjectCheckTabs extends PureComponent {
  state = {
    width: '100%',
    reportAddVisible: false,
    reportEditVisible: false,
    reportViewVisible: false,
    rowInfoCurrent: {},
    selectedRows:{},
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleReportAddVisible = flag => {
    this.setState({
      reportAddVisible: !!flag,
    });
  };
  handleReportEditVisible = flag => {
    this.setState({
      reportEditVisible: !!flag,
    });
  };
  handleReportViewVisible = flag => {
    this.setState({
      reportViewVisible: !!flag,
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

  showEditMessage =(flag, record)=> {
    this.setState({
      reportEditVisible: !!flag,
      rowInfoCurrent: record,
    });
  };

  showViewMessage =(flag, record)=> {
    this.setState({
      reportViewVisible: !!flag,
      rowInfoCurrent: record,
    });
  };

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

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { TabPane } = Tabs;
    const {
      form,
      dispatch,
      submitting,
      projectTabsVisible,
      handleProjectTabsVisible,
      rowInfo,
      rule: { data },
      loading,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
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
          handleProjectTabsVisible(false);
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
    const { selectedRows, reportAddVisible ,reportEditVisible, reportViewVisible, rowInfoCurrent } = this.state;
    const fieldLabels = {
      number: '项目编码',
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
    };
    const columnsProject = [
      {
        title: '合同编码',
        dataIndex: 'contractCode',
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
        title: '总金额',
        dataIndex: 'totalAmount',
      },

      {
        title: '审批状态',
        dataIndex: 'totalAmount',
      },
    ];
    const columnsPlan = [
      {
        title: '阶段',
        dataIndex: 'dictID',
      },
      {
        title: '计划开始时间',
        dataIndex: 'code',
      },
      {
        title: '计划结束时间',
        dataIndex: 'dictTypeName',
      },
      {
        title: '实际完成时间',
        dataIndex: 'dictTypeName',
      },
      {
        title: '备注',
        dataIndex: 'dictTypeName',
      },
      {
        title: '操作',
        dataIndex: 'dictTypeName',
      },
    ];
    const columnsWorkDiary = [
      {
        title: '项目编码',
        dataIndex: 'dictID',
      },
      {
        title: '项目名称',
        dataIndex: 'code',
      },
      {
        title: '工作步骤',
        dataIndex: 'dictTypeName',
      },
      {
        title: '日志内容',
        dataIndex: 'remarks',
      },
      {
        title: '工作日期',
        dataIndex: 'remarks',
      },
      {
        title: '市场',
        dataIndex: 'remarks',
      },
      {
        title: '记录人',
        dataIndex: 'remarks',
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a href="">查看</a>
            <Divider type="vertical" />
            <a href="">编辑</a>
            <Divider type="vertical" />
            <a href="">删除</a>
          </Fragment>
        ),
      },
    ];
    const columnsReport = [
      {
        title: '报告编号',
        dataIndex: 'no',
        render: (text,record) => (
          <a onClick={() =>this.showViewMessage(true, record)} >{text}</a>
        ),
      },
      {
        title: '报告性质',
        dataIndex: 'name',
      },
      {
        title: '报告类别',
        dataIndex: 'linkman',
      },
      {
        title: '名称',
        dataIndex: 'status',
      },
      {
        title: '文件类型',
        dataIndex: 'company',
      },
      {
        title: '出具时间',
        dataIndex: 'fee',
      },
      {
        title: '备注',
        dataIndex: 'cusname',
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
            <Divider type="vertical" />
          </Fragment>
        ),
      },
    ];

    const reportAddMethods = {
      handleReportAddVisible: this.handleReportAddVisible,
    };
    const reportEditMethods = {
      handleReportEditVisible: this.handleReportEditVisible,
    };
    const reportViewMethods = {
      handleReportViewVisible: this.handleReportViewVisible,
  };

    return (
      <Modal
        title="项目基本信息查看"
        style={{ top: 20 }}
        visible={projectTabsVisible}
        width="90%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleProjectTabsVisible()}
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
                  <Row className={styles['fn-mb-15']}>
                    <Col>
                      <Form.Item {...formhz11} label={fieldLabels.name}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入项目名称' }],
                          initialValue:`${rowInfo.name}`,
                        })(<Input disabled placeholder="请输入项目名称" className={styles['ant-input-lg']} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['row-h']}>
                    <Col span={8}>
                      <Form.Item label={fieldLabels.type}>
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
                      <Form.Item {...yearscol} label={fieldLabels.years}>
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
                      <Form.Item {...statuscol} label={fieldLabels.status}>
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
                  <Row className={styles['row-h']}>
                    <Col span={8}>
                      <Form.Item {...cnumcol} label={fieldLabels.number}>
                        {getFieldDecorator('number', {
                          rules: [{ required: false, message: '请输入项目编码' }],
                        })(<Input disabled placeholder="请输入项目编码" style={{ width: 200 }} />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...customercol} label={fieldLabels.customer}>
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
                      <Form.Item label={fieldLabels.cuslink}>
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

                  <Row className={styles['row-h']}>
                    <Col span={8}>
                      <Form.Item label={fieldLabels.fzcompany}>
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
                      <Form.Item label={fieldLabels.fzperson}>
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
                      <Form.Item {...feecol} label={fieldLabels.fee}>
                        {getFieldDecorator('fee', {
                          rules: [{ required: true, message: '请输入项目费用' }],
                        })(<Input disabled placeholder="请输入项目费用" style={{ width: 200 }} />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={styles['row-h']}>
                    <Col span={8}>
                      <Form.Item {...startdatecol} label={fieldLabels.startdate}>
                        {getFieldDecorator('startdate')(
                          <DatePicker disabled style={{ width: 200 }} placeholder="请输入开始日期" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...enddatecol} label={fieldLabels.enddate}>
                        {getFieldDecorator('enddate')(
                          <DatePicker disabled style={{ width: 200 }} placeholder="请输入结束日期" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8} />
                  </Row>

                  <Row className={styles['fn-mb-15']}>
                    <Col>
                      <Form.Item {...formhz11} label={fieldLabels.biztype}>
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
                    <Col>
                      <Form.Item {...formhz12} label={fieldLabels.content}>
                        {getFieldDecorator('content')(<TextArea disabled placeholder="请输入项目内容" rows={4} />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={styles['row-h']}>
                    <Col span={12}>
                      <Form.Item {...jfwcol} label={fieldLabels.jfw}>
                        {getFieldDecorator('jfw')(
                          <TextArea disabled placeholder="请输入项目结束时的交付物" rows={4} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...demandcol} label={fieldLabels.demand}>
                        {getFieldDecorator('demand')(<TextArea disabled placeholder="请输入客户需求" rows={4} />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={styles['fn-mb-15']}>
                    <Col>
                      <Form.Item {...remarkcol} label={fieldLabels.remark}>
                        {getFieldDecorator('remark')(<TextArea  placeholder="请输入备注信息" rows={4} />)}
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
                <Icon type="api" />流程图
              </span>
            }
            key="2"
          >
            <ProcedureList />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="team" />项目组员
              </span>
            }
            key="3"
          >
            <ProjectMemberList />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="switcher" />所属合同
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
                <Icon type="line-chart" />项目计划
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
                    columns={columnsWorkDiary}
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
                <Icon type="calendar" />工作日记
              </span>
            }
            key="6"
          >
            <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={columnsPlan}
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
                <Icon type="exception" />报告
              </span>
            }
            key="7"
          >
            <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <div className={styles.tableListOperator}>
                    <Button icon="plus" type="primary" onClick={() => this.handleReportAddVisible(true)}>
                      新建
                    </Button>
                  </div>
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={columnsReport}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </Card>
              <ReportAddModal {...reportAddMethods} reportAddVisible={reportAddVisible} />
              <ReportEditModal {...reportEditMethods} reportEditVisible={reportEditVisible} rowInfoCurrent={rowInfoCurrent} />
              <ReportViewModal {...reportViewMethods} reportViewVisible={reportViewVisible} rowInfoCurrent={rowInfoCurrent} />
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
}))(Form.create()(ProjectCheckTabs));
