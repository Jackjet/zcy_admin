import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  Divider,
  Layout,
  Steps,
  Collapse,
  Checkbox,
  Upload,
  Tree,
  Card,
  InputNumber,
  message,
} from 'antd';
import moment from "moment/moment";
import TableForm from './TableForm';
import TableMeetting from './TableMeetting';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Panel } = Collapse;
const { Search } = Input;
const ProTypeOption = {"001":"工程造价业务项目", "002":"可研报告", "003":"招标代理业务项目"};
const BillSourceOption = ['合伙人', '可研报告', '招标代理业务项目'];
const mockData = [];
for (let i = 0; i < 10; i+=1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
};
const { TextArea } = Input;
const { Option } = Select;
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
const BillTable = ['建设项目造价咨询工作交办单','委托人提供资料交接清单','工程咨询过程资料交接登记表'];

@Form.create()
class Step13 extends React.PureComponent {
  state = {
    BillSourceOptionData:``,
    BillSourceValue:``,
    ProTypeOptionData:``,
    TestOption:``,
    ProTypeValue:``,
    BillTableOptionTable:``,
  };
  componentDidMount() {
    this.handleBillSourceOption();
    this.handleProTypeOption();
    this.handleBillTableOptionTable();
  }
  handleBillSourceOption = () => {
    const optionData = BillSourceOption.map((data, index) => {
      const val = `${data}`;
      const keyNum = `${index}`;
      return <Option key={keyNum} value={val}>{val}</Option>;
    });
    this.setState({
      BillSourceOptionData: optionData,
    });
  }; // 根据数据中的数据，动态加载业务来源的Option

  handleProTypeOption = () => {
    const ProTypeValues = Object.values(ProTypeOption);
    const ProTypeKeys = Object.keys(ProTypeOption);
    const optionData = ProTypeValues.map((data, index) => {
      const val = `${data}`;
      const keyNum = `${index}`;
      return <Option key={keyNum} value={val}>{val}</Option>;
    });
    this.setState({
      ProTypeOptionData: optionData,
    });
  }; // 根据数据中的数据，动态加载业务来源的Option

  handleGetBillSourceValue = (val) =>{
    console.log(val);
    this.setState({
      BillSourceValue: val,
    });
  }; // 获取业务来源的Option的值

  handleProTypeSourceValue = (val) =>{
    this.setState({
      ProTypeValue: val,
    });
  }; // 获取业务来源的Option的值

  handleBillTableOptionTable = () => {
    const optionData = BillTable.map((data, index) => {
      const val = `${data}`;
      const keyNum = `${index}`;
      return <Option key={keyNum} value={val}>{val}</Option>;
    });
    this.setState({
      BillTableOptionTable: optionData,
    });
  }; // 根据数据中的数据，动态加载业务来源的Option

