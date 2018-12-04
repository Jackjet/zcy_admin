import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Select, DatePicker, Modal, Popover, message, Icon } from 'antd';
import { connect } from 'dva';
import styles from '../style.less';


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

class ProjectProcessAddModal extends PureComponent {
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
    const { form, dispatch, submitting, projectProcessAddVisible, handleProjectProcessAddVisible } = this.props;
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
        handleProjectProcessAddVisible(false);
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
        title="项目过程管理新增"
        style={{ top: 20 }}
        // 对话框是否可见
        visible={projectProcessAddVisible}
        width="40%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleProjectProcessAddVisible(false)}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="项目频度">
                    {getFieldDecorator('projectCode', {
                      rules: [{ required: true, message: '项目频度' }],
                    })(
                      <Select placeholder="项目频度" style={{ width: 200 }}>
                        <Option value="0">日</Option>
                        <Option value="1">周</Option>
                        <Option value="2">月</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="计划时间">
                    {getFieldDecorator('projectName', {
                      rules: [{ required: true, message: '计划时间' }],
                    })(<Input placeholder="计划时间" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="工程阶段">
                    {getFieldDecorator('workStep', {
                      rules: [{ required: true, message: '工程阶段' }],
                    })(
                      <Select placeholder="工程阶段" style={{ width: 200 }}>
                        <Option value="0">前期（业务尽调、签约、计划等）</Option>
                        <Option value="1">审计外勤</Option>
                        <Option value="2">一级复核</Option>
                        <Option value="3">与被审计单位的沟通</Option>
                        <Option value="4">底稿整理</Option>
                        <Option value="5">报告撰写</Option>
                        <Option value="6">复核后修改</Option>
                        <Option value="7">正式报告出具</Option>
                        <Option value="8">档案整理及移交</Option>
                        <Option value="9">其他</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="完成情况">
                    {getFieldDecorator('logContent', {
                      rules: [{ required: true, message: '完成情况' }],
                    })(
                      <TextArea placeholder="完成情况" style={{ minHeight: 32 }} rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="遇到的问题">
                    {getFieldDecorator('workDate')(
                      <TextArea placeholder="遇到的问题" style={{ minHeight: 32 }} rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="协助">
                    {getFieldDecorator('lengthTime')(
                      <TextArea placeholder="协助" style={{ minHeight: 32 }} rows={4} />
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
}))(Form.create()(ProjectProcessAddModal));
