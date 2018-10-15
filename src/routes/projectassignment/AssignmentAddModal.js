import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Popover,
  Modal,
  Radio,
  Upload,
  message,
  Button,
  Tooltip,
  Select,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import styles from './Style.less';
import moment from "moment/moment";


const { Search } = Input;

const fieldLabels = {
  projectCode:'编码',
  projectType:'项目类别',
  projectName:'项目名称',
  year:'年度',
  explain:'说明',
};

const RadioGroup = Radio.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
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


class AssignmentAddModal extends PureComponent {
  state = {
    width: '100%',
    startValue: null,
    endValue: null,
    endOpen: false,
    RadioGroupValue: 1,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  onRadioGroupChange = (e) => {
    this.setState({
      RadioGroupValue: e.target.value,
    });
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);
  };

  disabledStartDate = (startValue) => {
    const EndValue = this.state.endValue;
    if (!startValue || !EndValue) {
      return false;
    }
    return startValue.valueOf() > EndValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const StartValue = this.state.startValue;
    if (!endValue || !StartValue) {
      return false;
    }
    return endValue.valueOf() <= StartValue.valueOf();
  };


  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { form, dispatch, submitting, projectAssigVisible, handleProjectAssignmentAddVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError, getFieldValue } = form;
    const { startValue, endValue, endOpen, RadioGroupValue } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          form.resetFields();
          handleProjectAssignmentAddVisible(false);
        }
      });
    };
    const cancelDate = () => {
      form.resetFields();
      handleProjectAssignmentAddVisible(false);
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
        title="新增项目指派"
        style={{ top: 20 }}
        visible={projectAssigVisible}
        width="50%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="指派编号">
                    {getFieldDecorator('authorizedAgent', {
                      rules: [{ required: true, message: '指派编号' }],
                    })(
                      <Input placeholder="默认带出" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="项目经理">
                    {getFieldDecorator('authorizedAgent', {
                      rules: [{ required: false, message: '项目经理' }],
                    })(
                      <Search placeholder="请选择项目经理" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="创建时间">
                    {getFieldDecorator('establishDate', {
                      rules: [{ required: false, message: '创建时间' }],
                      initialValue:`${moment().format('YYYY-MM-DD HH:mm:ss')}`,
                    })(
                      <Input placeholder="执行（项目创建）时间[隐藏]" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="实际完成时间">
                    {getFieldDecorator('actualDate', {
                      rules: [{ required: false, message: '实际完成时间' }],
                    })(
                      <Input placeholder="实际完成时间 [隐藏]" />
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
}))(Form.create()(AssignmentAddModal));
