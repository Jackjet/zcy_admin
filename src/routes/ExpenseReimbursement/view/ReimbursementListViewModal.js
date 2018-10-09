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
  Table,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import EditableCell from '../../../components/EditableTable/index';
import styles from './style.less';

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
const PanelDataOption = ['项目', '借款', '个人'];
const IndustryOption = ['制造业','服务业','房地产建筑','三农业务','政府购买','商业','金融','非营利组织','其他'];
const IncomeTaxOption = ['查账征收','核定征收'];
const statusOption = ['保存','启用','禁用'];


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
};


class ReimbursementListViewModal extends PureComponent {
  state = {
    width: '100%',
    panelOptionData: [],
    industryOptionData:[],
    incomeTaxOptionData:[],
    choiceCheckBox: "",
    statusOptionData:[],
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

  handleLevelChange = () => {
    this.setState({
      panelOptionData: PanelDataOption.map((data) => {
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

  handleGetOptionValue=(value)=>{
    this.setState({
      choiceCheckBox:`${value}`,
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
      submitting ,
      reimbursementListViewModalVisible,
      handleReimbursementListViewModalVisible,
      rowInfo,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { panelOptionData, choiceCheckBox, dataSource } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          form.resetFields();
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handleReimbursementListViewModalVisible(false);
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handleReimbursementListViewModalVisible(false);
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
    return (
      <Modal
        title="费用报销申请单信息查看"
        style={{ top: 20 }}
        visible={reimbursementListViewModalVisible}
        width="80%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="报销人">
                    {getFieldDecorator('Applicant', {
                      rules: [{ required: false, message: '报销人' }],
                    })(<Input disabled placeholder="报销人" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="申请单号">
                    {getFieldDecorator('applyCode', {
                      rules: [{ required: true, message: '申请单号' }],
                    })(
                      <Input placeholder="申请单号" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="状态">
                    {getFieldDecorator('status', {
                      rules: [{ required: true, message: '状态' }],
                      initialValue:`${rowInfo.status}`,
                    })(
                      <Input placeholder="状态" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="费用类型">
                    {getFieldDecorator('ExpensesType', {
                      rules: [{ required: false, message: '费用类型' }],
                    })(
                      <Select onChange={this.handleGetOptionValue} onMouseEnter={this.handleLevelChange} placeholder="请选择客户等级" style={{ width: 200 }}>
                        {panelOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="报销金额">
                    {getFieldDecorator('ReimbursementSum', {
                      rules: [{ required: false, message: '报销金额' }],
                    })(
                      <Input placeholder="报销金额" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="报销日期">
                    {getFieldDecorator('ReimbursementDate', {
                      rules: [{ required: false, message: '报销日期' }],
                    })(
                      <Input placeholder="报销日期" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="审核金额">
                    {getFieldDecorator('AuditAmount', {
                      rules: [{ required: false, message: '审核金额' }],
                    })(
                      <Input placeholder="审核金额" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Collapse defaultActiveKey={['1','2','3']} >
                { ( `${choiceCheckBox}` === `项目` )&& (
                  <Panel header="项目" key="1">
                    <Row className={styles['fn-mb-15']}>
                      <Col span={24} offset={1}>
                        <div>
                          <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                            项目新建
                          </Button>
                          <Table
                            dataSource={dataSource}
                            columns={columns}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Panel>
                )}
                { ( `${choiceCheckBox}` === `个人` ) && (
                  <Panel header="个人" key="2">
                    <Row className={styles['fn-mb-15']}>
                      <Col span={24} offset={1}>
                        <div>
                          <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                            个人新建
                          </Button>
                          <Table
                            dataSource={dataSource}
                            columns={columns}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Panel>
                )}
                { ( `${choiceCheckBox}` === `借款`) && (
                  <Panel header="借款" key="3">
                    <Row className={styles['fn-mb-15']}>
                      <Col span={24} offset={1}>
                        <div>
                          <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                            借款新建
                          </Button>
                          <Table
                            dataSource={dataSource}
                            columns={columns}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Panel>
                )}
              </Collapse>
            </Form>
          </Card>
        </div>
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ReimbursementListViewModal));
