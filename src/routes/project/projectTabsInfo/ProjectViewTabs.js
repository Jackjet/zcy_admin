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
  Upload,
  Tree,
  Transfer,
  Popover,
  Table,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import moment from "moment/moment";
import StandardTable from 'components/StandardTable';
import ReportAddModal from '../add/ReportAddModal';
import ReportEditModal from '../edit/ReportEditModal';
import EditableCell from '../EditableTable/EditableCell';
import ReportViewModal from '../select/ReportViewModal';

import styles from '../list/Style.less';

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
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
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
const CheckBoxOption = ['底稿','报告','工程','项目','合同'];

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
    checkBoxOptionData: [],
    choiceOption:[],
    targetKeys:[],
    selectedKeys: [],
    selectedRows:{},
    dataSource: [
      {
        key: '0',
        name: '汪工',
        phone: '123456',
        remarks: 'aaa',
      },
      {
        key: '1',
        name: '申工',
        phone: '456789',
        remarks: 'bbb',
      },
    ],
    count: 2,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  onCellChange = (key, dataIndex) => {
    return value => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  };
  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };


  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `小杨 ${count}`,
      phone: 18,
      remarks: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };


  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

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

  handleCheckBoxChange = () => {
    this.setState({
      checkBoxOptionData: CheckBoxOption.map((data) => {
        const val = `${data}`;
        return <Col span={6}><Checkbox value={val}>{val}</Checkbox></Col>;
      }),
    });
  };

  handleGetOptionValue=(value)=>{
    this.setState({
      choiceOption:`${value}`,
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
    const {
      selectedRows,
      reportAddVisible,
      reportEditVisible,
      reportViewVisible,
      rowInfoCurrent,
      selectedKeys,
      checkBoxOptionData,
      choiceOption,
      dataSource,
    } = this.state;
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
      attachment: '附件',
    };
    const columnsLinkMan = [
      {
        title: '姓名',
        dataIndex: 'name',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'name')} />
        ),
      },
      {
        title: '联系人类型',
        dataIndex: 'type',
        render: (text, record) => (
          <div>
            <Select style={{ width: 130 }}>
              <Option value="0">主联系人</Option>
              <Option value="1">法人</Option>
            </Select>
          </div>
        ),
      },
      {
        title: '联系电话',
        dataIndex: 'mobilePhone',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'remarks')} />
        ),
      },
      {
        title: '办公电话',
        dataIndex: 'officePhone',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'remarks')} />
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return this.state.dataSource.length > 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <a href=" ">Delete</a>
            </Popconfirm>
          ) : null;
        },
      },
    ];
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
        dataIndex: 'startDate',
      },
      {
        title: '计划结束时间',
        dataIndex: 'endDate',
      },
      {
        title: '实际完成时间',
        dataIndex: 'dictTypeName',
      },
      {
        title: '备注',
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
        width="75%"
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
                <Form layout="horizontal">
                  <Row className={styles['fn-mb-15']}>
                    <Col span={23} pull={5}>
                      <Form.Item {...formItemLayout} label={fieldLabels.name}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入项目名称' }],
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="请输入项目名称" className={styles['ant-input-lg']} />
                        )}
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
                      <Form.Item {...formItemLayout} label={fieldLabels.number}>
                        {getFieldDecorator('number', {
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
                </Form>
              </Card>
            </div>
          </TabPane>
          {
            (`${rowInfo.projectStatus}` !== '8') && (
              <TabPane
                tab={
                  <span>
                <Icon type="team" />项目组员
              </span>
                }
                key="3"
              >
                <div>
                  <Card>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={5} offset={6}>
                        <Form.Item {...formItemLayout} label={fieldLabels.assignor}>
                          {getFieldDecorator('assignor', {

                          })(
                            <div className={styles.divBorder}>
                              <Tree>
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
                  </Card>
                </div>
              </TabPane>
            )
          }
          {
            (`${rowInfo.projectStatus}` !=="8") && (
              <TabPane
                tab={
                  <span>
                    <Icon type="exception" />资料清单
                  </span>
                }
                key="8"
              >
                <div>
                  <Card>
                    <Form layout="horizontal">
                      {/*<Row className={styles['fn-mb-15']}>
                    <Col span={24} pull={4}>
                      <Form.Item {...formItemLayout} label="请选择上传附件类型">
                        {getFieldDecorator('checkBoxOption ', {
                        })(
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="请选择上传附件类型"
                            onMouseEnter={this.handleCheckBoxChange}
                            onChange={this.handleGetOptionValue}
                          >
                            {checkBoxOptionData}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>*/}
                      <Row className={styles['fn-mb-15']}>
                        <Col span={24}>
                          <Checkbox.Group
                            style={{ width: '100%' }} >
                            <Row>
                              <Col span={6}><Checkbox value="A">A</Checkbox></Col>
                              <Col span={6}><Checkbox value="B">B</Checkbox></Col>
                              <Col span={6}><Checkbox value="C">C</Checkbox></Col>
                              <Col span={6}><Checkbox value="D">D</Checkbox></Col>
                              <Col span={6}><Checkbox value="E">E</Checkbox></Col>
                            </Row>
                          </Checkbox.Group>
                        </Col>
                      </Row>
                      { ( `${choiceOption.indexOf("资料")}` > `-1` ) && (
                        <span>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={24} pull={4}>
                          <Form.Item {...formItemLayout} label={fieldLabels.attachment}>
                            {getFieldDecorator('attachment ', {
                              initialValue: '1',
                            })(
                              <Upload {...props2}>
                                <Button type="primary">
                                  <Icon type="upload" /> 上传资料附件
                                </Button>
                                <span>
                                  *只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif，最多上传5个附件
                                </span>
                              </Upload>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </span>
                      )}
                      { ( `${choiceOption.indexOf("底稿")}` > `-1` ) && (
                        <span>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={24} pull={4}>
                          <Form.Item {...formItemLayout} label={fieldLabels.attachment}>
                            {getFieldDecorator('attachment ', {
                              initialValue: '1',
                            })(
                              <Upload {...props2}>
                                <Button type="primary">
                                  <Icon type="upload" /> 上传底稿附件
                                </Button>
                                <span>
                                  *只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif，最多上传5个附件
                                </span>
                              </Upload>
                            )}
                            </Form.Item>
                        </Col>
                      </Row>
                    </span>
                      )}
                      { ( `${choiceOption.indexOf("报告")}` > `-1` ) && (
                        <span>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={24} pull={4}>
                          <Form.Item {...formItemLayout} label={fieldLabels.attachment}>
                            {getFieldDecorator('report', {
                              initialValue: '1',
                            })(
                              <Upload {...props2}>
                                <Button type="primary">
                                  <Icon type="upload" /> 上传报告附件
                                </Button>
                                <span>
                                  *只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif，最多上传5个附件
                                </span>
                              </Upload>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </span>
                      )}
                      { ( `${choiceOption.indexOf("工程")}` > `-1` ) && (
                        <span>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={24} pull={4}>
                          <Form.Item {...formItemLayout} label={fieldLabels.attachment}>
                            {getFieldDecorator('project', {
                              initialValue: '1',
                            })(
                              <Upload {...props2}>
                                <Button type="primary">
                                  <Icon type="upload" /> 上传工程附件
                                </Button>
                                <span>
                                  *只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif，最多上传5个附件
                                </span>
                              </Upload>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </span>
                      )}
                      { ( `${choiceOption.indexOf("合同")}` > `-1` ) && (
                        <span>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={24} pull={4}>
                          <Form.Item {...formItemLayout} label={fieldLabels.attachment}>
                            {getFieldDecorator('contract ', {
                              initialValue: '1',
                            })(
                              <Upload {...props2}>
                                <Button type="primary">
                                  <Icon type="upload" /> 上传合同附件
                                </Button>
                                <span>
                                  *只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif，最多上传5个附件
                                </span>
                              </Upload>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </span>
                      )}
                    </Form>
                  </Card>
                </div>
              </TabPane>
            )
          }
          {
            (`${rowInfo.projectStatus}` !=="8") && (
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
            )
          }
          {
            (`${rowInfo.projectStatus}` !=="8") && (
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
                        columns={columnsPlan}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange}
                      />
                    </div>
                  </Card>
                </div>
              </TabPane>
            )
          }
          {
            (`${rowInfo.projectStatus}` !=="8") && (
              <TabPane
                tab={
                  <span>
                <Icon type="calendar" />过程管理
              </span>
                }
                key="6"
              >
                <div>
                  <Card>
                    <div>
                      <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                        新增联系人
                      </Button>
                      <Table
                        dataSource={dataSource}
                        columns={columnsLinkMan}
                      />
                    </div>
                  </Card>
                </div>
              </TabPane>
            )
          }
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
          {
            (`${rowInfo.projectStatus}` !=="8") && (
              <TabPane
                tab={
                  <span>
                <Icon type="exception" />项目交流
              </span>
                }
                key="9"
              >
                <div>
                  <Card>
                    <Form layout="horizontal">
                      <Row className={styles['fn-mb-15']}>
                        <Col span={24} pull={4}>
                          <Form.Item {...formItemLayout} label="交流内容">
                            {getFieldDecorator('communicationContent ', {
                            })(
                              <TextArea placeholder="交流内容" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={24} pull={4}>
                          <Form.Item {...formItemLayout} label="交流时间">
                            {getFieldDecorator('communicationTime ', {
                              initialValue:`${moment().format('YYYY-MM-DD HH:mm:ss')}`,
                            })(
                              <Input placeholder="交流时间" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className={styles['fn-mb-15']}>
                        <Col span={24} pull={4}>
                          <Form.Item {...formItemLayout} label="@人员">
                            {getFieldDecorator('personnel', {
                            })(
                              <Input placeholder="@人员" style={{ width: 200 }} />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </div>
              </TabPane>
            )
          }
        </Tabs>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ProjectCheckTabs));
