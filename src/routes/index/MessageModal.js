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
} from 'antd';
import { connect } from 'dva';
import ProcedureList from '../Contract/ProcedureProject';
import styles from './style.less';

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
    sm: { span: 12 },
    md: { span: 10 },
  },
};

class MessageModal extends PureComponent {
  state = {
    width: '90%',
    selectedKeys: [],
    targetKeys: [],
  };
  componentDidMount() {

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
    const { selectedKeys } = this.state;
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
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="项目信息审批"
        style={{ top: 20 }}
        // 对话框是否可见
        visible={messageInfoVisible}
        width="80%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={cancel}
        footer={
          <span>
            <Button type="primary" onClick={validate}>同意审批</Button>
            <Button type="primary" onClick={validate}>不同意审批</Button>
            <Button type="primary" onClick={validate}>退回</Button>
            <Button type="primary" onClick={cancel}>取消</Button>
          </span>
        }  // 在button外面加上数据，会报迭代没有设置key属性值
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Collapse defaultActiveKey={['1']} >
                <Panel header="信息及流程图" key="1">
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={
                        <span>
                          <Icon type="copy" />项目基本信息
                        </span>
                      }
                      key="1"
                    >
                      <div>
                        <Card>
                          <Row>
                            <Col span={23} pull={5}>
                              <Form.Item {...formItemLayout} label={fieldLabels.name}>
                                {getFieldDecorator('name', {
                                  rules: [{ required: true, message: '请输入项目名称' }],
                                })(
                                  <Input
                                    readOnly
                                    placeholder="请输入项目名称"
                                    className={styles['ant-input-lg']}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.type}>
                                {getFieldDecorator('type', {
                                  rules: [{ required: true, message: '请选择项目类别' }],
                                })(
                                  <Input readOnly placeholder="请选择项目类别" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.years}>
                                {getFieldDecorator('years', {
                                  rules: [{ required: true, message: '请选择年度' }],
                                })(
                                  <Input readOnly placeholder="请选择年度" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.status}>
                                {getFieldDecorator('status', {
                                  rules: [{ required: true, message: '请选择项目状态' }],
                                })(
                                  <Input readOnly placeholder="请选择项目状态" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.number}>
                                {getFieldDecorator('number', {
                                  rules: [{ required: false, message: '请输入项目编码' }],
                                })(
                                  <Input readOnly placeholder="请输入项目编码" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.customer}>
                                {getFieldDecorator('customer', {
                                  rules: [{ required: true, message: '请选择客户' }],
                                })(
                                  <Input readOnly placeholder="请选择客户" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.cuslink}>
                                {getFieldDecorator('cuslink', {
                                  rules: [{ required: true, message: '请选择客户联系人' }],
                                })(
                                  <Input readOnly placeholder="请选择客户联系人" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.fzcompany}>
                                {getFieldDecorator('fzcompany', {
                                  rules: [{ required: true, message: '负责公司' }],
                                })(
                                  <Input readOnly placeholder="负责公司" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.fzperson}>
                                {getFieldDecorator('fzperson', {
                                  rules: [{ required: true, message: '项目负责人' }],
                                })(
                                  <Input readOnly placeholder="负责公司" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.fee}>
                                {getFieldDecorator('fee', {
                                  rules: [{ required: true, message: '请输入项目费用' }],
                                })(
                                  <Input readOnly placeholder="请输入项目费用" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.startdate}>
                                {getFieldDecorator('startdate')(
                                  <Input
                                    readOnly
                                    style={{ width: 200 }}
                                    placeholder="请输入开始日期"
                                  />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label={fieldLabels.enddate}>
                                {getFieldDecorator('enddate')(
                                  <Input
                                    readOnly
                                    style={{ width: 200 }}
                                    placeholder="请输入结束日期"
                                  />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8} />
                          </Row>
                          <Row>
                            <Col span={23} pull={5}>
                              <Form.Item {...formItemLayout} label={fieldLabels.biztype}>
                                {getFieldDecorator('biztype')(
                                  <Checkbox.Group readOnly style={{ width: '100%' }}>
                                    <Row>
                                      <Col span={8}>
                                        <Checkbox value="A">预算编制</Checkbox>
                                      </Col>
                                      <Col span={8}>
                                        <Checkbox value="B">结算编制</Checkbox>
                                      </Col>
                                      <Col span={8}>
                                        <Checkbox value="C">建设工程招标代理</Checkbox>
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
                                        <Checkbox value="G">政府采购招标代理</Checkbox>
                                      </Col>
                                      <Col span={8}>
                                        <Checkbox value="H">咨询报告</Checkbox>
                                      </Col>
                                    </Row>
                                  </Checkbox.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={23} pull={5}>
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
                        </Card>
                      </div>
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
                </Panel>
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
}))(Form.create()(MessageModal));