  render() {
    const { form, dispatch, loading, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { BillSourceOptionData, BillSourceValue, ProTypeOptionData, ProTypeValue, BillTableOptionTable } = this.state;
    const onPrev = () => {
      this.props.dispatch(routerRedux.push('/project/projectInfo/createReportCode'));
    };
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch(routerRedux.push('/project/projectInfo/confirm'));
        }
      });
    };
    const tableData = [];
    return (
      <Card>
        <Form layout="horizontal">
          <Collapse defaultActiveKey={['1','2','3','4']} >
            <Panel header="重大问题会审提请" key="1">
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={3}>
                  <Form.Item {...formItemLayout} label="项目名称">
                    {getFieldDecorator('name', {
                      rules: [{ required: false, message: '项目名称' }],
                    })(<Input placeholder="项目名称" className={styles['fn-mb-15']} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={3}>
                  <Form.Item {...formItemLayout} label="拟定会审议题">
                    {getFieldDecorator('title', {
                      rules: [{ required: false, message: '拟定会审议题' }],
                    })(
                      <Input placeholder="拟定会审议题" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={11} push={1}>
                  <Form.Item {...formItemLayout} label="提出人">
                    {getFieldDecorator('person', {
                      rules: [{ required: false, message: '提出人' }],
                    })(<Input placeholder="提出人" className={styles['fn-mb-15']} />)}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item {...formItemLayout} label="提出时间">
                    {getFieldDecorator('time', {
                      rules: [{ required: false, message: '提出时间' }],
                    })(
                      <Input placeholder="提出时间" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={11} push={1}>
                  <Form.Item {...formItemLayout} label="项目负责人">
                    {getFieldDecorator('linkman', {
                      rules: [{ required: false, message: '项目负责人' }],
                    })(
                      <Input placeholder="项目负责人" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item {...formItemLayout} label="提请编号">
                    {getFieldDecorator('code', {
                      rules: [{ required: false, message: '提请编号' }],
                    })(
                      <Input placeholder="提请编号" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={3}>
                  <Form.Item {...formItemLayout} label="会审事由">
                    {getFieldDecorator('reason', {
                      rules: [{ required: false, message: '会审事由' }],
                    })(
                      <TextArea placeholder="事由" style={{ minHeight: 32 }} rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="重大问题会审纪要" key="2">
              <Row className={styles['fn-mb-15']}>
                <Col span={11} push={1}>
                  <Form.Item {...formItemLayout} label="会审纪要主持人">
                    {getFieldDecorator('person', {
                      rules: [{ required: false, message: '会审纪要主持人' }],
                    })(<Input placeholder="会审纪要主持人" className={styles['fn-mb-15']} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={11} push={1}>
                  <Form.Item {...formItemLayout} label="地点">
                    {getFieldDecorator('address', {
                      rules: [{ required: false, message: '地点' }],
                    })(
                      <Input placeholder="地点" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item {...formItemLayout} label="时间">
                    {getFieldDecorator('time', {
                      rules: [{ required: false, message: '时间' }],
                    })(
                      <Input placeholder="时间" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={3}>
                  <Form.Item {...formItemLayout} label="参会人员">
                    {getFieldDecorator('title', {
                      rules: [{ required: false, message: '参会人员' }],
                    })(
                      <Input placeholder="参会人员" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={3}>
                  <Form.Item {...formItemLayout} label="邀请专家">
                    {getFieldDecorator('title', {
                      rules: [{ required: false, message: '邀请专家' }],
                    })(
                      <Input placeholder="邀请专家" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={3}>
                  <Form.Item {...formItemLayout} label="会审问题主要内容">
                    {getFieldDecorator('reason', {
                      rules: [{ required: false, message: '会审问题主要内容' }],
                    })(
                      <TextArea placeholder="会审问题主要内容" style={{ minHeight: 32 }} rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="会议签到单" key="3" >
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={3}>
                  <Form.Item {...formItemLayout} label="会议名称">
                    {getFieldDecorator('name', {
                      rules: [{ required: false, message: '会议名称' }],
                    })(
                      <Input placeholder="会议名称" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Card bordered={false}>
                {getFieldDecorator('members', {
                  initialValue: tableData,
                })(<TableMeetting />)}
              </Card>
            </Panel>
            <Panel header="会商纪要" key="4">
              <Row className={styles['fn-mb-15']}>
                <Col span={11} push={1}>
                  <Form.Item {...formItemLayout} label="建设单位">
                    {getFieldDecorator('address', {
                      rules: [{ required: false, message: '建设单位' }],
                    })(
                      <Input placeholder="建设单位" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item {...formItemLayout} label="会商人员(建设)">
                    {getFieldDecorator('time', {
                      rules: [{ required: false, message: '会商人员(建设)' }],
                    })(
                      <Input placeholder="会商人员(建设)" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={11} push={1}>
                  <Form.Item {...formItemLayout} label="设计单位">
                    {getFieldDecorator('address', {
                      rules: [{ required: false, message: '设计单位' }],
                    })(
                      <Input placeholder="设计单位" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item {...formItemLayout} label="会商人员(设计)">
                    {getFieldDecorator('time', {
                      rules: [{ required: false, message: '会商人员(设计)' }],
                    })(
                      <Input placeholder="会商人员(设计)" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={11} push={1}>
                  <Form.Item {...formItemLayout} label="施工单位">
                    {getFieldDecorator('address', {
                      rules: [{ required: false, message: '施工单位' }],
                    })(
                      <Input placeholder="施工单位" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item {...formItemLayout} label="会商人员(施工)">
                    {getFieldDecorator('time', {
                      rules: [{ required: false, message: '会商人员(施工)' }],
                    })(
                      <Input placeholder="会商人员(施工)" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={11} push={1}>
                  <Form.Item {...formItemLayout} label="咨询单位">
                    {getFieldDecorator('address', {
                      rules: [{ required: false, message: '咨询单位' }],
                    })(
                      <Input placeholder="咨询单位" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item {...formItemLayout} label="会商人员(咨询)">
                    {getFieldDecorator('time', {
                      rules: [{ required: false, message: '会商人员(咨询)' }],
                    })(
                      <Input placeholder="会商人员(咨询)" className={styles['fn-mb-15']} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={11} push={1}>
                  <Form.Item {...formItemLayout} label='工程造价咨询业务表'>
                    {getFieldDecorator('contractCode')(
                      <Select onChange={this.handleBillTableOptionTable} placeholder="工程造价咨询业务表" style={{ width: 200 }} >
                        {BillTableOptionTable}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Card title="会商内容与会商意见" bordered={false}>
                {getFieldDecorator('members', {
                  initialValue: tableData,
                })(<TableForm />)}
              </Card>
            </Panel>
          </Collapse>
          <Form.Item
            style={{ marginBottom: 8 }}
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button onClick={onPrev} style={{ left: 400 }}>
              上一步
            </Button>
            <Button type="primary" onClick={onValidateForm} loading={submitting} style={{ marginLeft: 8,  left: 400 }}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default connect(({ person, loading }) => ({
  submitting: loading.effects['person/add'],
}))(Step13);
