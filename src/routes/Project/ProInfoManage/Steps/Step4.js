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
import StandardTable from 'components/StandardTableNoTotal';
import TableForm from "./TableFormDemo";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import ChangePlanModal from './ChangePlanModal';
import styles from './style.less';
import NotFound from "../../../Exception/404";
import {getRoutes} from "../../../../utils/utils";

const tableData = [];
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
    changePlanVisible: false,
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

  handleChangePlanVisible = (flag) => {
    this.setState({
      changePlanVisible: !!flag,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  }; // 控制选中的行的方法

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

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
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'company/fetch',
      payload: params,
    });
  }; // 分页器的下一页 第几页 方法

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
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
  };


  render() {
    const { form, project: { data }, dispatch, submitting, loading } = this.props;
    const { selectedKeys, selectedRows, BillTableOptionTable, changePlanVisible } = this.state;
    const { getFieldDecorator, validateFields } = form;
    const pVal = "1.本表一式三份（项目负责人、部门经理、稽核室各一份）。2.项目负责人、部门经理或公司领导任何一人认为项目须经公司技术负责人审批的，均在工作交办单或本表内签署意见，由公司技术负责人审定批准后实施。";
    const parentMethods = {
      handleChangePlanVisible: this.handleChangePlanVisible,
    };
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange: this.handleChange,
      multiple: true,
    };
    const onValidateForm = e => {
      e.preventDefault();
    };
    const columns1 = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '分工内容',
        dataIndex: 'body',
      },
      {
        title: '备注',
        dataIndex: 'remake',
      },
    ];
    const columns2 = [
      {
        title: '阶段',
        dataIndex: 'name',
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
      },
      {
        title: '计划',
        dataIndex: 'remake',
      },
      {
        title: '操作',
        dataIndex: 'action',
      },
    ];
    return (
      <div>
        <Form layout="horizontal" className={styles.stepForm}>

          <Row className={styles['fn-mb-15']}>
            <Col span={12} >
              <Form.Item {...formItemLayout} label="项目名称">
                {getFieldDecorator('name', {
                  rules: [{ required: false, message: '项目名称' }],
                })(
                  <Input
                    placeholder="项目名称"
                    style={{ width: 150 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label='项目计划编号'>
                {getFieldDecorator('code')(
                  <Input  style={{ width: 150 }} placeholder="项目计划编号" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={12} >
              <Form.Item {...formItemLayout} label="项目总投资">
                {getFieldDecorator('touzi', {
                  rules: [{ required: false, message: '项目总投资' }],
                })(
                  <Input
                    placeholder="项目总投资"
                    style={{ width: 150 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label='实施方案编制依据'>
                {getFieldDecorator('touziyiju')(
                  <Input style={{ width: 150 }} placeholder="咨询合同、操作规范及委托人各项要求" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={21} pull={3}>
              <Form.Item {...formItemLayout} label="咨询范围、咨询目标">
                {getFieldDecorator('name', {
                  rules: [{ required: false, message: '咨询范围、咨询目标' }],
                })(
                  <Input  placeholder="填写内容与交办单一致" style={{width:'100%'}} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={12} >
              <Form.Item {...formItemLayout} label="项目负责人">
                {getFieldDecorator('fuzeren', {
                  rules: [{ required: false, message: '项目负责人' }],
                })(
                  <Input
                    placeholder="项目负责人"
                    style={{ width: 150 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="咨询报告初稿时间">
                {getFieldDecorator('touziyiju')(
                  <Input style={{ width: 150 }} placeholder="咨询报告初稿时间" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={12} >
              <Form.Item {...formItemLayout} label="编制日期">
                {getFieldDecorator('banzhidate', {
                  rules: [{ required: false, message: '编制日期' }],
                })(
                  <Input
                    placeholder="编制日期"
                    style={{ width: 150 }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={24} >
              <Form.Item label="咨询操作过程中重点、难点的具体实施措施">
                {getFieldDecorator('banzhidate', {
                  rules: [{ required: false, message: '咨询操作过程中重点、难点的具体实施措施' }],
                })(
                  <TextArea
                    placeholder="咨询操作过程中重点、难点的具体实施措施"
                    style={{ width: "100%" }}
                    rows={4}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">咨询人员组成及分工:</Divider>
          <Row>
            <Col>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={mockData}
                columns={columns1}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="项目实施计划安排">
                {getFieldDecorator('anpai', {
                  rules: [{ required: false, message: '项目实施计划安排' }],
                  initialValue: tableData,
                })(
                  <TableForm />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col>
              <Collapse defaultActiveKey={['1']} >
                <Panel header="审批意见" key="1">
                  <Form.Item label="部门经理审批意见">
                    {getFieldDecorator('banzhidate', {
                      rules: [{ required: false, message: '部门经理审批意见' }],
                    })(
                      <TextArea
                        placeholder="部门经理审批意见"
                        style={{ width: "100%" }}
                        rows={2}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="企业领导审批意见">
                    {getFieldDecorator('banzhidate', {
                      rules: [{ required: false, message: '企业领导审批意见' }],
                    })(
                      <TextArea
                        placeholder="企业领导审批意见"
                        style={{ width: "100%" }}
                        rows={2}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="技术负责人审批意见">
                    {getFieldDecorator('banzhidate', {
                      rules: [{ required: false, message: '技术负责人审批意见' }],
                    })(
                      <TextArea
                        placeholder="技术负责人审批意见"
                        style={{ width: "100%" }}
                        rows={2}
                      />
                    )}
                  </Form.Item>
                </Panel>
              </Collapse>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="注">
                {getFieldDecorator('anpai', {
                  rules: [{ required: false, message: '注' }],
                })(
                  <p>{pVal}</p>
                )}
              </Form.Item>
            </Col>
          </Row>
         {/* <Row>
            <Col span={23} push={3}>
              <Upload {...props} fileList={this.state.fileList}>
                <Button>
                  <Icon type="upload" /> 上传方案
                </Button>
              </Upload>
            </Col>
          </Row>*/}
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
            <Button type="primary" style={{ marginLeft: 8, left: 400 }}>
              预览
            </Button>
            <Button type="primary" style={{ marginLeft: 8, left: 400 }}>
              提交
            </Button>
            <Button type="primary" onClick={() => this.handleChangePlanVisible(true)} loading={submitting} style={{ marginLeft: 8, left: 400 }}>
              变更
            </Button>
          </Form.Item>
        </Form>
        <ChangePlanModal {...parentMethods} changePlanVisible={changePlanVisible} />
      </div>
    );
  }
}

export default connect(({ project, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  project,
  loading: loading.models.project,
}))(Step4);

