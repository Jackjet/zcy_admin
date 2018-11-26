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
  Steps,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Step } = Steps;
const { TreeNode } = Tree;
const { Option } = Select;
const { TextArea } = Input;
const steps = [
  { title: '经理审批', description: '这里是多信息的耶哦耶哦哦耶哦耶'},
  { title: '自校意见', description: '描述啊描述啊'},
  { title: '专业复核', description: '如需'},
  { title: '项目经理复核', description: '这里是多信息的描述啊'},
  { title: '部门复核', description: '如需'},
  { title: '稽核', description: '这里是多信息的描述啊'},
  { title: '技术负责人', description: '这里是多信息的描述啊'},
  { title: '行政复核（分管领导）', description: '这里是多信息的描述啊'},
  ];
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

class SubmitProcessModal extends PureComponent {
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

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  handelDescription() {
    const { dispatch } = this.props;
    return (
      <Select placeholder="请选择对象" style={{ width: 100 }}>
        <Option value="1">请选择</Option>
        <Option value="2">对象A</Option>
        <Option value="3">对象B</Option>
        <Option value="4">对象C</Option>
      </Select>
    )
  };

  render() {
    const { form, dispatch, submitting, submitProcessVisible, handleSubmitProcessVisible } = this.props;
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
          message.success('添加成功');
          handleSubmitProcessVisible(false);
        }
      });
    };

    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="流程"
        style={{ top: 20 }}
        // 对话框是否可见
        visible={submitProcessVisible}
        width="100%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleSubmitProcessVisible(false)}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col>
                  <Steps current={1}>
                    {steps.map((item) => <Step title={item.title} description={this.handelDescription()} />)}
                  </Steps>
                </Col>
              </Row>
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
}))(Form.create()(SubmitProcessModal));
