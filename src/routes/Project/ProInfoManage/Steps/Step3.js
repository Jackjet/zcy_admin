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
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './style.less';
import NotFound from "../../../Exception/404";
import {getRoutes} from "../../../../utils/utils";
import {message} from "antd/lib/index";

const BillTable = ['建设项目造价咨询工作交办单','委托人提供资料交接清单','工程咨询过程资料交接登记表'];
const mockData = [];
for (let i = 0; i < 10; i+=1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
};
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { TextArea } = Input;
const { TreeNode } = Tree;
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
@Form.create()
class Step3 extends React.PureComponent {
  state = {
    BillTableOptionTable:``,
    selectedRows: '',
  };

  componentDidMount() {
    this.handleBillTableOptionTable();
    this.props.dispatch({
      type: 'dict/fetch',
      payload: {
        dictTypeId: '75fee2a2f7dc11e8a95800ff3d8180ed',
      },
      callback: res => {
        if (res.meta.status !== '000000') {
          message.error(res.meta.errmsg); // 返回错误信息
        }
      },
    });
  }

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
      dictTypeId: '75fee2a2f7dc11e8a95800ff3d8180ed',
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'dict/fetch',
      payload: params,
    });
  };

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

  render() {
    const { dict: { data }, dispatch, submitting, form, loading} = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { BillTableOptionTable, selectedRows } = this.state;
    const pVal = "我方提供的下述资料是真实、合法、完整的，愿意承担提供资料失实等责任。";
    const uploadProps = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList:true,
      onChange:this.handleOnChange,
    };
    const columns = [{
      title: '序号',
      dataIndex: 'number',
      key: 'number',
      sorter: (a, b) => a.number < b.number,
    }, {
      title: '提供资料内容',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '份/册/页',
      dataIndex: 'version',
      key: 'version',
    }, {
        title: '是否原件',
        dataIndex: 'yuanjian',
        key: 'yuanjian',
    }, {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a>上传</a>
        </Fragment>
      ),
    }];

    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/submitStepForm',
            payload: {
              ...values,
            },
          });
          this.props.dispatch(routerRedux.push('/project/projectStart/process'));
        }
      });
    };

    return (
      <div>
        <Form layout="horizontal" className={styles.stepForm}>
          <Row className={styles['fn-mb-15']}>
            <Col span={8}>
              <Form.Item {...formItemLayout} label='委托人'>
                {getFieldDecorator('weituoperson', {
                  rules: [{ required: false, message: '委托人' }],
                })(
                  <Input placeholder="委托人" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayout} label='项目名称'>
                {getFieldDecorator('name', {
                  rules: [{ required: false, message: '项目名称' }],
                })(
                  <Input  placeholder="项目名称" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayout} label='资料交接清单'>
                {getFieldDecorator('companyName', {
                  rules: [{ required: false, message: '资料交接清单' }],
                })(
                  <div>
                    <Upload {...uploadProps}>
                      <Button>
                        <Icon type="upload" /> 上传
                      </Button>
                    </Upload>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={23} pull={5}>
              <Form.Item {...formItemLayout} label='委托方承诺'>
                {getFieldDecorator('chengnuo', {
                  rules: [{ required: false, message: '委托方承诺' }],
                })(
                  <p>{pVal}</p>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
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
            <Button type="primary" style={{ left: 400 }} >
              保存
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
export default connect(({ dict, loading }) => ({
  dict,
  loading: loading.models.dict,
}))(Form.create()(Step3));

