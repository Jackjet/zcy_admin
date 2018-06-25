import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Select,DatePicker, Transfer } from 'antd';
import { connect } from 'dva';
import styles from './VisitListAdd.less';

const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  visitors: '拜访对象',
  visitType: '拜访方式',
  connectBusiness: '关联商机',
  visitDate: '拜访日期',
  communication : '交流内容',
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

class DictTypeAdd extends PureComponent {
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
  }
  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  }
  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Card>
          <Form layout="horizontal" >
            <Row>
              <Col lg={24} md={24} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.visitors}>
                  {getFieldDecorator('visitors', {
                    rules: [{ required: true, message: '请选择拜访对象' }],
                  })(
                    <Select placeholder="请选择拜访对象" style={{ width: 200 }}>
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
                    rules: [{ required: true, message: '请选择拜访方式' }],
                  })(
                    <Select placeholder="请选择拜访方式" style={{ width: 200 }}>
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
                    rules: [{ required: true, message: '请选择拜访日期' }],
                  })(
                    <DatePicker placeholder="请选择拜访日期"  />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col lg={24} md={24} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.connectBusiness}>
                  {getFieldDecorator('connectBusiness', {
                    rules: [{ required: true, message: '请选择关联商机' }],
                  })(
                    <Select placeholder="请选择关联商机" style={{ width: 200 }}>
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
                    <TextArea placeholder="请输入交流内容" style={{ minHeight: 32 }} rows={4} />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col lg={24} md={24} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.participants}>
                  {getFieldDecorator('participants')(
                    <Transfer
                      dataSource={this.state.mockData}
                      showSearch
                      filterOption={this.filterOption}
                      targetKeys={this.state.targetKeys}
                      onChange={this.handleChange}
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
                    <TextArea placeholder="请输入备注" style={{ minHeight: 32 }} rows={4} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(DictTypeAdd));
