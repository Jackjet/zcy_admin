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
    ProTypeOptionData: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleProTypeOption();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

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
  }; // 根据数据中的数据，动态加载业务来源的Option

  handleProTypeSourceValue = (val) =>{
    console.log(this.state.ProTypeOptionData.id);
    console.log(val);
    if (val === this.state.ProTypeOptionData.id ){
      this.setState({
        ProTypeValue: this.state.ProTypeOptionData.name,
      });
    }
  }; // 获取业务来源的Option的值

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
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
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles["row-h"]}>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '请选择年度' }],
                    })(
                      <Select
                        onChange={this.handleProTypeSourceValue}
                        placeholder="请选择项目类别"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
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
}))(Form.create()(SubmitProcessModal));
