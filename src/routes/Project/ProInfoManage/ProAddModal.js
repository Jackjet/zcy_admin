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
  Select,
  Popover,
  Checkbox,
  Modal,
  Divider,
  Upload,
  Collapse,
  Table,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import moment from "moment/moment";
import ChoiceCusModal from "../add/ChoiceCusModal";
import ConstructUnitModal from "../add/ConstructUnitModal";
import EditableCell from '../../../components/EditableTable/index';
import styles from '../add/style.less';

const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const BillSourceOption = ['招标', '合伙人', '其他'];
const CheckBoxOption = ['底稿','报告','工程','项目','合同'];
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
  startDate: '开始日期',
  endDate: '结束日期',
  biztype: '业务类别',
  content: '项目内容',
  address: '详细地址',
  remark: '备注',
  status: '状态',
  jfw: '交付物',
  demand: '客户需求',
  attachment:'附件',
};




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

class ProjectAddModal extends PureComponent {
  state = {
    width: '100%',
    projectOptionData:[],
    BillSourceOptionData:``,
    BillSourceValue:``,
    CusOptionData:``,
    dataSource: [
      {
        key: '0',
        project: '汪工',
        departure: '杭州',
        startData: '2018-7-27',
        togetherPerson: '3',
        endData: '2018-7-29',
        daySum: '1',
        Vehicle: '动车',
        ticketSum: '3',
        remarks: '无',

      },
      {
        key: '0',
        project: '申工',
        departure: '义务',
        startData: '2018-7-27',
        togetherPerson: '3',
        endData: '2018-7-29',
        daySum: '1',
        Vehicle: '高铁',
        ticketSum: '3',
        remarks: '无',
      },
    ],
    count: 2,
    choiceCusVisible: false,
    getCusValue: "客户A",
    constructUnitVisible: false,
    getConstructUnitValue: "施工单位A",
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleBillSourceChange();
    this.handleCheckBoxChange();
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
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };
  handleGetBillSourceValue = (val) => {
    this.setState({
      BillSourceValue: val,
    });
  };

  /**
   * 功能描述: 业务来源select动态加载方法
   *
   * @param:
   * @return:
   * @auther: fanghui_yang
   * @date: 2018/10/16 15:32
   */
  handleBillSourceChange = () => {
    const optionData = BillSourceOption.map((data, index) => {
      const val = `${data}`;
      return <Option key={val}>{val}</Option>;
    });
    this.setState({
      BillSourceOptionData: optionData,
    });
  };


  handleChoiceCusVisible = flag => {
    this.setState({
      choiceCusVisible: !!flag,
    });
  };

  handleGetCusValue = (cus) => {
    this.setState({
      getCusValue: cus,
    });
  };

  handleConstructUnitVisible = flag => {
    this.setState({
      constructUnitVisible: !!flag,
    });
  };

  handleGetConstructUnitValue = (unit) => {
    this.setState({
      getConstructUnitValue: unit,
    });
  };

  handleCheckBoxChange = () => {
    this.setState({
      CusOptionData: CheckBoxOption.map((data) => {
        const val = `${data}`;
        return <Option key={val}>{val}</Option>;
      }),
    });
  };

