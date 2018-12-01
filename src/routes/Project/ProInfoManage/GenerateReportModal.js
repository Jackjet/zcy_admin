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
  Collapse,
} from 'antd';
import { connect } from 'dva';
import EnterReportModal from './EnterReportModal';
import styles from './style.less';

const mockData = [];
for (let i = 0; i < 10; i += 1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
}
const { Search } = Input;
const { Panel } = Collapse;
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
    sm: { span: 16 },
  },
};

class GenerateReportModal extends PureComponent {
  state = {
    width: '90%',
    selectedKeys: [],
    targetKeys: [],
    enterReportVisible: false, // 报告确认弹窗
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  };
  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  handleEnterReportVisible = (flag) => {
    this.setState({
      enterReportVisible: !!flag,
    })
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting, generateReportVisible, handleGenerateReportVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { selectedKeys, enterReportVisible } = this.state;
    const validate = () => {
      this.handleEnterReportVisible(true);
      /*validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
        }
      });*/
    };
    const parentMethods = {
      handleEnterReportVisible: this.handleEnterReportVisible,
      handleGenerateReportVisible: this.props.handleGenerateReportVisible,
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="生成报告"
        style={{ top: 20 }}
        // 对话框是否可见
        visible={generateReportVisible}
        width="65%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleGenerateReportVisible(false)}
        okText="生成报告"
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="标题">
                    {getFieldDecorator('visitors', {
                      rules: [{ required: false, message: '标题' }],
                    })(
                      <Input placeholder="请选择输入标题" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="项目名">
                    {getFieldDecorator('visitType', {
                      rules: [{ required: false, message: '项目名' }],
                    })(
                      <Input placeholder="请输入项目名" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="报告号">
                    {getFieldDecorator('visitType', {
                      rules: [{ required: false, message: '报告号' }],
                    })(
                      <Search
                        readOnly
                        placeholder="自动生成报告号"
                        enterButton="生成报告号"
                        onSearch={value => console.log(value)}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Collapse defaultActiveKey={['1']}>
                <Panel header="工程造价业务项目" key="1">
                  <Row className={styles['fn-mb-15']}>
                    <Col span={8} pull={1}>
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
                    <Col span={8} push={1}>
                      <Form.Item {...formItemLayout} label="核减额">
                        {getFieldDecorator('partner')(
                          <Input style={{ width: '100%' }} placeholder="核减额" />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={8} pull={1}>
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
                    <Col span={8} push={1}>
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
               {/* <Panel header="可研报告" key="2">
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
                </Panel>*/}
              {/*  <Panel header="招标代理业务项目" key="3">
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
                </Panel>*/}
              </Collapse>
              <Row>
                <Col>
                  <Form.Item label="工程概况">
                    {getFieldDecorator('visitors', {
                      rules: [{ required: false, message: '工程概况' }],
                    })(
                      <TextArea placeholder="请输入工程概况" rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item label="审核依据">
                    {getFieldDecorator('visitors', {
                      rules: [{ required: false, message: '审核依据' }],
                    })(
                      <TextArea placeholder="请输入审核依据" rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item label="审核说明">
                    {getFieldDecorator('visitors', {
                      rules: [{ required: false, message: '审核说明' }],
                    })(
                      <TextArea placeholder="请输入审核说明" rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item label="审核核增(减)原因">
                    {getFieldDecorator('visitors', {
                      rules: [{ required: false, message: '审核核增(减)原因' }],
                    })(
                      <TextArea placeholder="请输入审核核增(减)原因" rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item label="与合同价相比增减情况分析">
                    {getFieldDecorator('visitors', {
                      rules: [{ required: false, message: '与合同价相比增减情况分析' }],
                    })(
                      <TextArea placeholder="请输入与合同价相比增减情况分析" rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <EnterReportModal {...parentMethods} enterReportVisible={enterReportVisible} />
          </Card>
        </div>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(GenerateReportModal));
