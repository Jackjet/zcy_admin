import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Modal,message } from 'antd';
import { connect } from 'dva';
import styles from './style.less';


const { TextArea } = Input;
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

class RoleManageAddModal extends PureComponent {
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
    const {
      form,
      dispatch,
      RoleManageAddVisible,
      handleRoleManageAddVisible,
      currentPagination,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          console.log(values);
          dispatch({
            type: 'role/add',
            payload:{
              ...values,
              uid: JSON.parse(localStorage.getItem("user")).id,
            },
            callback:(res) => {
              if (res.meta.status !== "000000"){
                message.error(res.data.alert_msg);
              } else {
                dispatch({
                  type: 'role/fetch',
                  payload: {
                    page:1,
                    pageSize:currentPagination.pageSize,
                  },
                });
                handleRoleManageAddVisible(false);
              }
            },
          });
        }
      });
    };
    const cancel = () => {
      handleRoleManageAddVisible(false);
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="角色信息新增"
        style={{ top: 20 }}
        visible={RoleManageAddVisible}
        width="30%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancel}
        okText="提交"
      >
        <Card>
          <Form layout="horizontal">
            <Row className={styles['fn-mb-15']}>
              <Col span={23} pull={1}>
                <Form.Item {...formItemLayout} label="编码">
                  {getFieldDecorator('number', {
                    rules: [{ required: true, message: '自动生成' }],
                  })(<Input placeholder="自动生成" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={23} pull={1}>
                <Form.Item {...formItemLayout} label="名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入名称' }],
                  })(<Input placeholder="请输入名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={23} pull={1}>
                <Form.Item {...formItemLayout} label="说明">
                  {getFieldDecorator('remark', {
                    rules: [{ required: true, message: '请输入说明' }],
                  })(<TextArea placeholder="请输入说明" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default connect(() => ({
}))(Form.create()(RoleManageAddModal));
