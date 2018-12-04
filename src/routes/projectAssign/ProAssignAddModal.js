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
import ExecutorModal from './ExecutorModal';

import styles from './style.less';


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
    showPartnerVisible: 0,
    executorVisible: false,
    rowInfo:{},
    executorMsg:``,
    executorVal:``,
    deptMsg:``,
    deptVal:``,
    proMsg:``,
    proVal:``,
    inputParamName:``,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  // 勾选配合展示合伙人选择框
  showPartner = (e) => {
    if (e.target.value === true) {
      this.setState({
        showPartnerVisible: 0,
      })
    } else if (e.target.value === false) {
      this.setState({
        showPartnerVisible: 1,
      })
    }

  };

  // 获取合伙人的name和number
  handleGetExecutorMsg = (arrayList) => {
    this.setState({
      executorMsg: arrayList[0].name,
      executorVal: arrayList[0].number,
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

  // 控制合伙人信息弹窗
  handleExecutorVisible = (flag) => {
    this.setState({
      executorVisible: !!flag,
    });
  };

  // 根据当前行的id, 查询对应的项目信息
  GetMsgVisible = (flag, obj) => {
    this.props.dispatch({
      type: 'person/fetch',
      payload: {
        inputType: obj,
      },
    });
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
    const { form, dispatch, proAssignAddVisible, handleProAssignAddVisible } = this.props;
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
        if (!error) {
          // submit the values
          const valiValue = {
            ...values,
            uid: JSON.parse(localStorage.getItem("user")).id,
            leaderId: this.state.deptVal,
            proManagerId: this.state.proVal,
            partner: this.state.executorVal,
            isCooperate: this.state.showPartnerVisible,
          };
          dispatch({
            type: 'projectAssignment/add',
            payload: valiValue,
            callback: (res) => {
              if(res.meta.status === '000000' ) {
                handleProAssignAddVisible(false);
              } else {
                message.error(res.meta.errmsg);
              }
            },
          });
        }
      });
    };
    const resetDate = () =>{
      handleProAssignAddVisible(false);
      this.setState({
        showPartnerVisible: 0,
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
        visible={proAssignAddVisible}
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
                    })(
                      <Input placeholder="请输入项目名称" style={{width:'100%'}} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="部门经理">
                    {getFieldDecorator('leaderId', {
                      rules: [{ required: false, message: '部门经理' }],
                      initialValue: deptMsg,
                    })(
                      <Search
                        readOnly
                        placeholder="部门经理"
                        onSearch={() => this.GetMsgVisible(true, 'leaderId')}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="项目经理">
                    {getFieldDecorator('proManagerId', {
                      rules: [{ required: false, message: '项目经理' }],
                      initialValue: proMsg,
                    })(
                      <Search
                        readOnly
                        placeholder="项目经理"
                        onSearch={() => this.GetMsgVisible(true, 'proManagerId')}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="配合">
                    {getFieldDecorator('isCooperate', {
                      rules: [{ required: false, message: '配合' }],
                      initialValue: false,
                    })(
                      <Checkbox onChange={this.showPartner} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {(showPartnerVisible === 1 )&&(
                <Row className={styles['fn-mb-15']}>
                  <Col>
                    <Form.Item {...formItemLayout} label="合伙人">
                      {getFieldDecorator('partner', {
                        rules: [{ required: false, message: '合伙人' }],
                        initialValue: executorMsg,
                      })(
                        <Search
                          readOnly
                          placeholder="请选择合伙人"
                          onSearch={() => this.GetMsgVisible(true, 'partner')}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              )}
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
