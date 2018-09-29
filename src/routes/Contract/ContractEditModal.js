import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Checkbox,
  Modal,
  message,
  Icon,
  Popover,
  Upload,
  Button,
} from 'antd';
import { connect } from 'dva';
import styles from '../project/edit/style.less';

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
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  contractCode: '合同编码',
  contractType: '合同类别',
  years: '年度',
  projectName: '项目名称',
  contractStatus: '合同性质',
  contractTitle: '合同标题',
  dfCompany: '对方公司',
  authorizedAgent: '客户授权代理人',
  PartyAcompany: '甲方公司',
  PartyBcompany: '乙方公司',
  fatherContract: '父合同',
  signDate: '签订日期',
  paymentMethod: '付款方式',
  businessType: '业务类别',
  contractSignPlace: '合同签订地点',
  contractSubject: '合同标的',
  startDate: '开始日期',
  endDate: '结束日期',
  totalAmount: '合同金额',
  fzperson: '项目负责人',
  remark: '备注',
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
const ContractTypeOption = ["工程造价业务项目","咨询报告","招标"];

class ContractEditModal extends PureComponent {
  state = {
    width: '100%',
    choiceCheckBox:``,
    contractOptionData:[],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleChoiceContractType = () =>{
    const optionData = ContractTypeOption.map((data, index) => {
      const value = `${data}`;
      return <Option value={value}>{value}</Option>;
    });
    this.setState({
      contractOptionData: optionData,
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
    const { form, dispatch, submitting, contractEditVisible, handleContractEditVisible, rowInfo } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { choiceCheckBox, contractOptionData } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功');
          handleContractEditVisible(false);
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
        title="合同基本信息新增"
        visible={contractEditVisible}
        width="75%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleContractEditVisible()}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.contractCode}>
                    {getFieldDecorator('contractCode', {
                      rules: [{ required: true, message: '不重复的数字' }],
                      initialValue:`${rowInfo.contractCode}`,
                    })(
                      <Input placeholder="自动生成" />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.contractType}>
                    {getFieldDecorator('contractType', {
                      rules: [{ required: true, message: '请选择合同类别' }],
                    })(
                      <Select onChange={this.handleGetOptionValue} onMouseEnter={this.handleChoiceContractType} placeholder="请选择合同类别" >
                        {contractOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.years}>
                    {getFieldDecorator('years', {
                      rules: [{ required: true, message: '请选择年度' }],
                    })(
                      <Select placeholder="请选择年度" >
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
              </Row>

              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.contractTitle}>
                    {getFieldDecorator('contractTitle', {
                      rules: [{ required: true, message: '请输入合同标题' }],
                    })(
                      <Input placeholder="请输入合同标题" />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.projectName}>
                    {getFieldDecorator('projectName', {
                      rules: [{ required: true, message: '请输入项目名称' }],
                    })(
                      <Select placeholder="请输入项目名称" >
                        <Option value="c">项目A</Option>
                        <Option value="h">项目B</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>

                <Col span={8} >
                  <Form.Item {...formItemLayout} label={fieldLabels.contractStatus}>
                    {getFieldDecorator('contractStatus', {
                      rules: [{ required: true, message: '请选择合同性质' }],
                    })(
                      <Select placeholder="请选择合同性质" >
                        <Option value="c">工程</Option>
                        <Option value="h">建设</Option>
                        <Option value="h">其它</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>


              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.dfCompany}>
                    {getFieldDecorator('dfCompany', {
                      rules: [{ required: false, message: '对方公司' }],
                    })(
                      <Select placeholder="对方公司" >
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
                  <Form.Item {...formItemLayout} label={fieldLabels.authorizedAgent}>
                    {getFieldDecorator('authorizedAgent', {
                      rules: [{ required: false, message: '客户授权代理人' }],
                    })(
                      <Select placeholder="请选择客户授权代理人" >
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
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.businessType}>
                    {getFieldDecorator('businessType')(
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                          { ( choiceCheckBox === `工程造价业务项目`|| choiceCheckBox===`咨询报告` ) && (
                            <span>
                              <Col span={6}>
                                <Checkbox value="A">预算编制</Checkbox>
                              </Col>
                              <Col span={6}>
                                <Checkbox value="B">结算编制</Checkbox>
                              </Col>
                              <Col span={6}>
                                <Checkbox value="D">咨询审核</Checkbox>
                              </Col>
                              <Col span={6}>
                                <Checkbox value="E">预算审核</Checkbox>
                              </Col>
                              <Col span={6}>
                                <Checkbox value="F">结算审核</Checkbox>
                              </Col>
                              <Col span={6}>
                                <Checkbox value="H">咨询报告</Checkbox>
                              </Col>
                            </span>
                          )}

                          { ( choiceCheckBox === `招标`|| choiceCheckBox===`咨询报告` ) && (
                            <span>
                              <Col span={6}>
                                <Checkbox value="G">政府采购招标代理</Checkbox>
                              </Col>
                              <Col span={6}>
                                <Checkbox value="C">建设工程招标代理</Checkbox>
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
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.totalAmount}>
                    {getFieldDecorator('totalAmount', {
                      rules: [{ required: true, message: '请输入总金额' }],
                    })(<Input placeholder="请输入合同标题" />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.fzperson}>
                    {getFieldDecorator('fzperson', {
                      rules: [{ required: true, message: '请选择负责人' }],
                    })(
                      <Select placeholder="请选择负责人" >
                        <Option value="c">公司员工1</Option>
                        <Option value="h">公司员工2</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['fn-mb-15']}>
                <Col span={23} offset={2}>
                  <Form.Item {...formItemLayout} label={fieldLabels.attachment}>
                    {getFieldDecorator('  attachment ', {
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

              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.remark}>
                    {getFieldDecorator('remark')(<TextArea placeholder="请输入备注信息" rows={4}  style={{width:'170%'}} />)}
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
}))(Form.create()(ContractEditModal));
