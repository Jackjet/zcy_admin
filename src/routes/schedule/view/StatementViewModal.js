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
  Tag,
  Table,
  Divider,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './Style.less';

const dataTest = [];
for (let i = 0; i < 46; i+=1) {
  dataTest.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}
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

class StatementViewModal extends PureComponent {
  state = {
    width: '100%',
    dataDemo: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  handleUploadFile = (info)=>{
    console.log(`${info.file.name}+1111`)
  };
  handleChange = (info)=>{
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      console.log(`${info.file.name}`);
      this.setState({
        dataDemo:dataTest,
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      this.handleUploadFile(info);
      console.log(`${info.file.name}`)
    }
  };
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { form, dispatch, submitting, StatementViewVisible, handleStatementViewVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { dataDemo } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          form.resetFields();
          handleStatementViewVisible(false);
        }
      });
    };
    const cancel = () => {
      form.resetFields();
      handleStatementViewVisible(false);
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
    const uploadProps = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList:false,
      onChange:this.handleChange,
    };
    const columns = [{
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'name',
      render: text => <a href="">{text}</a>,
    }, {
      title: '文档类型',
      dataIndex: 'fileType',
      key: 'type',
    }, {
      title: '上传(更新)时间',
      dataIndex: 'uploadTime',
      key: 'address',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="">下载</a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </span>
      ),
    }];
    return (
      <Modal
        title="查看"
        style={{ top: 20 }}
        visible={StatementViewVisible}
        width="65%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancel}
        okText='提交'
      >
        <Card>
          <div>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={12} >
                  <Form.Item {...formItemLayout} label="报告类型">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入组织名称' }],
                      initialValue:`日报`,
                    })(
                      <Input style={{width:'80%'}} />
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
                <Col span={21} pull={3}>
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
                <Col span={21} pull={3}>
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
                <Col span={21} pull={3}>
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
                <Col span={21} pull={3}>
                  <Form.Item {...formItemLayout} label="附件">
                    {getFieldDecorator('englishName', {
                      rules: [{ required: false, message: '请输入英文名称' }],
                    })(
                      <div>
                        <Upload
                          {...uploadProps}
                        >
                          <Button type="primary">
                            <Icon type="upload" /> 上传附件
                          </Button>
                          <span>
                            *只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif，最多上传5个附件
                          </span>
                        </Upload>
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={21} pull={3}>
                  <Form.Item {...formItemLayout} label="附件列表">
                    {getFieldDecorator('englishName', {
                      rules: [{ required: false, message: '附件列表' }],
                    })(
                      <div>
                        <Table columns={columns} dataSource={dataDemo} />
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={21} pull={3}>
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
                <Col span={21} pull={3}>
                  <Form.Item {...formItemLayout} label="审阅点评">
                    {getFieldDecorator('principal', {
                      rules: [{ required: false, message: '审阅点评' }],
                    })(
                      <TextArea placeholder="审阅点评" />
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
}))(Form.create()(StatementViewModal));