  handleGetCusSelectValue = (val) =>{
    console.log(val)
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      remarks: `London, Park Lane no. ${count}`,
      project: `小杨 ${count}`,
      departure: '新昌',
      startData: '2018-7-26',
      togetherPerson: '3',
      endData: '2018-7-29',
      daySum: '1',
      Vehicle: '大巴',
      ticketSum: '3',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
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
    const { form, dispatch, submitting, projectVisible, handleProjectVisible, choiceTypeValue, rowInfo } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const {
      BillSourceOptionData,
      dataSource,
      choiceCusVisible,
      getCusValue,
      constructUnitVisible,
      getConstructUnitValue,
      BillSourceValue,
      CusOptionData,
    } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values

          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          form.resetFields();
          handleProjectVisible(false);
        }
      });
    };
    const onCan = () => {
      form.resetFields();
      handleProjectVisible(false);
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
        title: '项目',
        dataIndex: 'project',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'name')} />
        ),
      },
      {
        title: '出发地',
        dataIndex: 'departure',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'type')} />
        ),
      },
      {
        title: '出发时间',
        dataIndex: 'startData',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'mobilePhone')} />
        ),
      },
      {
        title: '同行人数',
        dataIndex: 'togetherPerson',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '结束时间',
        dataIndex: 'endData',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '天数',
        dataIndex: 'daySum',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '交通工具',
        dataIndex: 'Vehicle',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '票数',
        dataIndex: 'ticketSum',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return this.state.dataSource.length > 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <a href=" ">删除</a>
            </Popconfirm>
          ) : null;
        },
      },
    ];
    const parentMethods={
      handleChoiceCusVisible: this.handleChoiceCusVisible,
      handleGetCusValue: this.handleGetCusValue,
      handleConstructUnitVisible: this.handleConstructUnitVisible,
      handleGetConstructUnitValue: this.handleGetConstructUnitValue,
    };
    return (
      <Modal
        title="项目基本信息新增"
        style={{ top: 20 }}
        visible={projectVisible}
        width='85%'
        maskClosable={false}
        onOk={validate}
        onCancel={onCan}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入项目名称' }],
                      initialValue:`${rowInfo.customerName}` === 'undefined'?'':`${rowInfo.customerName}`,
                    })(<Input placeholder="请输入项目名称" style={{width:'140%'}} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.type}>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '请选择项目类别' }],
                      initialValue:`${choiceTypeValue}`,
                    })(
                      <Input readOnly placeholder="请选择项目类别" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.years}>
                    {getFieldDecorator('years', {
                      rules: [{ required: true, message: '请选择年度' }],
                      initialValue:`${moment().format('YYYY')}`,
                    })(
                      <Select placeholder="请选择年度" style={{ width: '100%' }}>
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
                      initialValue:`新建`,
                    })(
                      <Input placeholder="请选择项目状态" style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.number}>
                    {getFieldDecorator('number', {
                      rules: [{ required: false, message: '请输入项目编码' }],
                      initialValue:`${rowInfo.projectCode}` === 'undefined'?'':`${rowInfo.projectCode}`,
                    })(
                      <Input placeholder="自动带出" style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.customer}>
                    {getFieldDecorator('customer', {
                      rules: [{ required: true, message: '请选择客户' }],
                    })(
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="客户"
                        onSelect={this.handleGetCusSelectValue}
                      >
                        {CusOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.cuslink}>
                    {getFieldDecorator('cuslink', {
                      rules: [{ required: true, message: '请选择客户联系人' }],
                    })(
                      <div>
                        <Input placeholder="请选择客户联系人" style={{ width: '63%' }} />
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
                    })(
                      <Select placeholder="负责公司" style={{ width: '100%' }}>
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
                  <Form.Item {...formItemLayout} label="项目负责人">
                    {getFieldDecorator('fzperson', {
                      rules: [{ required: true, message: '项目负责人' }],
                    })(
                      <Select placeholder="项目负责人" style={{ width: '100%' }}>
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
                  <Form.Item {...formItemLayout} label="项目部门">
                    {getFieldDecorator('fzperson', {
                      rules: [{ required: true, message: '项目部门' }],
                    })(
                      <Input readOnly placeholder="自动带出" style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.fee}>
                    {getFieldDecorator('fee', {
                      rules: [{ required: true, message: '请输入项目费用' }],
                    })(<Input placeholder="请输入项目费用" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="业务来源">
                    {getFieldDecorator('billSource', {
                      rules: [{ required: true, message: '业务来源' }],
                    })(
                      <Select onSelect={this.handleGetBillSourceValue} placeholder="业务来源" style={{ width: '100%' }} >
                        {BillSourceOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                {
                  (BillSourceValue === `合伙人`)&& (
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label='执行合伙人'>
                        {getFieldDecorator('partner')(
                          <Input style={{ width: '100%' }} placeholder="执行合伙人" />
                        )}
                      </Form.Item>
                    </Col>
                  )
                }
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label='施工单位'>
                    {getFieldDecorator('shigongdanwei',{
                      initialValue:`${getConstructUnitValue}`,
                    })(
                      <Search
                        placeholder="施工单位"
                        onSearch={this.handleConstructUnitVisible}
                        style={{ width: 200 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label='合同编号'>
                    {getFieldDecorator('contractCode')(
                      <div>
                        <Input style={{ width: '68%' }} placeholder="合同编号" />
                        <Divider type="vertical" />
                        <a>新增合同</a>
                      </div>
                    )}
                  </Form.Item>
                </Col>

              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label='开始时间'>
                    {getFieldDecorator('startDate')(
                      <DatePicker style={{ width: '100%' }} placeholder="请输入开始时间" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.endDate}>
                    {getFieldDecorator('endDate')(
                      <DatePicker style={{ width: '100%' }} placeholder="请输入结束日期" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} />
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="指派编号">
                    {getFieldDecorator('zhipaiCode')(
                      <Search
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
                    {getFieldDecorator('biztype',{
                    })(
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                          { ( `${choiceTypeValue}` === `工程造价业务项目`|| `${choiceTypeValue}` ===`可研报告` ) && (
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

                          { ( `${choiceTypeValue}` === `招标代理业务项目`|| `${choiceTypeValue}`===`可研报告` ) && (
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
              <Collapse defaultActiveKey={['1','2','3']} >
                { ( `${choiceTypeValue}` === `工程造价业务项目` )&& (
                  <Panel header="工程造价业务项目" key="1">
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='项目个数'>
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="项目个数" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='送审金额'>
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="送审金额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='核减额'>
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="核减额" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='核增额'>
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="核增额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='建筑面积'>
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="建筑面积" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='核定或预算总造价'>
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="核定或预算总造价" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={23} pull={5}>
                        <Form.Item {...formItemLayout} label='备注'>
                          {getFieldDecorator('shigongdanwei')(
                            <TextArea style={{ width: '100%' }} placeholder="备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Panel>
                )}
                { ( `${choiceTypeValue}` === `可研报告` ) && (
                  <Panel header="可研报告" key="2">
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='项目个数'>
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="项目个数" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='送审金额'>
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="送审金额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='核减额'>
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="核减额" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='核增额'>
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="核增额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='建筑面积'>
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="建筑面积" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label='核定或预算总造价'>
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="核定或预算总造价" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={23} pull={5}>
                        <Form.Item {...formItemLayout} label='备注'>
                          {getFieldDecorator('shigongdanwei')(
                            <TextArea style={{ width: '100%' }} placeholder="备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Panel>
                )}
                { ( `${choiceTypeValue}` === `招标代理业务项目`) && (
                  <Panel header="招标代理业务项目" key="3">
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label='招标公告发布'>
                          {getFieldDecorator('shigongdanwei')(
                            <DatePicker  style={{ width: '100%' }} placeholder="招标公告发布" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label='招标文件发布'>
                          {getFieldDecorator('contractCode')(
                            <DatePicker  style={{ width: '100%' }} placeholder="招标文件发布" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label='开标日期'>
                          {getFieldDecorator('shigongdanwei')(
                            <DatePicker  style={{ width: '100%' }} placeholder="开标日期" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label='结束日期'>
                          {getFieldDecorator('contractCode')(
                            <DatePicker  style={{ width: '100%' }} placeholder="结束日期" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label='项目个数'>
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="项目个数" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label='控制价'>
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="控制价" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label='中标价'>
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="中标价" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={21} pull={3}>
                        <Form.Item {...formItemLayout} label='备注'>
                          {getFieldDecorator('shigongdanwei')(
                            <TextArea style={{ width: '100%' }} placeholder="备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Panel>
                )}
              </Collapse>
            </Form>
          </Card>
          <ChoiceCusModal {...parentMethods} choiceCusVisible={choiceCusVisible} />
          <ConstructUnitModal {...parentMethods} constructUnitVisible={constructUnitVisible} />
        </div>
      </Modal>

    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ProjectAddModal));
