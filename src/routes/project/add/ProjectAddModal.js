import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  // TimePicker,
  Input,
  InputNumber,
  Select,
  Popover,
  Cascader,
  Checkbox,
  Modal,
  Upload,
} from 'antd';
import { connect } from 'dva';
import moment from "moment/moment";
import styles from './style.less';

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


const ProjectTypeOption = ['工程造价业务项目', '可研报告', '招标代理业务项目'];


const fieldLabels = {
  number: '项目编码',
  type: '项目类别',
  years: '年度',
  name: '项目名称',
  dateRange: '生效日期',
  cuslink: '客户联系人',
  customer: '客户',
  url: '网站主页',
  taxcode: '税务登记号',
  fzcompany: '负责公司',
  fzperson: '项目负责人',
  fee: '项目费用',
  startdate: '开始日期',
  enddate: '结束日期',
  biztype: '业务类别',
  content: '项目内容',
  address: '详细地址',
  remark: '备注',
  status: '状态',
  jfw: '交付物',
  demand: '客户需求',
  attachment:'附件',
};




const fileList = [
  {
    uid: -1,
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: -2,
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
];

const props2 = {
  action: '//jsonplaceholder.typicode.com/posts/',
  listType: 'picture',
  defaultFileList: [...fileList],
  className: styles['upload-list-inline'],
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

class ProjectAddModal extends PureComponent {
  state = {
    width: '100%',
    projectOptionData:[],
    choiceCheckBox:``,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  handleProjectChange = () => {
    const optionData = ProjectTypeOption.map((data, index) => {
        const val = `${data}`;
        return <Option key={val}>{val}</Option>;
      });
    this.setState({
      projectOptionData: optionData,
    });
  };

  handleGetOptionValue=(value)=>{
    this.setState({
      choiceCheckBox:`${value}`,
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
    const { form, dispatch, submitting, projectVisible, handleProjectVisible, choiceTypeValue, rowInfo } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { projectOptionData, choiceCheckBox } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values

          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          form.resetFields();
          handleProjectVisible(false);
        }
      });
    };
    const onCan = () => {
      form.resetFields();
      handleProjectVisible(false);
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
        title="项目基本信息新增"
        style={{ top: 20 }}
        visible={projectVisible}
        width='85%'
        maskClosable={false}
        onOk={validate}
        onCancel={onCan}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入项目名称' }],
                      initialValue:`${rowInfo.customerName}`,
                    })(<Input placeholder="请输入项目名称" style={{width:'140%'}} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.type}>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '请选择项目类别' }],
                      initialValue:`${choiceTypeValue}`,
                    })(
                      <Select readOnly onChange={this.handleGetOptionValue} onMouseEnter={this.handleProjectChange} placeholder="请选择项目类别" style={{ width: 200 }}>
                        {projectOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.years}>
                    {getFieldDecorator('years', {
                      rules: [{ required: true, message: '请选择年度' }],
                      initialValue:`${moment().format('YYYY')}`,
                    })(
                      <Select placeholder="请选择年度" style={{ width: '100%' }}>
                        <Option value="xiao">请选择</Option>
                        <Option value="z">2018</Option>
                        <Option value="f">2019</Option>
                        <Option value="fd">2020</Option>
                        <Option value="sn">2021</Option>
                        <Option value="zf">2022</Option>
                        <Option value="sy">2023</Option>
                        <Option value="jr">2024</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.status}>
                    {getFieldDecorator('status', {
                      rules: [{ required: true, message: '请选择项目状态' }],
                    })(
                      <Select placeholder="请选择项目状态" style={{ width: '100%' }}>
                        <Option value="c">启用</Option>
                        <Option value="h">禁用</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.number}>
                    {getFieldDecorator('number', {
                      rules: [{ required: false, message: '请输入项目编码' }],
                      initialValue:`${rowInfo.projectCode}` === 'undefined'?'':`${rowInfo.projectCode}`,
                    })(
                      <Input placeholder="自动带出" style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.customer}>
                    {getFieldDecorator('customer', {
                      rules: [{ required: true, message: '请选择客户' }],
                      initialValue:`${rowInfo.customerName}` === 'undefined'?'':`${rowInfo.customerName}`,
                    })(
                      <Input placeholder="请选择客户" style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.cuslink}>
                    {getFieldDecorator('cuslink', {
                      rules: [{ required: true, message: '请选择客户联系人' }],
                    })(
                      <Input placeholder="请选择客户联系人" style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.fzcompany}>
                    {getFieldDecorator('fzcompany', {
                      rules: [{ required: true, message: '负责公司' }],
                    })(
                      <Select placeholder="负责公司" style={{ width: '100%' }}>
                        <Option value="xiao">请选择</Option>
                        <Option value="z">公司A</Option>
                        <Option value="f">公司B</Option>
                        <Option value="fd">公司C</Option>
                        <Option value="sn">公司D</Option>
                        <Option value="zf">公司E</Option>
                        <Option value="sy">公司F</Option>
                        <Option value="jr">公司H</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.fzperson}>
                    {getFieldDecorator('fzperson', {
                      rules: [{ required: true, message: '项目负责人' }],
                    })(
                      <Select placeholder="负责公司" style={{ width: '100%' }}>
                        <Option value="xiao">请选择</Option>
                        <Option value="z">公司A</Option>
                        <Option value="f">公司B</Option>
                        <Option value="fd">公司C</Option>
                        <Option value="sn">公司D</Option>
                        <Option value="zf">公司E</Option>
                        <Option value="sy">公司F</Option>
                        <Option value="jr">公司H</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.fee}>
                    {getFieldDecorator('fee', {
                      rules: [{ required: true, message: '请输入项目费用' }],
                    })(<Input placeholder="请输入项目费用" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.startdate}>
                    {getFieldDecorator('startdate')(
                      <DatePicker style={{ width: '100%' }} placeholder="请输入开始日期" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.enddate}>
                    {getFieldDecorator('enddate')(
                      <DatePicker style={{ width: '100%' }} placeholder="请输入结束日期" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} />
              </Row>

              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.biztype}>
                    {getFieldDecorator('biztype',{
                    })(
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                          { ( `${choiceTypeValue}` === `工程造价业务项目`|| `${choiceTypeValue}` ===`可研报告` ) && (
                            <span>
                              <Col span={8}>
                                <Checkbox key="A">预算编制</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox key="B">结算编制</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox key="D">咨询审核</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox key="E">预算审核</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox key="F">结算审核</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox key="H">咨询报告</Checkbox>
                              </Col>
                            </span>
                          )}

                          { ( `${choiceTypeValue}` === `招标代理业务项目`|| `${choiceTypeValue}`===`可研报告` ) && (
                            <span>
                              <Col span={8}>
                                <Checkbox key="G">政府采购招标代理</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox key="C">建设工程招标代理</Checkbox>
                              </Col>
                            </span>
                          )}
                        </Row>
                      </Checkbox.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.attachment}>
                    {getFieldDecorator('attachment ', {
                      initialValue: '1',
                    })(
                      <Upload {...props2}>
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
}))(Form.create()(ProjectAddModal));
