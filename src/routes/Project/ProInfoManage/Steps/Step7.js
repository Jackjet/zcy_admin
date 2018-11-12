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
  message,
} from 'antd';
import moment from "moment/moment";
import { routerRedux } from 'dva/router';
import styles from './style.less';

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
const BillTable = ['建设项目造价咨询工作交办单','委托人提供资料交接清单','工程咨询过程资料交接登记表'];
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

@Form.create()
class Step7 extends React.PureComponent {
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
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          /*dispatch({
            type: 'person/add',
            payload: values,
            callback: (res) => {
              if(res.meta.status !== "000000"){
                message.error(res.meta.errmsg);
              } else {
                message.success("提交成功!");

              }
            },
          });*/
          dispatch(routerRedux.push('/project/projectInfo/createReportCode'));
        }
      });
    };
    const onPrev = () => {
      dispatch(routerRedux.push('/project/projectInfo/createContract'));
    };
    return (
      <Card>
        <Form layout="horizontal">
          <Row className={styles['fn-mb-15']}>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="委托单位(全称)">
                {getFieldDecorator('weituoUnit', {
                  rules: [{ required: false, message: '委托单位(全称)' }],
                })(
                  <Input placeholder="委托单位(全称)" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="联系人">
                {getFieldDecorator('LinkMan', {
                  rules: [{ required: false, message: '联系人' }],
                })(
                  <Input placeholder="联系人" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="联系电话">
                {getFieldDecorator('phone', {
                  rules: [{ required: false, message: '联系电话' }],
                })(
                  <Input placeholder="联系电话" />
                )}
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item {...formItemLayout} label="回函地址">
                {getFieldDecorator('address', {
                  rules: [{ required: false, message: '回函地址' }],
                })(
                  <Input placeholder="回函地址" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label='工程造价咨询业务表'>
                {getFieldDecorator('contractCode')(
                  <Select onChange={this.handleBillTableOptionTable} placeholder="工程造价咨询业务表" style={{ width: 200 }} >
                    {BillTableOptionTable}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="事由">
                {getFieldDecorator('zhipaiCode')(
                  <TextArea placeholder="事由" style={{ minHeight: 32 }} rows={4} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="具体内容">
                {getFieldDecorator('zhipaiCode')(
                  <TextArea placeholder="具体内容" style={{ minHeight: 32 }} rows={4} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Col span={8}>
            <Form.Item {...formItemLayout} label='附件'>
              {getFieldDecorator('companyName', {
                rules: [{ required: false, message: '附件' }],
              })(
                <div>
                  <Upload {...props2}>
                    <Button>
                      <Icon type="upload" /> 上传
                    </Button>
                  </Upload>
                </div>
              )}
            </Form.Item>
          </Col>
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
}))(Step7);
