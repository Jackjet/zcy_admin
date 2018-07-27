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
  Button,
  Divider,
  Tabs,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const {TabPane} = Tabs;
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

class KnowledgeViewModal extends PureComponent {
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
    const { form, dispatch, submitting, KnowledgeViewVisible, handleKnowledgeViewVisible } = this.props;
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
          handleKnowledgeViewVisible(false);
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
        visible={KnowledgeViewVisible}
        width="60%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleKnowledgeViewVisible()}
      >
        <div>
          <Form layout="horizontal">
            <Row>
              <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                <Form.Item {...formItemLayout} >
                  {getFieldDecorator('visitors', {
                  })(
                    <div>
                      <Card>
                        <div style={{fontSize: 30}}>XXX项目案例</div>
                        <Card>
                          <Input placeholder="文档标题" />
                        </Card>
                        <Card>
                          <Row gutter={12}>
                            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                              <Button type="ghost">顶(8)</Button>
                            </Col>
                            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                              <Button type="ghost">点赞(16)</Button>
                            </Col>
                          </Row>
                        </Card>
                        <Card>
                          <Row>
                            <Col >
                              <Tabs defaultActiveKey="1">
                                <TabPane tab="文档介绍" key="1">Content of Tab Pane 1</TabPane>
                                <TabPane tab="文档评论" key="2">Content of Tab Pane 2</TabPane>
                              </Tabs>
                            </Col>
                          </Row>
                        </Card>
                      </Card>
                    </div>
                  )}
                </Form.Item>
              </Col>
              <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                <Form.Item {...formItemLayout} >
                  {getFieldDecorator('visitors', {
                  })(
                    <div>
                      <Card>
                        <Button type="ghost">下载文档</Button>
                        <Divider />
                        <Button type="dashed">收藏文档</Button>
                      </Card>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(KnowledgeViewModal));
