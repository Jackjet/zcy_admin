import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Modal } from 'antd';
import { connect } from 'dva';
import styles from './DictTypeAdd.less';
import { message } from 'antd/lib/index';
import SeniorModal from '../../../components/MoveModal';

const { TextArea } = Input;
const fieldLabels = {
  number: '编码',
  name: '名称',
  remark: '备注',
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
    const { dispatch, modalVisible, form, handleModalVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'dictType/add',
            payload: values,
            callback: (res) => {
            if(res.meta.status !== '000000' ) {
              message.error("添加数据字典类型错误，请稍后再试！"+res.data.alert_msg)
            }else{
              //
              form.resetFields();
              handleModalVisible(false);
              dispatch({
                type: 'dictType/fetch',
                payload: {
                  page: 1,
                  pageSize: 10,
                },
              });


            }
           },
          });


        }
      });
    };
   /* const errors = getFieldsError();
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
    };*/
    const cancelDate = () => {
      form.resetFields();
      handleModalVisible(false);
    };
    return (
      <div>
        <SeniorModal
          title="数据字典类型新增"
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
            <Form layout="horizontal">
              <Row>
                <Col span={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.number}>
                    {getFieldDecorator('number', {
                      rules: [{ required: true, message: '请输入编码' }],
                    })(<Input placeholder="请输入编码" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请选择字典类别名称' }],
                    })(<Input placeholder="请选择字典类别名称" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.remark}>
                    {getFieldDecorator('remark')(
                      <TextArea placeholder="请输入备注" style={{ width: 200, height: 100 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </SeniorModal>
      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['dictType/add'],
}))(Form.create()(DictTypeAdd));
