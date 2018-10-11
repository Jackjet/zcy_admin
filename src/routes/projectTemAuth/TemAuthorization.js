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

const { Search } = Input;
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


class TemAuthorization extends PureComponent {
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
    const { form, dispatch, submitting, projectTemAuthVisible, handleProjectTemAuthAddVisible } = this.props;
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
          handleProjectTemAuthAddVisible(false);
        }
      });
    };
    const cancelDate = () => {
      form.resetFields();
      handleProjectTemAuthAddVisible(false);
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
        title="新增项目审批临时授权"
        style={{ top: 20 }}
        visible={projectTemAuthVisible}
        width="50%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText='提交'
      >
        <div>
          <Card bordered={false}>
            <Form layout="horizontal" onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <FormItem {...formItemLayout} label="开始日期">
                    {getFieldDecorator('stateData', {
                      rules: [
                        {
                          required: false,
                          message: '请输入标题',
                        },
                      ],
                      initialValue:startValue,
                    })(
                      <DatePicker
                        disabledDate={this.disabledStartDate}
                        showTime
                        format="YYYY-MM-DD HH:MM:ss"
                        placeholder="开始日期"
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <FormItem {...formItemLayout} label="结束日期">
                    {getFieldDecorator('endData', {
                      rules: [
                        {
                          required: false,
                          message: '请选择起止日期',
                        },
                      ],
                      initialValue:endValue,
                    })(
                      <DatePicker
                        disabledDate={this.disabledEndDate}
                        showTime
                        format="YYYY-MM-DD HH:MM:ss"
                        placeholder="结束日期"
                        onChange={this.onEndChange}
                        open={endOpen}
                        onOpenChange={this.handleEndOpenChange}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <FormItem {...formItemLayout} label="授权人">
                    {getFieldDecorator('project', {
                      rules: [
                        {
                          required: true,
                          message: '授权人',
                        },
                      ],
                    })(
                      <Search placeholder="授权人" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <FormItem {...formItemLayout} label="委托人">
                    {getFieldDecorator('standard', {
                      rules: [
                        {
                          required: true,
                          message: '委托人',
                        },
                      ],
                    })(
                      <Search placeholder="委托人" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <FormItem {...formItemLayout} label="说明">
                    <div>
                      {getFieldDecorator('public', {
                      })(
                        <TextArea
                          style={{ minHeight: 32 }}
                          placeholder="输入说明"
                          rows={4}
                        />
                      )}
                    </div>
                  </FormItem>
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
}))(Form.create()(TemAuthorization));
