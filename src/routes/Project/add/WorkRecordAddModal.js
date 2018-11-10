import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Popover,
  Cascader,
  Checkbox,
  Modal,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import moment from 'moment/moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const optionshz = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

function onChange(value) {
  console.log(value);
}

const fieldLabels = {
  name: '项目名称',
  recordTitle: '日志标题',
  category: '类别',
  contactTime: '联系时间',
};

const cnumcol = {
  style: {
    paddingLeft: 10,
  },
};

const yearscol = {
  style: {
    paddingLeft: 36,
  },
};

const customercol = {
  style: {
    paddingLeft: 36,
  },
};

const feecol = {
  style: {
    paddingLeft: 13,
  },
};

const addresscol = {
  style: {
    paddingLeft: 10,
  },
};
const enddatecol = {
  style: {
    paddingLeft: 23,
  },
};
const startdatecol = {
  style: {
    paddingLeft: 10,
  },
};

const remarkcol = {
  wrapperCol: {
    style: {
      width: '91.66666667%',
    },
  },
  style: {
    width: '98.66666667%',
    paddingLeft: 24,
  },
};

const demandcol = {
  wrapperCol: {
    style: {
      width: '69%',
    },
  },
  style: {
    width: '90%',
    paddingLeft: 20,
  },
};

const jfwcol = {
  wrapperCol: {
    style: {
      width: '78%',
    },
  },
  style: {
    width: '91%',
    paddingLeft: 12,
  },
};

const companycol = {
  style: {
    paddingLeft: 10,
  },
};

const statuscol = {
  style: {
    paddingLeft: 35,
  },
};

const formhz12 = {
  wrapperCol: {
    style: {
      width: '92%',
    },
  },
  style: {
    width: '96.66666667%',
  },
};

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

class WorkRecordAddModal extends PureComponent {
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
    const { form, dispatch, submitting, workRecordVisible, handleWorkRecordVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
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
    return (
      <Modal
        title="增加工作记录"
        visible={workRecordVisible}
        width="50%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleWorkRecordVisible()}
      >
        <div>
          <Card>
            <Form layout="inline">
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入项目名称' }],
                    })(<Input placeholder="请输入项目名称" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.recordTitle}>
                    {getFieldDecorator('recordTitle', {
                      rules: [{ required: true, message: '请选择日志标题' }],
                    })(<Input placeholder="请选择日志标题" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...cnumcol} label={fieldLabels.category}>
                    {getFieldDecorator('category')(
                      <Select placeholder="请选择日志类别" style={{ width: 200 }}>
                        <Option value="0">通用日志</Option>
                        <Option value="g">学习</Option>
                        <Option value="y">放假</Option>
                        <Option value="q">招标</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item label={fieldLabels.contactTime}>
                    {getFieldDecorator('contactTime')(
                      <span>{moment().format('YYYY-MM-DD HH:mm:ss')}</span>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['row-h']}>
                <Col>
                  <Form.Item {...startdatecol}>
                    {getFieldDecorator('textAreaInput')(<textarea />)}
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
}))(Form.create()(WorkRecordAddModal));
