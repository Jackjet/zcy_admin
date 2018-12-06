import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Transfer,
  Modal,
  Icon,
  message,
  Popover,
  Tree,
  Checkbox,
} from 'antd';
import { connect } from 'dva';
import TableForm from "./TableFormDemo";
import styles from './style.less';

const tableData=[];
const mockData = [];
for (let i = 0; i < 10; i += 1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
}
const CheckboxGroup = Checkbox.Group;
const { TreeNode } = Tree;
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

class ChangePlanModal extends PureComponent {
  state = {
    width: '90%',
    selectedKeys: [],
    targetKeys: [],
    showPartnerVisible: 0,
    showChange: 0,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  // 勾选配合展示合伙人选择框
  showPartner = (e) => {
    if (e.target.value === true) {
      this.setState({
        showPartnerVisible: 0,
      })
    } else if (e.target.value === false) {
      this.setState({
        showPartnerVisible: 1,
      })
    }

  };

  // 勾选配合展示合伙人选择框
  showChange = (e) => {
    if (e.target.value === true) {
      this.setState({
        showChange: 0,
      })
    } else if (e.target.value === false) {
      this.setState({
        showChange: 1,
      })
    }
  };

  renderItem = (item) => {
    return (
      item.title
    );
  };

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting, changePlanVisible, handleChangePlanVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { selectedKeys, showPartnerVisible, showChange } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功');
          handleChangePlanVisible(false);
        }
      });
    };
    const cancel = () => {
      handleChangePlanVisible(false);
    };
    const plainOptions = ['人员变更', '计划变更'];
    const plainOptions2 = ['是', '否'];
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="变更"
        style={{ top: 20 }}
        visible={changePlanVisible}
        width="50%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={cancel}
        okText="提交"
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col lg={12} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="委托人">
                    {getFieldDecorator('weituoperson', {
                      rules: [{ required: false, message: '委托人' }],
                    })(
                      <Input placeholder="委托人" />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="项目名称">
                    {getFieldDecorator('biangeng' +
                      '', {
                      rules: [{ required: false, message: '项目名称' }],
                    })(
                      <Input placeholder="项目名称" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col lg={12} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="变更理由">
                    {getFieldDecorator('person', {
                      rules: [{ required: false, message: '变更理由' }],
                    })(
                      <TextArea placeholder="变更理由" rows={3}  />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {/*<Row>
                <Col lg={12} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="变更">
                    {getFieldDecorator('biangeng', {
                      rules: [{ required: false, message: '变更' }],
                    })(
                      <CheckboxGroup options={plainOptions} />
                    )}
                  </Form.Item>
                </Col>
              </Row>*/}
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="人员变更">
                    {getFieldDecorator('person', {
                      rules: [{ required: false, message: '人员变更' }],
                      initialValue: false,
                    })(
                      <Checkbox onChange={this.showPartner} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {(showPartnerVisible === 1 )&&(
                <Row className={styles['fn-mb-15']}>
                  <Col>
                    <Form.Item {...formItemLayout}>
                      {getFieldDecorator('partner', {
                        rules: [{ required: false, message: '' }],
                      })(
                        <Transfer
                          dataSource={mockData}
                          titles={['可选人员', '已选人员']}
                          targetKeys={this.state.targetKeys}
                          showSearch
                          onChange={this.handleChange}
                          onSearch={this.handleSearch}
                          render={this.renderItem}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formItemLayout} label="计划变更">
                    {getFieldDecorator('plan', {
                      rules: [{ required: false, message: '计划变更' }],
                      initialValue: false,
                    })(
                      <Checkbox onChange={this.showChange} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {(showChange === 1 )&&(
                <Row className={styles['fn-mb-15']}>
                  <Col>
                    <Form.Item {...formItemLayout} label="">
                      {getFieldDecorator('partner', {
                        rules: [{ required: false, message: '' }],
                        initialValue: tableData,
                      })(
                        <TableForm />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label="变更考核时间">
                    {getFieldDecorator('weituoren', {
                      rules: [{ required: false, message: '变更考核时间' }],
                      initialValue: '否',
                    })(
                      <CheckboxGroup options={plainOptions2} />
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
}))(Form.create()(ChangePlanModal));
