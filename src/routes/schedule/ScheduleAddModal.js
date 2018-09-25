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


class ScheduleAddModal extends PureComponent {
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
    const { form, dispatch, submitting, ScheduleAddVisible, handleScheduleAddVisible } = this.props;
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
          handleScheduleAddVisible(false);
        }
      });
    };
    const cancelDate = () => {
      form.resetFields();
      handleScheduleAddVisible(false);
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
        title="新增日常安排"
        style={{ top: 20 }}
        visible={ScheduleAddVisible}
        width="45%"
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
                  <FormItem {...formItemLayout} label="项目">
                    {getFieldDecorator('project', {
                      rules: [
                        {
                          required: true,
                          message: '请输入目标描述',
                        },
                      ],
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder="项目名称"
                        rows={4}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <FormItem {...formItemLayout} label="出勤类型">
                    {getFieldDecorator('standard', {
                      rules: [
                        {
                          required: true,
                          message: '请选择出勤类型',
                        },
                      ],
                    })(
                      <Select >
                        <Option value='1' >内勤</Option>
                        <Option value='2' >外勤</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <FormItem
                    {...formItemLayout}
                    label='时间段'
                  >
                    {getFieldDecorator('client',{
                      initialValue:RadioGroupValue,
                    })(
                      <RadioGroup onChange={this.onRadioGroupChange}>
                        <Radio value={1}>全天</Radio>
                        <Radio value={2}>上午</Radio>
                        <Radio value={3}>下午</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <FormItem
                    {...formItemLayout}
                    label='日程主题'
                  >
                    {getFieldDecorator('invites')(
                      <Input placeholder="自动生成上午、下午、全天--项目名（出勤类型），反之手工填写" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <FormItem
                    {...formItemLayout}
                    label='提醒'
                  >
                    {getFieldDecorator('weight')(
                      <Select placeholder="无" >
                        <Option value={1}>准时</Option>
                        <Option value={2}>15分钟前</Option>
                        <Option value={3}>30分钟前</Option>
                        <Option value={4}>1小时前</Option>
                        <Option value={5}>2小时前</Option>
                        <Option value={6}>一天前</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <FormItem {...formItemLayout} label="备注">
                    <div>
                      {getFieldDecorator('public', {
                      })(
                        <TextArea
                          style={{ minHeight: 32 }}
                          placeholder="输入备注"
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
}))(Form.create()(ScheduleAddModal));
