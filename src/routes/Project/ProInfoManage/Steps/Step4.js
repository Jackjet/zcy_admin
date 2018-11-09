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
  };
  componentDidMount() {
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

  render() {
    const { form, project: { data }, dispatch, submitting, loading } = this.props;
    const { selectedKeys, selectedRows } = this.state;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/project/projectInfo/result'));
    };
    const columnsProcess = [
      {
        title: '项目频度',
        dataIndex: 'name',
      },
      {
        title: '计划时间',
        dataIndex: 'number',
      },
      {
        title: '工程阶段',
        dataIndex: 'stage',
      },
      {
        title: '问题',
        dataIndex: 'problem',
      },
      {
        title: '协助',
        dataIndex: 'assist',
      },
    ];
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
        }
      });
    };
    return (
      <div>
        <Form layout="horizontal" className={styles.stepForm}>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columnsProcess}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
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
            <Button type="primary" onClick={onValidateForm} loading={submitting}>
              提交
            </Button>
            <Button onClick={onPrev} style={{ marginLeft: 8 }}>
              上一步
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
  loading: loading.models.company,
}))(Step4);

