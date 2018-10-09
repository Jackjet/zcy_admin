import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Modal } from 'antd';
import { connect } from 'dva';
import styles from './DictTypeAdd.less';
import {message} from "antd/lib/index";

const { TextArea } = Input;
const fieldLabels = {
  number: '客户编码',
  code: '编码',
  name: '客户名称',
  dateRange: '生效日期',
  remarks: '备注',
  dictType: '字典类别',
  dictName: '字典名称',
  status: '状态',
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

class DictTypeAdd extends PureComponent {
  state = {
    width: '90%',
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
    const { dispatch, modalVisible, form, handleAdd, handleModalVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功');
          form.resetFields();
          handleModalVisible(false);
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    const cancelDate = () => {
      form.resetFields();
      handleModalVisible(false);
    };
    return (
      <div>
        <Modal
          title="数据字典基本信息新增"
          style={{ top: 20 }}
          visible={modalVisible}
          width='35%'
          maskClosable={false}
          onOk={validate}
          onCancel={cancelDate}
        >
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.code}>
                    {getFieldDecorator('code', {
                      rules: [{ required: true, message: '请输入编码' }],
                    })(<Input placeholder="请输入编码" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.dictType}>
                    {getFieldDecorator('dictType', {
                      rules: [{ required: true, message: '请选择字典类别' }],
                    })(<Input placeholder="请选择字典类别" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.dictName}>
                    {getFieldDecorator('dictName', {
                      rules: [{ required: true, message: '请输入字典名称' }],
                    })(<Input placeholder="请输入字典名称" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.remarks}>
                    {getFieldDecorator('remarks')(
                      <TextArea placeholder="请输入备注" style={{ minHeight: 32 }} rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Modal>
      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(DictTypeAdd));
