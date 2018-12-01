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
class Step4 extends React.PureComponent {
  state = {
    targetKeys: [],
    selectedRows:``,
    BillTableOptionTable:``,
    fileList: [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png',
    }],
  };
  componentDidMount() {
    this.handleBillTableOptionTable();
    this.props.dispatch({
      type: 'project/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {

        }else{
          //

        }
      },
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  }; // 控制选中的行的方法

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, pageCurrent, pageSizeCurrent } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    this.setState({
      pageCurrent: params.page,
      pageSizeCurrent: params.pageSize,
    });
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'company/fetch',
      payload: params,
    });
  }; // 分页器的下一页 第几页 方法

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

  handleChange = (info) => {
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    // 3. Filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });

    this.setState({ fileList });
  }


  render() {
    const { form, project: { data }, dispatch, submitting, loading } = this.props;
    const { selectedKeys, selectedRows, BillTableOptionTable } = this.state;
    const { getFieldDecorator, validateFields } = form;
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange: this.handleChange,
      multiple: true,
    };
    const onPrev = () => {
      dispatch(routerRedux.push('/project/projectStart/result'));
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        this.props.dispatch(routerRedux.push('/project/projectStart/createContract'));
      });
    };
    return (
      <div>
        <Form layout="horizontal" className={styles.stepForm}>
          {/*<Row>
            <Col>
              <Form.Item label="项目实施计划安排">
                {getFieldDecorator('zhipaiCode')(
                  <TextArea placeholder="项目实施计划安排" style={{ minHeight: 32 }} rows={4} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="咨询操作过程中重点、难点的具体实施措施">
                {getFieldDecorator('zhipaiCode')(
                  <TextArea placeholder="咨询操作过程中重点、难点的具体实施措施" style={{ minHeight: 32 }} rows={4} />
                )}
              </Form.Item>
            </Col>
          </Row>*/}
          <Row>
            <Col span={23} push={3}>
              <Upload {...props} fileList={this.state.fileList}>
                <Button>
                  <Icon type="upload" /> 上传方案
                </Button>
              </Upload>
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
            <Button style={{ marginLeft: 8, left: 400 }}>
              打印
            </Button>
            <Button type="primary" onClick={onValidateForm} loading={submitting} style={{ marginLeft: 8, left: 400 }}>
              下载
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect(({ project, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  project,
  loading: loading.models.project,
}))(Step4);

