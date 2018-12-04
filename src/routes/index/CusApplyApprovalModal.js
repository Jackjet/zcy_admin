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

class CusApplyApprovalModal extends PureComponent {
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
    const { form, dispatch, submitting, cusApplyApprovalVisible, cusApplyInfo, handleCusApplyApprovalVisible } = this.props;
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
          handleCusApplyApprovalVisible(false, null);
        }
      });
    };
    const cancel = () => {
      handleCusApplyApprovalVisible(false, null);
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="客户信息审批"
        style={{ top: 20 }}
        // 对话框是否可见
        visible={cusApplyApprovalVisible}
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
                <Panel header="基本信息及流程" key="1">
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={
                        <span>
                          <Icon type="copy" />客户基本信息
                        </span>
                      }
                      key="1"
                    >
                      <div>
                        <Card>
                          <Row className={styles['fn-mb-15']}>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label="客户编码">
                                {getFieldDecorator('number', {
                                  rules: [{ required: false, message: '请输入客户编码' }],
                                  initialValue:cusApplyInfo === null ? "" : cusApplyInfo.number,
                                })(
                                  <Input placeholder="新增自动产生" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label="客户名称">
                                {getFieldDecorator('name', {
                                  rules: [{ required: false, message: '请输入客户名称' }],
                                  initialValue:cusApplyInfo === null ? "" : cusApplyInfo.name,
                                })(
                                  <Input
                                    onMouseEnter={this.handleLevelChange}
                                    placeholder="请输入客户名称"
                                    style={{ width: 200 }}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label="联系人业务性质">
                                {getFieldDecorator('linkmanTypeId', {
                                  rules: [{ required: true, message: '请选择联系人业务性质' }],
                                  initialValue:cusApplyInfo === null ? "" : cusApplyInfo.linkmanTypeId,
                                })(
                                  <Input placeholder="请选择联系人业务性质" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row className={styles['fn-mb-15']}>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label="状态">
                                {getFieldDecorator('status', {
                                  rules: [{ required: false, message: '状态' }],
                                  initialValue:cusApplyInfo === null ? "" : cusApplyInfo.status,
                                })(
                                  <Input readOnly placeholder="默认待审核" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label="联系人">
                                {getFieldDecorator('linkman', {
                                  rules: [{ required: false, message: '请输入联系人' }],
                                  initialValue:cusApplyInfo === null ? "" : cusApplyInfo.linkman,
                                })(
                                  <Input placeholder="请输入联系人" style={{ width: 200 }} />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item {...formItemLayout} label="联系电话">
                                {getFieldDecorator('phone', {
                                  rules: [{ required: false, message: '请输出联系电话' }],
                                  initialValue:cusApplyInfo === null ? "" : cusApplyInfo.phone,
                                })(
                                  <Input placeholder="请输出联系电话" style={{ width: 200 }} />
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
}))(Form.create()(CusApplyApprovalModal));
