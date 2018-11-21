import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  Input,
  Popover,
  Modal,
  Cascader,
  Collapse,
  Select,
  message,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const linkmanTypeOption = {"1":"工程", "2":"招标", "3":"采购"};
const statusValue = ['待审核', '审核中', '已审核'];
const { Option } = Select;
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
    linkmanOptionData: ``,
    statusOptionDate:``,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleLinkManTypeChange();
    this.handleStatusChange();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleLinkManTypeChange = () => {
    const optionData = Object.values(linkmanTypeOption).map((data,index) => {
      const val = `${data}`;
      const keyNum = index;
      return <Option key={keyNum} value={keyNum}>{val}</Option>;
    });
    this.setState({
      linkmanOptionData: optionData,
    });
  };

  handleStatusChange = () => {
    const optionData = Object.values(statusValue).map((data,index) => {
      const val = `${data}`;
      const keyNum = index;
      return <Option key={keyNum} value={keyNum}>{val}</Option>;
    });
    this.setState({
      statusOptionDate: optionData,
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
    const {
      form,
      dispatch,
      submitting,
      cusApplyEditVisible,
      handleCusApplyEditVisible,
      rowInfo,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { linkmanOptionData, statusOptionDate } = this.state;
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
              status: values.status+1, // 测试状态
            },
            callback: (res) => {
              if(res.meta.status === '000000' ) {
                if(values.status+1 === 3 && rowInfo.status !== 3 ) { // 测试判断当前状态是否为已审核
                  this.props.dispatch({
                    type: 'cusInfoManage/add',
                    payload:{
                      ...values,
                      id: rowInfo.id,
                      key: rowInfo.key,
                    },
                  });
                }
                handleCusApplyEditVisible(false);
                this.props.dispatch({
                  type: 'cusApplication/fetch',
                  payload: {
                    page: this.state.pageCurrent,
                    pageSize: this.state.pageSizeCurrent,
                    keyWord: rowInfo.keyWord,
                  },
                });
                message.success("申请单更新成功!")
              } else {
                message.error(res.meta.errmsg);
              }
            },
          });

        }
      });
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
        onCancel={() => handleCusApplyEditVisible(false)}
      >
        <Card>
          <Form layout="horizontal">
            <Card>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="客户编码">
                    {getFieldDecorator('number', {
                      rules: [{ required: false, message: '请输入客户编码' }],
                      initialValue:rowInfo.number,
                    })(
                      <Input readOnly placeholder="新增自动产生" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="客户名称">
                    {getFieldDecorator('name', {
                      rules: [{ required: false, message: '请输入客户名称' }],
                      initialValue:rowInfo.name,
                    })(
                      <Input
                        placeholder="请输入客户名称"
                        style={{ width: 200 }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="联系人业务性质">
                    {getFieldDecorator('linkmanTypeId', {
                      rules: [{ required: false, message: '请选择联系人业务性质' }],
                      initialValue:Object.values(linkmanTypeOption)[rowInfo.linkmanTypeId],
                    })(
                      <Select placeholder="请选择联系人业务性质" style={{ width: 200 }}>
                        {linkmanOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="状态">
                    {getFieldDecorator('status', {
                      rules: [{ required: false, message: '状态' }],
                      initialValue:statusValue[rowInfo.status-1],
                    })(
                      <Select readOnly placeholder="默认待审核" style={{ width: 200 }} >
                        {statusOptionDate}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="联系人">
                    {getFieldDecorator('linkman', {
                      rules: [{ required: false, message: '请输入联系人' }],
                      initialValue:rowInfo.linkman,
                    })(<Input placeholder="请输入联系人" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="联系电话">
                    {getFieldDecorator('phone', {
                      rules: [{ required: false, message: '请输出联系电话' }],
                      initialValue:rowInfo.phone,
                    })(
                      <Input placeholder="请输出联系电话" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(CusApplyEditModal));
