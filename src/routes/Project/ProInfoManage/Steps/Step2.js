import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {Route, Redirect, Switch, routerRedux} from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Menu,
  DatePicker,
  Divider,
  Layout,
  Modal,
  Steps,
  Collapse,
  Checkbox,
  Upload,
  Tree,
  Transfer,
  Table,
  InputNumber,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from '../../list/Style.less';
import NotFound from "../../../Exception/404";
import {getRoutes} from "../../../../utils/utils";

const BillTable = ['建设项目造价咨询工作交办单','委托人提供资料交接清单','工程咨询过程资料交接登记表'];
const mockData = [];
for (let i = 0; i < 10; i+=1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
};
const { TextArea } = Input;
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
const { Panel } = Collapse;
const { Step } = Steps;
const {Content, Sider} = Layout;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@Form.create()
class Step2 extends React.PureComponent {
  state = {
    targetKeys: [],
    BillTableOptionTable:``,
  };

  componentDidMount() {
    this.handleBillTableOptionTable();
  }

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

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
    const { form, data, dispatch, submitting } = this.props;
    const { selectedKeys, BillTableOptionTable } = this.state;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/project/projectStart/info'));
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/submitStepForm',
            payload: {
              ...data,
              ...values,
            },
          });
          dispatch(routerRedux.push('/project/projectStart/result'));
        }
      });
    };
    return (
      <div>
        <Form layout="horizontal" className={styles.stepForm}>
          <Row>
            <Col span={23} pull={5}>
              <Form.Item {...formItemLayout} label='工程造价咨询业务表'>
                {getFieldDecorator('contractCode')(
                  <Select onChange={this.handleBillTableOptionTable} placeholder="工程造价咨询业务表" style={{ width: 200 }} >
                    {BillTableOptionTable}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={5} offset={6}>
              <Form.Item {...formItemLayout} label={fieldLabels.assignor}>
                {getFieldDecorator('assignor', {

                })(
                  <div className={styles.divBorder}>
                    <Tree defaultExpandAll>
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
      </div>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))(Step2);
