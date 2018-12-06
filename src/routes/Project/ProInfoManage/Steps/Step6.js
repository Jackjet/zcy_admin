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
  Slider,
  Progress,
  InputNumber,
} from 'antd';
import moment from "moment/moment";
import GenerateReportModal from '../GenerateReportModal';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Panel }= Collapse;
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



@Form.create()
class Step6 extends React.PureComponent {
  state = {
    BillSourceOptionData:``,
    BillSourceValue:``,
    ProTypeOptionData:``,
    TestOption:``,
    ProTypeValue:``,
    proProgress:0,
    jiheProgress:0,
    totalProgressPro: 0,
    generateReportVisible: false,
  };
  componentDidMount() {
    this.handleBillSourceOption();
    this.handleProTypeOption();
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


   onChangeProgressPro = (value) => {
    console.log('changed', value);
    this.setState({
      proProgress: value,
    })
  };

   // 报告显示
  handleGenerateReportVisible = (flag) => {
    if (this.state.totalProgressPro !== 100){
      message.warning("项目总进度为完成至100%");
      return false;
    } else {
      this.setState({
        generateReportVisible: !!flag,
      });
    }
  };

  onChangeProgressJihe = (value) => {
    console.log('changed', value);
    this.setState({
      jiheProgress: value,
    })
  };

  onChangeTotalProgress = (proProgress, jiheProgress) => {
    this.setState({
      totalProgressPro: proProgress/10*(0.7*10)+jiheProgress/10*(0.3*10),
    })
  };


  render() {
    const { form, dispatch, loading, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { generateReportVisible, BillSourceOptionData, BillSourceValue, ProTypeOptionData, ProTypeValue, jiheProgress, proProgress, totalProgressPro } = this.state;
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
          dispatch(routerRedux.push('/project/projectStart/examineReport'));
        }
      });
    };

    const parentMethods = {
      handleGenerateReportVisible: this.handleGenerateReportVisible,
    };

    const marks = {
      0: '0%',
      20: '20%',
      30: '30%',
      50: '50%',
      100: {
        style: {
          color: '#f50',
        },
        label: <strong>100%</strong>,
      },
    };
    return (
      <Card>
        <Form layout="horizontal">
          <Card>
            <Row>
              <Col span={23} pull={3}>
                <Form.Item {...formItemLayout} label="项目总进度">
                  {getFieldDecorator('contractCode', {
                    rules: [{ required: false, message: '项目总进度' }],
                  })(
                    <Progress percent={totalProgressPro} strokeColor />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23} pull={3}>
                <Form.Item {...formItemLayout} label="工程量编审">
                  {getFieldDecorator('gongchengliang', {
                    rules: [{ required: false, message: '工程量编审' }],
                    initialValue:100,
                  })(
                    <Progress percent={proProgress} strokeColor />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} push={2} >
                <Form.Item {...formItemLayout} label="已完成">
                  {getFieldDecorator('finishPro', {
                    rules: [{ required: false, message: '已完成' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={0}
                      max={100}
                      step={10}
                      onChange={this.onChangeProgressPro}
                    />
                  )}
                  <span>%</span>
                </Form.Item>
              </Col>
              <Col span={16} pull={4}>
                <Form.Item {...formItemLayout} label="说明">
                  {getFieldDecorator('proShuoming', {
                    rules: [{ required: false, message: '说明' }],
                  })(
                    <Input placeholder='说明' />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23} pull={3}>
                <Form.Item {...formItemLayout} label="清单编审套价">
                  {getFieldDecorator('jihe', {
                    rules: [{ required: false, message: '清单编审套价' }],
                  })(
                    <Progress percent={jiheProgress} strokeColor />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} push={2} >
                <Form.Item {...formItemLayout} label="已完成">
                  {getFieldDecorator('finishjihe', {
                    rules: [{ required: false, message: '已完成' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={0}
                      max={100}
                      step={10}
                      onChange={this.onChangeProgressJihe}
                    />
                  )}
                  <span>%</span>
                </Form.Item>
              </Col>
              <Col span={16} pull={4}>
                <Form.Item {...formItemLayout} label="说明">
                  {getFieldDecorator('jiheShuoming', {
                    rules: [{ required: false, message: '说明' }],
                  })(
                    <Input placeholder='说明' />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23} pull={3}>
                <Form.Item {...formItemLayout} label="自校">
                  {getFieldDecorator('gongchengliang', {
                    rules: [{ required: false, message: '自校' }],
                    initialValue:100,
                  })(
                    <Progress percent={proProgress} strokeColor />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} push={2} >
                <Form.Item {...formItemLayout} label="已完成">
                  {getFieldDecorator('finishPro', {
                    rules: [{ required: false, message: '已完成' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={0}
                      max={100}
                      step={10}
                      onChange={this.onChangeProgressPro}
                    />
                  )}
                  <span>%</span>
                </Form.Item>
              </Col>
              <Col span={16} pull={4}>
                <Form.Item {...formItemLayout} label="说明">
                  {getFieldDecorator('proShuoming', {
                    rules: [{ required: false, message: '说明' }],
                  })(
                    <Input placeholder='说明' />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={23} pull={3}>
                <Form.Item {...formItemLayout} label="工程量核对">
                  {getFieldDecorator('gongchengliang', {
                    rules: [{ required: false, message: '工程量编审核对' }],
                    initialValue:100,
                  })(
                    <Progress percent={proProgress} strokeColor />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} push={2} >
                <Form.Item {...formItemLayout} label="已完成">
                  {getFieldDecorator('finishPro', {
                    rules: [{ required: false, message: '已完成' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={0}
                      max={100}
                      step={10}
                      onChange={this.onChangeProgressPro}
                    />
                  )}
                  <span>%</span>
                </Form.Item>
              </Col>
              <Col span={16} pull={4}>
                <Form.Item {...formItemLayout} label="说明">
                  {getFieldDecorator('proShuoming', {
                    rules: [{ required: false, message: '说明' }],
                  })(
                    <Input placeholder='说明' />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23} pull={3}>
                <Form.Item {...formItemLayout} label="清单套价核对">
                  {getFieldDecorator('jihe', {
                    rules: [{ required: false, message: '清单编审套价核对' }],
                  })(
                    <Progress percent={jiheProgress} strokeColor />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} push={2} >
                <Form.Item {...formItemLayout} label="已完成">
                  {getFieldDecorator('finishjihe', {
                    rules: [{ required: false, message: '已完成' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={0}
                      max={100}
                      step={10}
                      onChange={this.onChangeProgressJihe}
                    />
                  )}
                  <span>%</span>
                </Form.Item>
              </Col>
              <Col span={16} pull={4}>
                <Form.Item {...formItemLayout} label="说明">
                  {getFieldDecorator('jiheShuoming', {
                    rules: [{ required: false, message: '说明' }],
                  })(
                    <Input placeholder='说明' />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23} pull={3}>
                <Form.Item {...formItemLayout} label="自校">
                  {getFieldDecorator('gongchengliang', {
                    rules: [{ required: false, message: '自校' }],
                    initialValue:100,
                  })(
                    <Progress percent={proProgress} strokeColor />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} push={2} >
                <Form.Item {...formItemLayout} label="已完成">
                  {getFieldDecorator('finishPro', {
                    rules: [{ required: false, message: '已完成' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={0}
                      max={100}
                      step={10}
                      onChange={this.onChangeProgressPro}
                    />
                  )}
                  <span>%</span>
                </Form.Item>
              </Col>
              <Col span={16} pull={4}>
                <Form.Item {...formItemLayout} label="说明">
                  {getFieldDecorator('proShuoming', {
                    rules: [{ required: false, message: '说明' }],
                  })(
                    <Input placeholder='说明' />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={23} pull={3}>
                <Form.Item {...formItemLayout} label="修改工程量">
                  {getFieldDecorator('gongchengliang', {
                    rules: [{ required: false, message: '修改工程量' }],
                    initialValue:100,
                  })(
                    <Progress percent={proProgress} strokeColor />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} push={2} >
                <Form.Item {...formItemLayout} label="已完成">
                  {getFieldDecorator('finishPro', {
                    rules: [{ required: false, message: '已完成' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={0}
                      max={100}
                      step={10}
                      onChange={this.onChangeProgressPro}
                    />
                  )}
                  <span>%</span>
                </Form.Item>
              </Col>
              <Col span={16} pull={4}>
                <Form.Item {...formItemLayout} label="说明">
                  {getFieldDecorator('proShuoming', {
                    rules: [{ required: false, message: '说明' }],
                  })(
                    <Input placeholder='说明' />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23} pull={3}>
                <Form.Item {...formItemLayout} label="修改套价">
                  {getFieldDecorator('jihe', {
                    rules: [{ required: false, message: '修改套价' }],
                  })(
                    <Progress percent={jiheProgress} strokeColor />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} push={2} >
                <Form.Item {...formItemLayout} label="已完成">
                  {getFieldDecorator('finishjihe', {
                    rules: [{ required: false, message: '已完成' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={0}
                      max={100}
                      step={10}
                      onChange={this.onChangeProgressJihe}
                    />
                  )}
                  <span>%</span>
                </Form.Item>
              </Col>
              <Col span={16} pull={4}>
                <Form.Item {...formItemLayout} label="说明">
                  {getFieldDecorator('jiheShuoming', {
                    rules: [{ required: false, message: '说明' }],
                  })(
                    <Input placeholder='说明' />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23} pull={3}>
                <Form.Item {...formItemLayout} label="自校">
                  {getFieldDecorator('gongchengliang', {
                    rules: [{ required: false, message: '自校' }],
                    initialValue:100,
                  })(
                    <Progress percent={proProgress} strokeColor />
                  )}
                </Form.Item>
              </Col>
              <Col span={8} push={2} >
                <Form.Item {...formItemLayout} label="已完成">
                  {getFieldDecorator('finishPro', {
                    rules: [{ required: false, message: '已完成' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={0}
                      max={100}
                      step={10}
                      onChange={this.onChangeProgressPro}
                    />
                  )}
                  <span>%</span>
                </Form.Item>
              </Col>
              <Col span={16} pull={4}>
                <Form.Item {...formItemLayout} label="说明">
                  {getFieldDecorator('proShuoming', {
                    rules: [{ required: false, message: '说明' }],
                  })(
                    <Input placeholder='说明' />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Card>

       {/*   <Collapse defaultActiveKey={['1','2','3']} >
            <Panel header="结算" key="1">
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="工程量计算">
                    {getFieldDecorator('contractCode', {
                      rules: [{ required: false, message: '工程量计算' }],
                    })(
                      <Input placeholder="工程量计算" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="套价">
                    {getFieldDecorator('contractTitle', {
                      rules: [{ required: false, message: '套价' }],
                    })(
                      <Input placeholder="套价" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="项目组稽核">
                    {getFieldDecorator('contractTitle', {
                      rules: [{ required: false, message: '项目组稽核' }],
                    })(
                      <Input placeholder="项目组稽核" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="报告生成">
                    {getFieldDecorator('contractCode', {
                      rules: [{ required: false, message: '报告生成' }],
                    })(
                      <Input placeholder="报告生成" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="核对">
                    {getFieldDecorator('contractTitle', {
                      rules: [{ required: false, message: '核对' }],
                    })(
                      <Input placeholder="核对" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="预算" key="2">
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="工程量计算">
                    {getFieldDecorator('contractCode', {
                      rules: [{ required: false, message: '工程量计算' }],
                    })(
                      <Input placeholder="工程量计算" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="套价">
                    {getFieldDecorator('contractTitle', {
                      rules: [{ required: false, message: '套价' }],
                    })(
                      <Input placeholder="套价" />
                    )}
                  </Form.Item>
                </Col>

              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="项目组稽核">
                    {getFieldDecorator('contractTitle', {
                      rules: [{ required: false, message: '项目组稽核' }],
                    })(
                      <Input placeholder="项目组稽核" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="报告生成">
                    {getFieldDecorator('contractCode', {
                      rules: [{ required: false, message: '报告生成' }],
                    })(
                      <Input placeholder="报告生成" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
            <Panel header="跟踪审计" key="3" >
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="清单复核">
                    {getFieldDecorator('contractTitle', {
                      rules: [{ required: false, message: '清单复核' }],
                    })(
                      <Input placeholder="清单复核" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="项目进度">
                    {getFieldDecorator('contractCode', {
                      rules: [{ required: false, message: '项目进度' }],
                    })(
                      <Input placeholder="项目进度" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="阶段性报告">
                    {getFieldDecorator('contractTitle', {
                      rules: [{ required: false, message: '阶段性报告' }],
                    })(
                      <Input placeholder="阶段性报告" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          </Collapse>*/}
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
            <Button onClick={this.onChangeTotalProgress(proProgress, jiheProgress)} style={{ left: 400 }}>
              保存
            </Button>
            <Button type="primary" onClick={() =>this.handleGenerateReportVisible(true)} style={{ marginLeft: 8,  left: 400 }}>
              编辑报告
            </Button>
          </Form.Item>
        </Form>
        <GenerateReportModal {...parentMethods} generateReportVisible={generateReportVisible} />
      </Card>
    );
  }
}

export default connect(({ person, loading }) => ({
  submitting: loading.effects['person/add'],
}))(Step6);
