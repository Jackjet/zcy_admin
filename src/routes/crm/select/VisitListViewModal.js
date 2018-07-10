import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Select, DatePicker, Transfer, Modal, Icon, message, Popover } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  visitors: '拜访对象',
  visitType: '拜访方式',
  connectBusiness: '关联商机',
  visitDate: '拜访日期',
  communication: '交流内容',
  participants: '参与人员',
  remarks: '备注',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

class VisitListAddModal extends PureComponent {
  state = {
    width: '90%',
    mockData: [],
    targetKeys: [],
  };
  componentDidMount() {
    this.getMock();
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  };
  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  };
  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting, visitViewVisible, handleVisitViewVisible, rowInfo } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
          handleVisitViewVisible(false);
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
        title="拜访新增"
        style={{ top: 150 }}
        // 对话框是否可见
        visible={visitViewVisible}
        width="60%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleVisitViewVisible()}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.visitors}>
                    {getFieldDecorator('visitors', {
                      rules: [{ required: false, message: '请选择拜访对象' }],
                      initialValue:`${rowInfo.dictID}`,
                    })(
                      <Select disabled placeholder="请选择拜访对象" style={{ width: 200 }}>
                        <Option value="0">电话来访</Option>
                        <Option value="1">客户介绍</Option>
                        <Option value="2">老客户</Option>
                        <Option value="3">代理商</Option>
                        <Option value="4">合作伙伴</Option>
                        <Option value="5">公开招聘</Option>
                        <Option value="6">互联网</Option>
                        <Option value="7">自主开发</Option>
                        <Option value="8">其他</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.visitType}>
                    {getFieldDecorator('visitType', {
                      rules: [{ required: false, message: '请选择拜访方式' }],
                    })(
                      <Select disabled placeholder="请选择拜访方式" style={{ width: 200 }}>
                        <Option value="0">电话来访</Option>
                        <Option value="1">现场拜访</Option>
                        <Option value="8">其他</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.visitDate}>
                    {getFieldDecorator('visitDate', {
                      rules: [{ required: false, message: '请选择拜访日期' }],
                    })(<DatePicker disabled placeholder="请选择拜访日期" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.connectBusiness}>
                    {getFieldDecorator('connectBusiness', {
                      rules: [{ required: false, message: '请选择关联商机' }],
                    })(
                      <Select disabled placeholder="请选择关联商机" style={{ width: 200 }}>
                        <Option value="0">电话来访</Option>
                        <Option value="1">现场拜访</Option>
                        <Option value="8">其他</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.communication}>
                    {getFieldDecorator('communication')(
                      <TextArea disabled placeholder="请输入交流内容" style={{ minHeight: 32 }} rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.participants}>
                    {getFieldDecorator('participants')(
                      <Transfer
                        // 数据源，其中的数据将会被渲染到左边一栏中，targetKeys 中指定的除外。
                        dataSource={this.state.mockData}
                        // 接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
                        filterOption={this.filterOption}
                        listStyle={{
                          width: 150,
                          height: 150,
                        }}
                        // 显示在右侧框数据的key集合
                        targetKeys={this.state.targetKeys}
                        // 选项在两栏之间转移时的回调函数
                        onChange={this.handleChange}
                        // 每行数据渲染函数，该函数的入参为 dataSource 中的项，返回值为 ReactElement。
                        // 或者返回一个普通对象，其中 label 字段为 ReactElement，value 字段为 title
                        render={item => item.title}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.remarks}>
                    {getFieldDecorator('remarks')(
                      <TextArea disabled placeholder="请输入备注" style={{ minHeight: 32 }} rows={4} />
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
}))(Form.create()(VisitListAddModal));
