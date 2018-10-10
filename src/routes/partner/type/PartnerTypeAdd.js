import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Modal } from 'antd';
import { connect } from 'dva';
import styles from './PartnerTypeAdd.less';
import {message} from "antd/lib/index";

const { TextArea } = Input;
const fieldLabels = {
  number: '客户编码',
  code: '编码',
  name: '客户名称',
  dateRange: '生效日期',
  remarks: '备注',
  dictTypeName: '合伙人类别名称',
  status: '状态',
};

const codeSpace = {
  style: {
    paddingLeft: 62,
  },
};

const dictTypeNameSpace = {
  style: {
    paddingLeft: 12,
  },
};

const remarksSpace = {
  style: {
    paddingLeft: 70,
  },
};

class PartnerTypeAdd extends PureComponent {
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
          title="合伙人信息新增"
          style={{ top: 20 }}
          // 对话框是否可见
          visible={modalVisible}
          width="30%"
          // 点击蒙层是否允许关闭
          maskClosable={false}
          onOk={validate}
          onCancel={cancelDate}
        >
          <Card>
            <Form layout="inline">
              <Row className={styles['row-h']}>
                <Col span={24}>
                  <Form.Item {...codeSpace} label={fieldLabels.code}>
                    {getFieldDecorator('code', {
                      rules: [{ required: true, message: '请输入编码' }],
                    })(<Input placeholder="请输入编码" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={24}>
                  <Form.Item {...dictTypeNameSpace} label={fieldLabels.dictTypeName}>
                    {getFieldDecorator('dictTypeName', {
                      rules: [{ required: true, message: '请输入名称' }],
                    })(<Input placeholder="请输入名称" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={24}>
                  <Form.Item {...remarksSpace} label={fieldLabels.remarks}>
                    {getFieldDecorator('remarks')(
                      <TextArea placeholder="请输入备注" style={{ width: 200, height: 100 }} />
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
}))(Form.create()(PartnerTypeAdd));
