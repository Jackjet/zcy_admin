import React, { PureComponent } from 'react';
import { Form, Col, Row, Input, Select, Modal, Card, message } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;
const fieldLabels = {
  cusApplyCode: '客户编号',
  cusApplyName: '客户名称',
  cusApplyNature: '联系人业务性质',
  cusApplyStatus: '状态',
  cusApplyMobilePhone: '移动电话',
  cusApplyContacts: '联系人',
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

class CusApplyAddModal extends PureComponent {
  state = {
    width: '100%',
    linkmanOption: [],
    currentUserInfo:JSON.parse(localStorage.getItem("user")),
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleLinkManTypeChange();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleLinkManTypeChange = () => {
    const {dispatch,handleLinkManType} = this.props;
    dispatch({
      type: 'cusApplication/getDict',
      payload: {
        dictTypeId: '3af03ec8ed4311e88ac1186024a65a7c',
      },
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          handleLinkManType(res.data.list);
          this.setState({
            linkmanOption: res.data.list,
          });
        }
      },
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
    const { form, dispatch, submitting, cusApplyAddVisible, handleCusApplyAddVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { linkmanOption } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
           if (values.linkmanTypeId === `请选择`) {
             message.warning("请选择业务联系人类别");
            return false;
           }
          // submit the values
          dispatch({
            type: 'cusApplication/add',
            payload: {
              ...values,
              status: 1,
              uid: this.state.currentUserInfo.id,
            },
            callback: (res) => {
              if(res.meta.status === '000000' ) {
                dispatch({
                  type: 'cusApplication/fetch',
                  payload: {
                    page: 1,
                    pageSize: 10,
                  },
                });
                handleCusApplyAddVisible(false);
                message.success('新增完成!');
              } else {
                message.error(res.meta.errmsg);
              }
              },
          });
        }
      });
    };
    const onCancel = () => {
      handleCusApplyAddVisible(false);
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="客户申请单信息新增"
        style={{ top: 20 }}
        visible={cusApplyAddVisible}
        width="40%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText="提交"
      >
        <Card>
          <Form layout="horizontal">
            <Row className={styles['fn-mb-15']}>
              <Col span={16} offset={4}>
                <Form.Item {...formItemLayout} label={fieldLabels.cusApplyCode}>
                  {getFieldDecorator('number', {
                    rules: [{ required: false, message: '请输入客户编码' }],
                  })(
                    <Input placeholder="新增自动产生" style={{ width: 200 }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={16} offset={4}>
                <Form.Item {...formItemLayout} label={fieldLabels.cusApplyName}>
                  {getFieldDecorator('name', {
                    rules: [{ required: false, message: '请输入客户名称' }],
                  })(
                    <Input
                      onMouseEnter={this.handleLevelChange}
                      placeholder="请输入客户名称"
                      style={{ width: 200 }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={16} offset={4}>
                <Form.Item {...formItemLayout} label={fieldLabels.cusApplyNature}>
                  {getFieldDecorator('linkmanTypeId', {
                    rules: [{ required: true, message: '请选择联系人业务性质' }],
                    initialValue:`请选择`,
                  })(
                    <Select placeholder="请选择联系人业务性质" style={{ width: 200 }}>
                      {linkmanOption.map((data) => <Option key={data.id} value={data.id}>{data.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={16} offset={4}>
                <Form.Item {...formItemLayout} label={fieldLabels.cusApplyStatus}>
                  {getFieldDecorator('status', {
                    rules: [{ required: false, message: '状态' }],
                    initialValue:`待审核`,
                  })(
                    <Input readOnly placeholder="默认待审核" style={{ width: 200 }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={16} offset={4}>
                <Form.Item {...formItemLayout} label={fieldLabels.cusApplyContacts}>
                  {getFieldDecorator('linkman', {
                    rules: [{ required: false, message: '请输入联系人' }],
                  })(<Input placeholder="请输入联系人" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={16} offset={4}>
                <Form.Item {...formItemLayout} label={fieldLabels.cusApplyMobilePhone}>
                  {getFieldDecorator('phone', {
                    rules: [{ required: false, message: '请输出联系电话' }],
                  })(
                    <Input placeholder="请输出联系电话" style={{ width: 200 }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}
export default connect(({ loading }) => ({
  submitting: loading.effects['cusInfoManage/add'],
}))(Form.create()(CusApplyAddModal));
