import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Transfer,
  Modal,
  Icon,
  message,
  Popover,
  Tree,
  Collapse,
  Tabs,
  Button,
  Checkbox,
  Upload,
  Divider,
} from 'antd';
import { connect } from 'dva';
import ProcedureList from '../../../Contract/ProcedureProject';
import styles from '../../list/Style.less';

const mockData = [];
for (let i = 0; i < 10; i += 1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
}
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
const { Search } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TreeNode } = Tree;
const { Option } = Select;
const { TextArea } = Input;
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

class ApprovalManage extends PureComponent {
  state = {
    width: '90%',
    selectedKeys: [],
    targetKeys: [],
    BillSourceOptionData: [],  // 业务来源类型option
    BillSourceValue:``,
    ProTypeOptionData: [], // 项目类型option
    ProTypeValue: ``,
  };
  componentDidMount() {
    this.handleBillSourceOption();
    this.handleProTypeOption();
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  };
  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  // 根据数据中的数据，动态加载业务来源的Option
  handleBillSourceOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/getDict', // 接口
      payload: {
        dictTypeId: 'be407dc3eefc11e89655186024a65a7c', // 数据类型id
      },
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            BillSourceOptionData: res.data.list, // 返回结果集给对应的状态
          });
        }
      },
    });
  };

  // 根据数据中的数据，动态加载业务来源的Option
  handleProTypeOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/getDict', // 接口
      payload: {
        dictTypeId: '1821fe9feef711e89655186024a65a7c', // 数据类型id
      },
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            ProTypeOptionData: res.data.list, // 返回结果集给对应的状态
          });
        }
      },
    });
  };

  // 获取业务来源的Option的value对应的name
  handleGetBillSourceValue = (val) =>{
    console.log(val);
    this.state.BillSourceOptionData.forEach(item =>{
      if (val === item.id) {
        this.setState({
          BillSourceValue: item.name,
        });
      }
    });
  };

  // 获取项目类型的Option的value对应的name
  handleProTypeSourceValue = (val) =>{
    console.log(val);
    this.state.ProTypeOptionData.forEach(item =>{
      if (val === item.id ){
        this.setState({
          ProTypeValue: item.name,
        });
      }
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
    const { form, dispatch, submitting, messageInfoVisible, handleMessageInfoVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { selectedKeys, BillSourceValue, ProTypeValue } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
          handleMessageInfoVisible(false);
        }
      });
    };
    const cancel = () => {
       handleMessageInfoVisible(false);
    };
    return (
      <div>
        <Card>
          <Form layout="horizontal">
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <Icon type="copy" />项目基本信息
                  </span>
                }
                key="1"
              >
                <Card>
                  <Row>
                    <Col span={23}>
                      <Form.Item {...formItemLayout} label={fieldLabels.name}>
                        {getFieldDecorator('name', {
                          rules: [{ required: false, message: '请输入项目名称' }],
                        })(
                          <Input placeholder="请输入项目名称" style={{width:'140%'}} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.type}>
                        {getFieldDecorator('type', {
                          rules: [{ required: false, message: '请选择项目类别' }],
                        })(
                          <Select
                            onChange={this.handleProTypeSourceValue}
                            placeholder="请选择项目类别"
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.years}>
                        {getFieldDecorator('year', {
                          rules: [{ required: false, message: '请选择年度' }],
                          initialValue: '2018',
                        })(
                          <Input  placeholder="请选择年度"  />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.status}>
                        {getFieldDecorator('status', {
                          rules: [{ required: false, message: '请选择项目状态' }],
                          initialValue: '新建',
                        })(
                          <Input  placeholder="请选择项目状态" />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="项目编号">
                        {getFieldDecorator('number', {
                          rules: [{ required: false, message: '请输入项目编码' }],
                        })(
                          <Input  placeholder="自动带出" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.customer}>
                        {getFieldDecorator('customer', {
                          rules: [{ required: false, message: '请选择客户' }],
                        })(
                          <Search placeholder="请选择客户" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="客户联系人">
                        {getFieldDecorator('linkman', {
                          rules: [{ required: false, message: '请选择客户联系人' }],
                        })(
                          <div>
                            <Input placeholder="请选择客户联系人"  />
                            <Divider type="vertical" className={styles['ant-verticalHz']} />
                            <a>新增联系人</a>
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="负责公司">
                        {getFieldDecorator('company', {
                          rules: [{ required: false, message: '负责公司' }],
                        })(
                          <Input  placeholder="负责公司" style={{ width: '100%' }} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="项目负责人">
                        {getFieldDecorator('fzperson', {
                          rules: [{ required: false, message: '项目负责人' }],
                        })(
                          <Input  placeholder="负责公司" style={{ width: '100%' }} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="项目部门">
                        {getFieldDecorator('fzperson', {
                          rules: [{ required: false, message: '项目部门' }],
                        })(
                          <Input  placeholder="自动带出" style={{ width: '100%' }} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.fee}>
                        {getFieldDecorator('fee', {
                          rules: [{ required: false, message: '请输入项目费用' }],
                        })(
                          <Input  placeholder="请输入项目费用" style={{ width: '100%' }} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="业务来源">
                        {getFieldDecorator('billSource', {
                          rules: [{ required: false, message: '业务来源' }],
                        })(
                          <Select
                            onChange={this.handleGetBillSourceValue}
                            placeholder="请选择业务来源"
                            style={{ width: 200 }}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {this.state.BillSourceOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    {
                      ( BillSourceValue === `合伙人`)&& (
                        <Col span={8}>
                          <Form.Item {...formItemLayout} label='合伙人'>
                            {getFieldDecorator('partner')(
                              <Input style={{ width: '100%' }} placeholder="合伙人" />
                            )}
                          </Form.Item>
                        </Col>
                      )
                    }
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label='施工单位'>
                        {getFieldDecorator('shigongdanwei',{
                        })(
                          <Search
                            placeholder="施工单位"
                            style={{ width: 200 }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label='合同编号'>
                        {getFieldDecorator('contractCode')(
                          <div>
                            <Input  style={{ width: '68%' }} placeholder="合同编号" />
                            <Divider type="vertical"  />
                            <a>新增合同</a>
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label='开始时间'>
                        {getFieldDecorator('startDate', {
                        })(
                          <Input  style={{ width: '100%' }} placeholder="请输入开始时间" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="结束时间">
                        {getFieldDecorator('endDate')(
                          <Input  style={{ width: '100%' }} placeholder="请输入结束时间" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="指派编号">
                        {getFieldDecorator('zhipaiCode')(
                          <Input
                            placeholder="指派编号+弹出项目指派列表"
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item {...formItemLayout} label={fieldLabels.biztype}>
                        {getFieldDecorator('biztype',{
                        })(
                          <Checkbox.Group style={{ width: '100%' }}>
                            <Row>
                              { ( ProTypeValue === `工程造价业务项目`|| ProTypeValue === `可研报告` ) && (
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
                              { ( ProTypeValue === `招标代理业务项目`|| ProTypeValue===`可研报告` ) && (
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
                  <Row>
                    <Col span={24}>
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
                  <Divider orientation="left">{ProTypeValue}</Divider>
                  { ( ProTypeValue === `工程造价业务项目` )&& (
                    <div>
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
                              <Input style={{ width: '100%' }} placeholder="合伙人" />
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
                    </div>
                  )}
                  { ( ProTypeValue === `可研报告` ) && (
                    <div>
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
                              <Input style={{ width: '100%' }} placeholder="合伙人" />
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
                    </div>
                  )}
                  { ( ProTypeValue === `招标代理业务项目`) && (
                    <div>
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
                    </div>
                  )}
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
                      <span>
                        <Button type="primary" loading={submitting} style={{ left: 400 }}>
                          保存
                        </Button>
                        <Button type="primary" onClick={() => this.handleSubmitProcessVisible(true)} style={{ marginLeft: 8, left: 400 }}>
                          提交
                        </Button>
                      </span>
                  </Form.Item>
                </Card>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="copy" />流程图
                  </span>
                }
                key="10"
              >
                <ProcedureList />
              </TabPane>
            </Tabs>
            <Collapse defaultActiveKey={['2']} >
              <Panel header="审批意见" key="2">
                <Row>
                  <Col lg={12} md={24} sm={24}>
                    <Form.Item {...formItemLayout} label="父组件id">
                      {getFieldDecorator('visitors', {
                        rules: [{ required: false, message: '父组件id' }],
                      })(
                        <Input placeholder="请选择拜访对象" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={24} sm={24}>
                    <Form.Item {...formItemLayout} label="父组件linkman">
                      {getFieldDecorator('visitors', {
                        rules: [{ required: false, message: '父组件linkman' }],
                      })(
                        <Input placeholder="请选择拜访对象" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={24} sm={24}>
                    <Form.Item {...formItemLayout} label="父组件name">
                      {getFieldDecorator('visitors', {
                        rules: [{ required: false, message: '父组件name' }],
                      })(
                        <Input placeholder="请选择拜访对象" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={24} sm={24}>
                    <Form.Item {...formItemLayout} label="父组件number">
                      {getFieldDecorator('visitType', {
                        rules: [{ required: false, message: '父组件number' }],
                      })(
                        <Input placeholder="请选择拜访方式" />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
            <Form.Item
              style={{ marginBottom: 8 ,marginTop: 20 }}
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
              <span>
                <Button type="primary" style={{ left: 400 }} >同意审批</Button>
                <Button type="primary" style={{ marginLeft: 8, left: 400 }} >不同意审批</Button>
                <Button type="primary" style={{ marginLeft: 8, left: 400 }} >退回</Button>
                <Button type="primary" style={{ marginLeft: 8, left: 400 }} >取消</Button>
              </span>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ApprovalManage));
