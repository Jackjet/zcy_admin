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
  Button,
} from 'antd';
import { connect } from 'dva';
import ExecutorModal from './ExecutorModal';
import styles from './style.less';

const { Search } = Input;
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
    ProcOptionData: [],
    executorVisible: false,
    person1Disabled: true,
    person2Disabled: true,
    person3Disabled: true,
    person4Disabled: true,
    person5Disabled: true,
    person6Disabled: true,
    person7Disabled: true,
    person8Disabled: true,

    executorMsg: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleProcOption();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleProcOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/getDict', // 接口
      payload: {
        dictTypeId: 'f1dbc531f1ef11e88e960c54a52b2744', // 审批流程数据类型id
      },
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            ProcOptionData: res.data.list, // 返回结果集给对应的状态
          });
        }
      },
    });
  }; // 根据数据中的数据，动态加载业务来源的Option

  getSeqVal = () => {
    console.log(this.props.form.getFieldValue('seq1'))
  };

  handleGetExecutorMsg = (text) => {
    console.log(text);
    this.setState({
      executorMsg: text,
    });
  };

  handlePerson1DisabledChange = (flag) => {
    this.setState({ person1Disabled: flag });
  };
  handlePerson2DisabledChange = (flag) => {
    this.setState({ person2Disabled: flag });
  };
  handlePerson3DisabledChange = (flag) => {
    this.setState({ person3Disabled: flag });
  };
  handlePerson4DisabledChange = (flag) => {
    this.setState({ person4Disabled: flag });
  };
  handlePerson5DisabledChange = (flag) => {
    this.setState({ person5Disabled: flag });
  };
  handlePerson6DisabledChange = (flag) => {
    this.setState({ person6Disabled: flag });
  };
  handlePerson7DisabledChange = (flag) => {
    this.setState({ person7Disabled: flag });
  };
  handlePerson8DisabledChange = (flag) => {
    this.setState({ person8Disabled: flag });
  };

  handleExecutorVisible = (flag) => {
    this.setState({
      executorVisible: !!flag,
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
    const { form, dispatch, submitting, submitProcessVisible, handleSubmitProcessVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const {
      selectedKeys,
      executorVisible,
      person1Disabled,
      person2Disabled,
      person3Disabled,
      person4Disabled,
      person5Disabled,
      person6Disabled,
      person7Disabled,
      person8Disabled,
      executorMsg,
    } = this.state;
    const parentMethods = {
      handleExecutorVisible: this.handleExecutorVisible,
      handleGetExecutorMsg: this.handleGetExecutorMsg,
    };

    const validate = () => {
      validateFieldsAndScroll((error, values) => {

        console.log(values);

        const auditPersonVal = []; // 执行人id集合
        for (let i = 8; i<16; i+=1) {
          auditPersonVal.push({
            auditPerson:Object.values(values)[i],
          });
        }
        console.log(auditPersonVal);


        const seqVal = []; // 序号集合
        for (let i = 0; i<8; i+=1) {
          seqVal.push({
            seq:Object.keys(values)[i],
          });
        }
        console.log(seqVal);


        const nodeNameVal = []; // 节点名称集合
        for (let i = 0; i<8; i+=1) {
          nodeNameVal.push({
            nodeName:Object.values(values)[i],
          });
        }
        console.log(nodeNameVal);

        const arrayList=[]; // 返回结果集合
        for(let i=0; i<8; i+=1){
          arrayList.push({seq:seqVal[i].seq, nodeName:nodeNameVal[i].nodeName, auditPerson:auditPersonVal[i].auditPerson})
        }
        console.log(arrayList);
        /*const nodeName = nodeNameVal.map(item => {
          return (
            {nodeName: item, seq: values.seq, auditPerson: values.person1 }
          )
        });*/

        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功');
        }
      });
    };

    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="生成审批流程"
        style={{ top: 20 }}
        // 对话框是否可见
        visible={submitProcessVisible}
        width="100%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleSubmitProcessVisible(false)}
        okText="启动"
      >
        <div>
          <Card>
            <Button onClick={() => this.getSeqVal()}>test</Button>
            <Form layout="horizontal">
              <Row>
                <Col span={3}>
                  <Form.Item {...formItemLayout} >
                    {getFieldDecorator('seq1', {
                      rules: [{ required: false, message: 'seq1' }],
                    })(
                      <Select
                        onChange={() => this.handlePerson1DisabledChange(false)}
                        placeholder="请选择节点"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProcOptionData.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('seq2', {
                      rules: [{ required: false, message: 'seq2' }],
                    })(
                      <Select
                        onChange={() => this.handlePerson2DisabledChange(false)}
                        placeholder="请选择节点"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProcOptionData.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('seq3', {
                      rules: [{ required: false, message: 'seq3' }],
                    })(
                      <Select
                        onChange={() => this.handlePerson3DisabledChange(false)}
                        placeholder="请选择节点"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProcOptionData.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('seq4', {
                      rules: [{ required: false, message: 'seq4' }],
                    })(
                      <Select
                        onChange={() => this.handlePerson4DisabledChange(false)}
                        placeholder="请选择节点"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProcOptionData.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('seq5', {
                      rules: [{ required: false, message: 'seq5' }],
                    })(
                      <Select
                        onChange={() => this.handlePerson5DisabledChange(false)}
                        placeholder="请选择节点"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProcOptionData.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('seq6', {
                      rules: [{ required: false, message: 'seq6' }],
                    })(
                      <Select
                        onChange={() => this.handlePerson6DisabledChange(false)}
                        placeholder="请选择节点"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProcOptionData.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('seq7', {
                      rules: [{ required: false, message: 'seq7' }],
                    })(
                      <Select
                        onChange={() => this.handlePerson7DisabledChange(false)}
                        placeholder="请选择节点"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProcOptionData.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('seq8', {
                      rules: [{ required: false, message: 'seq8' }],
                    })(
                      <Select
                        onChange={() => this.handlePerson8DisabledChange(false)}
                        placeholder="请选择节点"
                        style={{ width: 150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {this.state.ProcOptionData.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles["row-h"]}>
                <Col span={3}>
                  <Form.Item {...formItemLayout} >
                    {getFieldDecorator('person1', {
                      rules: [{ required: false, message: 'person1' }],
                      initialValue: executorMsg.map(item => item.name),
                    })(
                      <Search
                        disabled={person1Disabled}
                        placeholder="input search text"
                        onSearch={() => this.handleExecutorVisible(true)}
                        style={{ width: 150 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('person2', {
                      rules: [{ required: false, message: 'person2' }],
                    })(
                      <Search
                        disabled={person2Disabled}
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ width: 150 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('person3', {
                      rules: [{ required: false, message: 'person3' }],
                    })(
                      <Search
                        disabled={person3Disabled}
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ width: 150 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('person4', {
                      rules: [{ required: false, message: 'person4' }],
                    })(
                      <Search
                        disabled={person4Disabled}
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ width: 150 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('person5', {
                      rules: [{ required: false, message: 'person5' }],
                    })(
                      <Search
                        disabled={person5Disabled}
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ width: 150 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('person6', {
                      rules: [{ required: false, message: 'person6' }],
                    })(
                      <Search
                        disabled={person6Disabled}
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ width: 150 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('person7', {
                      rules: [{ required: false, message: 'person7' }],
                    })(
                      <Search
                        disabled={person7Disabled}
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ width: 150 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('person8', {
                      rules: [{ required: false, message: 'person8' }],
                    })(
                      <Search
                        disabled={person8Disabled}
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ width: 150 }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <ExecutorModal {...parentMethods} executorVisible={executorVisible} />
        </div>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(SubmitProcessModal));
