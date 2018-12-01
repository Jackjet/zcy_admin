import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Input,
  Modal,
  Checkbox,
  message,
} from 'antd';
import { connect } from 'dva';
import ExecutorModal from '../projectAssign/ExecutorModal';
import styles from '../projectAssign/style.less';


const { Search } = Input;
const { TextArea } = Input;
const fieldLabels = {
  projectCode:'指派编码',
  projectType:'项目类别',
  projectName:'项目名称',
  year:'年度',
  explain:'说明',
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

class ProAssignAddModal extends PureComponent {
  state = {
    width: '100%',
    showPartnerVisible: false,
    executorVisible: false,
    rowInfo:{},
    executorMsg:``,
    proMsg:``,
    deptMsg:``,
    deptVal:``,
    proVal:``,
    inputParamName:``,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  showPartner = (e) => {
    this.setState({
      showPartnerVisible: !e.target.value,
    })
  };

  handleGetExecutorMsg = (text) => {
    this.setState({
      executorMsg: text,
    });
  };

  // 控制项目信息弹窗
  handleProMsg = (arrayList) => {
    this.setState({
      proMsg: arrayList[0].name,
      proVal: arrayList[0].number,
    });
  };

  // 控制部门信息弹窗
  handleDeptMsg = (arrayList) => {
    this.setState({
      deptMsg: arrayList[0].name,
      deptVal: arrayList[0].number,
    });
  };

  // 控制项目信息弹窗
  handleExecutorVisible = (flag) => {
    this.setState({
      executorVisible: !!flag,
    });
  };

  /*handeleChangePartnerName = () => {
    if(this.props.proAssignInfo.partner === "16666666666") {
      return "职员";
    }
  };*/

  // 根据当前行的id, 查询对应的项目信息
  GetMsgVisible = (flag, obj) => {
    this.setState({
      executorVisible: !!flag,
      inputParamName: obj,
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
    const { form, dispatch, newProAssignAddVisible, handleNewProAssignVisible, proAssignInfo }  = this.props;
    const { showPartnerVisible, executorVisible, executorMsg, deptMsg, proMsg, inputParamName } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll} = form;
    const parentMethods = {
      handleExecutorVisible: this.handleExecutorVisible,
      handleGetExecutorMsg: this.handleGetExecutorMsg,
      handleDeptMsg: this.handleDeptMsg,
      handleProMsg: this.handleProMsg,

    };
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        const valiValues = {
          ...values,
          uid: JSON.parse(localStorage.getItem("user")).id,
          leaderId: this.state.deptVal,
          proManagerId: this.state.proVal,
          partner: values.partner === "职员"?"16666666666":values.partner === "分管领导"?"18888888888":values.partner === "15857112486"?"项目经理" :"",
        };
        if (!error) {
          // submit the values
          dispatch({
            type: 'projectAssignment/add',
            payload: valiValues,
            callback: (res) => {
              if(res.meta.status === '000000' ) {
                handleNewProAssignVisible(false, null);
              } else {
                message.error(res.meta.errmsg);
              }
            },
          });
        }
      });
    };
    const resetDate = () =>{
      console.log(this.props.proAssignInfo);
      handleNewProAssignVisible(false, null);
      this.setState({
        showPartnerVisible: false,
        executorMsg: ``,
        deptMsg: ``,
        proMsg: ``,
      })
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="新增项目指派"
        style={{top:20}}
        visible={newProAssignAddVisible}
        width="35%"
        maskClosable={false}
        onOk={validate}
        onCancel={resetDate}
        onText="提交"
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label={fieldLabels.projectName}>
                    {getFieldDecorator('name', {
                      rules: [{ required: false, message: '请输入项目名称' }],
                      initialValue: proAssignInfo == null? "" : proAssignInfo.name,
                    })(
                      <Input placeholder="请输入项目名称" style={{width:'100%'}} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="部门经理">
                    {getFieldDecorator('departmentId', {
                      rules: [{ required: false, message: '部门经理' }],
                      initialValue: deptMsg,
                    })(
                      <Search
                        readOnly
                        placeholder="部门经理"
                        onSearch={() => this.GetMsgVisible(true,"departmentId")}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="项目经理">
                    {getFieldDecorator('projectId', {
                      rules: [{ required: false, message: '项目经理' }],
                      initialValue: proMsg,
                    })(
                      <Search
                        readOnly
                        placeholder="项目经理"
                        onSearch={() => this.GetMsgVisible(true,"projectId")}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="配合项目经理">
                    {getFieldDecorator('cooperateManager', {
                      rules: [{ required: false, message: '配合项目经理' }],
                      initialValue: proAssignInfo == null? "" :  proAssignInfo.partner === "16666666666"?"职员":proAssignInfo.partner === "18888888888"?"分管领导":"项目经理",
                    })(
                      <Search
                        readOnly
                        placeholder="配合项目经理"
                        onSearch={() => this.GetMsgVisible(true)}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label={fieldLabels.explain}>
                    {getFieldDecorator('explain', {
                      rules: [{ required: false, message: '说明' }],
                    })(
                      <TextArea placeholder="请输入说明" rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <ExecutorModal  {...parentMethods} executorVisible={executorVisible} inputParamName={inputParamName} />
        </div>
      </Modal>

    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ProAssignAddModal));
