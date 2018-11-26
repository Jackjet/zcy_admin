import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Input,
  Modal,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import {message} from "antd/lib/index";

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

class ContractAddModal extends PureComponent {
  state = {
    width: '100%',
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
  render() {
    const { form, dispatch, proAssignAddVisible, handleProAssignAddVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll} = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'projectAssignment/add',
            payload: values,
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
                  <Form.Item {...formItemLayout} label={fieldLabels.projectCode}>
                    {getFieldDecorator('number', {
                      rules: [{ required: true, message: '请输入指派编码' }],
                    })(
                      <Input placeholder="请输入指派编码" style={{width:'100%'}} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label={fieldLabels.projectName}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入项目名称' }],
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
                    })(
                      <Search placeholder="请选择部门经理" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="项目经理">
                    {getFieldDecorator('projectId', {
                      rules: [{ required: false, message: '项目经理' }],
                    })(
                      <Search placeholder="请选择项目经理" />
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
        </div>
      </Modal>

    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ContractAddModal));
