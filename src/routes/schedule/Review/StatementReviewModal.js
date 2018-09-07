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
  Radio,
  Upload,
  Button,
  Modal,
  message,
  Popconfirm,
  Table,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './Style.less';



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
const { RangePicker } = DatePicker;
const { Group } = Radio;
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

class StatementReviewModal extends PureComponent {
  state = {
    width: '100%',
    radioValue: 1,
    popconfirmVisible:false,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleRadioGroup = (e)=>{
    this.setState({
      radioValue: e.target.value,
    });
  };

  handlePopconfirmVisible = (flag) => {
    this.setState({
      popconfirmVisible:!!flag,
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
    const { form, dispatch, submitting, StatementReviewVisible, handleStatementReviewVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { radioValue } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          form.resetFields();
          handleStatementReviewVisible(false);
        }
      });
    };
    const cancel = () => {
      form.resetFields();
      handleStatementReviewVisible(false);
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
    const columns = [{
      title: '审评人',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '审评日期',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '点评内容',
      dataIndex: 'address',
      key: 'address',
    }];

    const data = [{
      key: '1',
      name: '汪工',
      age: '2018/9/7',
      address: 'good',
    }, {
      key: '2',
      name: '申工',
      age: '2018/9/8',
      address: 'very good',
    }, {
      key: '3',
      name: '盛工',
      age: '2018/9/9',
      address: 'very very good',
    }];
    return (
      <Modal
        title="日报查看"
        style={{ top: 20 }}
        visible={StatementReviewVisible}
        width="55%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancel}
        okText='确定'
      >
        <Card>
          <div>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="报告类型">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入组织名称' }],
                      initialValue:`日报`,
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="报告日期">
                    {getFieldDecorator('reportData', {
                      rules: [{ required: true, message: '报告日期' }],
                    })(
                      <DatePicker />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={2}>
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
                <Col span={23} pull={1}>
                  <Form.Item {...formItemLayout} label="未完成工作">
                    {getFieldDecorator('isCompany', {
                      rules: [{ required: true, message: '未完成工作' }],
                    })(
                      <TextArea placeholder="未完成工作" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
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
                <Col span={23} pull={1}>
                  <Form.Item {...formItemLayout} label="附件">
                    {getFieldDecorator('englishName', {
                      rules: [{ required: false, message: '请输入英文名称' }],
                    })(
                      <Upload {...props}>
                        <Button type="primary">
                          <Icon type="upload" /> 上传附件
                        </Button>
                        <span>
                          *只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif，最多上传5个附件
                        </span>
                      </Upload>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={1}>
                  <Form.Item {...formItemLayout} label="审阅人">
                    {getFieldDecorator('principal', {
                      rules: [{ required: false, message: '请选择负责人' }],
                    })(
                      <Group>
                        <Radio.Button value="1">汪工</Radio.Button>
                        <Radio.Button value="2">申工</Radio.Button>
                        <Radio.Button value="3">盛工</Radio.Button>
                      </Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={24}>
                  <Form.Item {...formItemLayout} label="审阅点评">
                    {getFieldDecorator('principal', {
                      rules: [{ required: false, message: '审阅点评' }],
                    })(
                      <Table columns={columns} dataSource={data} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(StatementReviewModal));
