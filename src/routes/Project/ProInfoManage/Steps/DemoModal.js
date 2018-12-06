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
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const mockData = [];
for (let i = 0; i < 10; i += 1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
}
const { TreeNode } = Tree;
const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  visitors: '拜访对象',
  visitType: '拜访方式',
  connectBusiness: '关联商机',
  visitDate: '拜访日期',
  communication: '交流内容',
  participants: '参与人员',
  remarks: '备注',
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

class DemoModal extends PureComponent {
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
    const { form, dispatch, submitting, visitAddVisible, handleVisitAddVisible } = this.props;
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
          handleVisitAddVisible(false);
        }
      });
    };
    const cancel = () => {
      handleVisitAddVisible(false);
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="人员"
        style={{ top: 20 }}
        visible={visitAddVisible}
        width="80%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={cancel}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col lg={12} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.visitors}>
                    {getFieldDecorator('visitors', {
                      rules: [{ required: false, message: '请选择拜访对象' }],
                    })(
                      <Select placeholder="请选择拜访对象">
                        <Option value="0">电话来访</Option>
                        <Option value="1">客户介绍</Option>
                        <Option value="2">老客户</Option>
                        <Option value="3">代理商</Option>
                        <Option value="4">合作伙伴</Option>
                        <Option value="5">公开招聘</Option>
                        <Option value="6">互联网</Option>
                        <Option value="7">自主开发</Option>
                        <Option value="8">其他</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.visitType}>
                    {getFieldDecorator('visitType', {
                      rules: [{ required: false, message: '请选择拜访方式' }],
                    })(
                      <Select placeholder="请选择拜访方式">
                        <Option value="0">电话来访</Option>
                        <Option value="1">现场拜访</Option>
                        <Option value="8">其他</Option>
                      </Select>
                    )}
                  </Form.Item>
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
}))(Form.create()(DemoModal));
