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

class CusApplyEditModal extends PureComponent {
  state = {
    width: '100%',
    linkmanOption: [],
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
    const { form, dispatch, cusApplyEditVisible, handleCusApplyEditVisible, rowInfo } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { linkmanOption } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'cusApplication/update',
            payload: {
              ...values,
              id: rowInfo.id,
              key: rowInfo.key,
              uid: JSON.parse(localStorage.getItem("user")).id,
            },
            callback: (res) => {
              if(res.meta.status === '000000' ) {
                dispatch({
                  type: 'cusApplication/fetch',
                  payload: {},
                });
                handleCusApplyEditVisible(false);
                message.success('编辑完成!');
                if (values.status === 2) {
                  dispatch({
                    type: 'cusInfoManage/add',
                    payload:{
                      ...values,
                      id: rowInfo.id,
                      key: rowInfo.key,
                      uid: JSON.parse(localStorage.getItem("user")).id,
                    },
                  })
                }
              } else {
                message.error(res.meta.errmsg);
              }
            },
          });
        }
      });
    };
    const onCancel = () => {
      handleCusApplyEditVisible(false);
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="客户申请单信息编辑"
        style={{ top: 20 }}
        visible={cusApplyEditVisible}
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
                    initialValue: rowInfo.number,
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
                    initialValue: rowInfo.name,
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
                    initialValue: rowInfo.linkmanTypeId,
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
                    initialValue: rowInfo.status,
                  })(
                    <Select  placeholder="默认待审核" style={{ width: 200 }} >
                      <Option key={0} value={0}>待审核</Option>
                      <Option key={1} value={1}>审核中</Option>
                      <Option key={2} value={2}>已审核</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={16} offset={4}>
                <Form.Item {...formItemLayout} label={fieldLabels.cusApplyContacts}>
                  {getFieldDecorator('linkman', {
                    rules: [{ required: false, message: '请输入联系人' }],
                    initialValue: rowInfo.linkman,
                  })(<Input placeholder="请输入联系人" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={16} offset={4}>
                <Form.Item {...formItemLayout} label={fieldLabels.cusApplyMobilePhone}>
                  {getFieldDecorator('phone', {
                    rules: [{ required: false, message: '请输出联系电话' }],
                    initialValue: rowInfo.phone,
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
export default connect(() => ({}))(Form.create()(CusApplyEditModal));
