import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Table,
  Modal,
  Icon,
  Popover,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment/moment';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;

const fieldLabels = {
  number: '报告编号',
  type: '业务类型',
  years: '名称',
  name: '报告性质',
  dateRange: '出具时间',
  cuslink: '备注',
  customer: '附件',
};
const data = [
  {
    key: '1',
    fileName: '员工购买笔记本管理之地.doc',
    fileType: 'doc',
    version: '1',
    editPerson: '小杨',
  },
];

const columns = [
  {
    title: '文档名称',
    dataIndex: 'fileName',
    key: 'age',
    render: text => <a href=" ">{text}</a>,
  },
  {
    title: '文档类型',
    dataIndex: 'fileType',
    key: 'address',
  },
  {
    title: '版本号',
    dataIndex: 'version',
    key: 'address',
  },
  {
    title: '修改时间',
    dataIndex: 'editDate',
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
  {
    title: '修改人',
    dataIndex: 'editPerson',
    key: 'address',
  },
];

const formhz11 = {
  wrapperCol: {
    style: {
      width: '90.2%',
    },
  },
  style: {
    width: '96.66666667%',
  },
};

class ReportEditModal extends PureComponent {
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
    const { form, dispatch, submitting, reportEditVisible, handleReportEditVisible, rowInfoCurrent } = this.props;
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
          handleReportEditVisible(false);
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
    const FiledInfo = {
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
    return (
      <Modal
        title="报告基本信息编辑"
        visible={reportEditVisible}
        width="90%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleReportEditVisible()}
      >
        <div>
          <Card>
            <Form layout="inline">
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.number}>
                    {getFieldDecorator('number', {
                      rules: [{ required: true, message: '请输入报告编号' }],
                      initialValue: `${rowInfoCurrent.no}`,
                    })(<Input placeholder="请输入报告编号" className={styles['ant-input-lg']} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.type}>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '请选择业务类别' }],
                    })(
                      <Select placeholder="请选择业务类别" style={{ width: 200 }}>
                        <Option value="0">请选择</Option>
                        <Option value="g">A</Option>
                        <Option value="y">B</Option>
                        <Option value="q">C</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.years}>
                    {getFieldDecorator('years', {
                      rules: [{ required: true, message: '请输入名称' }],
                    })(<Input placeholder="请输入名称" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请选择报告性质' }],
                    })(
                      <Select placeholder="请选择客户" style={{ width: 200 }}>
                        <Option value="xiao">请选择</Option>
                        <Option value="z">A</Option>
                        <Option value="f">B</Option>
                        <Option value="fd">C</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.dateRange}>
                    {getFieldDecorator('dateRange', {
                      rules: [{ required: false, message: '请输入出具时间' }],
                    })(<DatePicker style={{ width: 200 }} placeholder="请输入出具时间" />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.cuslink}>
                    {getFieldDecorator('cuslink')(<TextArea placeholder="请输入备注信息" rows={4} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.customer}>
                    {getFieldDecorator('customer')(
                      <Upload {...FiledInfo}>
                        <Button type="primary">上传附件</Button>
                        <span>
                        只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif格式的文件，最多上传5个附件
                        </span>
                      </Upload>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11}>
                    {getFieldDecorator('customer')(<Table columns={columns} dataSource={data} />)}
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
}))(Form.create()(ReportEditModal));
