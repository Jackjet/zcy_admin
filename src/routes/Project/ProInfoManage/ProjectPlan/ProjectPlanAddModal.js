import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Select, DatePicker, Modal, Popover, message, Icon } from 'antd';
import { connect } from 'dva';
import styles from '../../add/style.less';


const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  projectCode: '项目编号',
  projectName: '项目名称',
  workStep: '工作步骤',
  logContent: '日志内容',
  workDate: '工作日期',
  lengthTime: '时长',
  noteTaker: '记录人',
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

class ProjectPlanAddModal extends PureComponent {
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
    const { form, dispatch, submitting, projectPlanAddVisible, handleProjectPlanAddVisible } = this.props;
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
        }
        handleProjectPlanAddVisible(false);
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
    return (
      <Modal
        title="项目计划新增"
        style={{ top: 20 }}
        // 对话框是否可见
        visible={projectPlanAddVisible}
        width="40%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleProjectPlanAddVisible(false)}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="阶段">
                    {getFieldDecorator('projectCode', {
                      rules: [{ required: true, message: '阶段' }],
                    })(
                      <Input placeholder="阶段" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="开始时间">
                    {getFieldDecorator('startDate', {
                      rules: [{ required: true, message: '开始时间' }],
                    })(
                      <Input placeholder="开始时间" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="结束时间">
                    {getFieldDecorator('endDate', {
                      rules: [{ required: true, message: '结束时间' }],
                    })(
                      <Input placeholder="结束时间" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="实际完成时间">
                    {getFieldDecorator('logContent', {
                      rules: [{ required: true, message: '实际完成时间' }],
                    })(
                      <Input placeholder="实际完成时间" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="备注">
                    {getFieldDecorator('beizhu')(
                      <Input placeholder="备注" style={{ width: 200 }} />
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
}))(Form.create()(ProjectPlanAddModal));
