import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Popover,
  Modal,
  Radio,
  Upload,
  message,
  Button,
} from 'antd';
import { connect } from 'dva';
import styles from './Style.less';
import moment from "moment/moment";


const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const { RadioGroup } = Radio.Group;
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

class StatementAddModal extends PureComponent {
  state = {
    width: '100%',
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
    const { form, dispatch, submitting, StatementAddVisible, handleStatementAddVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          form.resetFields();
          handleStatementAddVisible(false);
        }
      });
    };
    const cancelDate = () => {
      form.resetFields();
      handleStatementAddVisible(false);
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
        title="日报新增"
        style={{ top: 20 }}
        visible={StatementAddVisible}
        width="55%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText='提交'
      >
        <Card>
          <Form layout="horizontal">
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="报告类型">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入组织名称' }],
                  })(
                    <RadioGroup>
                      <Radio value={1}>日报</Radio>
                      <Radio value={2}>周报</Radio>
                      <Radio value={3}>月报</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="报告日期">
                  {getFieldDecorator('parentOrg', {
                    rules: [{ required: true, message: '报告日期' }],
                    initialValue:`{moment(val).format('YYYY-MM-DD HH:mm:ss')}`,
                  })(
                    <DatePicker />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="已完结工作">
                  {getFieldDecorator('number', {
                    rules: [{ required: true, message: '已完结工作' }],
                  })(
                    <TextArea placeholder="已完结工作" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="未完成工作">
                  {getFieldDecorator('isCompany', {
                  rules: [{ required: true, message: '未完成工作' }],
                  initialValue:`否`,
                  })(
                    <TextArea placeholder="未完成工作" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="协助工作">
                  {getFieldDecorator('simpleName', {
                    rules: [{ required: false, message: '协助工作' }],
                  })(
                    <TextArea placeholder="协助工作" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="附件">
                  {getFieldDecorator('englishName', {
                    rules: [{ required: false, message: '请输入英文名称' }],
                  })(
                    <Upload {...props}>
                      <Button>
                        <Icon type="upload" /> 上传附件
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="审阅人">
                  {getFieldDecorator('principal', {
                    rules: [{ required: false, message: '请选择负责人' }],
                  })(
                    <Radio.Group>
                      <Radio.Button value="1">汪工</Radio.Button>
                      <Radio.Button value="2">申工</Radio.Button>
                      <Radio.Button value="3">盛工</Radio.Button>
                    </Radio.Group>
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

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(StatementAddModal));
