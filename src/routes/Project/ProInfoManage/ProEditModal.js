import React, { PureComponent } from 'react';
import moment from 'moment/moment';
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
  Select,
  Popover,
  Checkbox,
  Modal,
  Upload,
  Collapse,
  Divider,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import {message} from "antd/lib/index";

const { Panel } = Collapse;
const BillSourceOption = ['招标', '合伙人', '其他'];
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
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
  attachment: '附件',
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

class ProjectEditModal extends PureComponent {
  state = {
    width: '100%',
    BillSourceOptionData: ``,
    BillSourceValue: ``,
    ProTypeOptionData:``,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleBillSourceChange();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleProTypeOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cusApplication/getDict', // 接口
      payload: {
        dictTypeId: '1821fe9feef711e89655186024a65a7c', // 数据类型id
      },
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            ProTypeOptionData: res.data.list, // 返回结果集给对应的状态
          });
        }
      },
    });
  }; // 根据数据中的数据，动态加载业务来源的Option

  handleBillSourceChange = () => {
    const optionData = BillSourceOption.map((data, index) => {
      const val = `${data}`;
      return <Option key={val}>{val}</Option>;
    });
    this.setState({
      BillSourceOptionData: optionData,
    });
  };

  handleGetBillSourceValue = val => {
    this.setState({
      BillSourceValue: val,
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
    const {
      form,
      dispatch,
      submitting,
      projectEditVisible,
      handleProjectEditVisible,
      rowInfo,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { BillSourceOptionData, BillSourceValue, ProTypeOptionData } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          handleProjectEditVisible(false);
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
        title="项目基本信息编辑"
        style={{ top: 20 }}
        visible={projectEditVisible}
        width="90%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleProjectEditVisible(false)}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入项目名称' }],
                      initialValue:
                        `${rowInfo.customerName}` === 'undefined' ? '' : `${rowInfo.customerName}`,
                    })(<Input placeholder="请输入项目名称" style={{ width: '140%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.type}>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '请选择项目类别' }],
                      initialValue: `${rowInfo.BillSource}`,
                    })(<Input readOnly placeholder="请选择项目类别" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.years}>
                    {getFieldDecorator('years', {
                      rules: [{ required: true, message: '请选择年度' }],
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
                      initialValue: `新建`,
                    })(<Input placeholder="请选择项目状态" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.number}>
                    {getFieldDecorator('number', {
                      rules: [{ required: false, message: '请输入项目编码' }],
                      initialValue:
                        `${rowInfo.projectCode}` === 'undefined' ? '' : `${rowInfo.projectCode}`,
                    })(<Input placeholder="自动带出" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.customer}>
                    {getFieldDecorator('customer', {
                      rules: [{ required: true, message: '请选择客户' }],
                    })(
                      <Search
                        placeholder="请选择客户"
                        onSearch={this.handleChoiceCusVisible}
                        style={{ width: 200 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.cuslink}>
                    {getFieldDecorator('cuslink', {
                      rules: [{ required: true, message: '请选择客户联系人' }],
                    })(
                      <div>
                        <Input placeholder="请选择客户联系人" style={{ width: '63%' }} />
                        <Divider type="vertical" />
                        <a>新增联系人</a>
                      </div>
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
                  <Form.Item {...formItemLayout} label="项目负责人">
                    {getFieldDecorator('fzperson', {
                      rules: [{ required: true, message: '项目负责人' }],
                    })(
                      <Select placeholder="项目负责人" style={{ width: '100%' }}>
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
                  <Form.Item {...formItemLayout} label="项目部门">
                    {getFieldDecorator('fzperson', {
                      rules: [{ required: true, message: '项目部门' }],
                    })(<Input readOnly placeholder="自动带出" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.fee}>
                    {getFieldDecorator('fee', {
                      rules: [{ required: true, message: '请输入项目费用' }],
                    })(<Input placeholder="请输入项目费用" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="业务来源">
                    {getFieldDecorator('billSource', {
                      rules: [{ required: true, message: '业务来源' }],
                    })(
                      <Select
                        onSelect={this.handleGetBillSourceValue}
                        placeholder="业务来源"
                        style={{ width: '100%' }}
                      >
                        {BillSourceOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                {BillSourceValue === `合伙人` && (
                  <Col span={8}>
                    <Form.Item {...formItemLayout} label="合伙人">
                      {getFieldDecorator('partner')(
                        <Input style={{ width: '100%' }} placeholder="合伙人" />
                      )}
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="施工单位">
                    {getFieldDecorator('shigongdanwei', {
                      initialValue: `${rowInfo.BillSource}`,
                    })(
                      <Search
                        placeholder="施工单位"
                        onSearch={this.handleConstructUnitVisible}
                        style={{ width: 200 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="合同编号">
                    {getFieldDecorator('contractCode')(
                      <div>
                        <Input style={{ width: '68%' }} placeholder="合同编号" />
                        <Divider type="vertical" />
                        <a>新增合同</a>
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="开始时间">
                    {getFieldDecorator('startDate')(
                      <DatePicker style={{ width: '100%' }} placeholder="请输入开始时间" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="结束时间">
                    {getFieldDecorator('endDate')(
                      <DatePicker style={{ width: '100%' }} placeholder="请输入结束日期" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} />
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="指派编号">
                    {getFieldDecorator('zhipaiCode')(
                      <Search placeholder="指派编号+弹出项目指派列表" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} />
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.biztype}>
                    {getFieldDecorator('biztype', {})(
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                          {(`${rowInfo.projectType}` === `工程造价业务项目` ||
                            `${rowInfo.projectType}` === `可研报告`) && (
                            <span>
                              <Col span={8}>
                                <Checkbox value="A">预算编制</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox value="B">结算编制</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox value="D">咨询审核</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox value="E">预算审核</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox value="F">结算审核</Checkbox>
                              </Col>
                              <Col span={8}>
                                <Checkbox value="H">咨询报告</Checkbox>
                              </Col>
                            </span>
                          )}

                          {(`${rowInfo.projectType}` === `招标代理业务项目` ||
                            `${rowInfo.projectType}` === `可研报告`) && (
                            <span>
                              <Col span={8}>
                                <Checkbox value="G">政府采购招标代理</Checkbox>
                              </Col>
                              <Col span={8}>
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
              <Collapse defaultActiveKey={['1', '2', '3']}>
                <Panel header="工程造价业务项目" key="1">
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="项目个数">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="项目个数" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="送审金额">
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="送审金额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核减额">
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="核减额" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核增额">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="核增额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="建筑面积">
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="建筑面积" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核定或预算总造价">
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="核定或预算总造价" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={23} pull={5}>
                        <Form.Item {...formItemLayout} label="备注">
                          {getFieldDecorator('shigongdanwei')(
                            <TextArea style={{ width: '100%' }} placeholder="备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Panel>
                <Panel header="可研报告" key="2">
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="项目个数">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="项目个数" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="送审金额">
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="送审金额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核减额">
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="核减额" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核增额">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="核增额" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="建筑面积">
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="建筑面积" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...formItemLayout} label="核定或预算总造价">
                          {getFieldDecorator('partner')(
                            <Input style={{ width: '100%' }} placeholder="核定或预算总造价" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={23} pull={5}>
                        <Form.Item {...formItemLayout} label="备注">
                          {getFieldDecorator('shigongdanwei')(
                            <TextArea style={{ width: '100%' }} placeholder="备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Panel>
                <Panel header="招标代理业务项目" key="3">
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="招标公告发布">
                          {getFieldDecorator('gonggaofabuDate')(
                            <DatePicker style={{ width: '100%' }} placeholder="招标公告发布" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="招标文件发布">
                          {getFieldDecorator('wenjianfabuDate')(
                            <DatePicker style={{ width: '100%' }} placeholder="招标文件发布" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="开标日期">
                          {getFieldDecorator('kaibiaoDate')(
                            <DatePicker style={{ width: '100%' }} placeholder="开标日期" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="结束日期">
                          {getFieldDecorator('endDate')(
                            <DatePicker style={{ width: '100%' }} placeholder="结束日期" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="项目个数">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="项目个数" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="控制价">
                          {getFieldDecorator('shigongdanwei')(
                            <Input style={{ width: '100%' }} placeholder="控制价" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formItemLayout} label="中标价">
                          {getFieldDecorator('contractCode')(
                            <Input style={{ width: '100%' }} placeholder="中标价" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className={styles['fn-mb-15']}>
                      <Col span={21} pull={3}>
                        <Form.Item {...formItemLayout} label="备注">
                          {getFieldDecorator('shigongdanwei')(
                            <TextArea style={{ width: '100%' }} placeholder="备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Panel>
              </Collapse>
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
}))(Form.create()(ProjectEditModal));
