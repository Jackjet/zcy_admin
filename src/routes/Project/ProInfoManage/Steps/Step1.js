import React, { Fragment ,PureComponent} from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  Divider,
  Layout,
  Steps,
  Collapse,
  Checkbox,
  Upload,
  Tree,
  Card,
  message,
} from 'antd';
import moment from "moment/moment";
import SubmitProcessModal from '../SubmitProcessModal';
import styles from './style.less';

const { Search } = Input;
const mockData = [];
for (let i = 0; i < 10; i+=1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
};
const { TextArea } = Input;
const { Option } = Select;
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

class Step1 extends PureComponent {
  state = {
    BillSourceOptionData: [],  // 业务来源类型option
    BillSourceValue:``, //
    ProTypeOptionData: [], // 项目类型option
    ProTypeValue: ``,
    submitProcessVisible: false,
  };
  componentDidMount() {
    this.handleBillSourceOption();
    this.handleProTypeOption();
  }

  // 根据数据中的数据，动态加载业务来源的Option
  handleBillSourceOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/getDict', // 接口
      payload: {
        dictTypeId: 'be407dc3eefc11e89655186024a65a7c', // 数据类型id
      },
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            BillSourceOptionData: res.data.list, // 返回结果集给对应的状态
          });
        }
      },
    });
  };

  // 根据数据中的数据，动态加载业务来源的Option
  handleProTypeOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/getDict', // 接口
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
  };

  handleSubmitProcessVisible = flag => {
    this.setState({
      submitProcessVisible: !!flag,
    });
  };

  // 获取业务来源的Option的value对应的name
  handleGetBillSourceValue = (val) =>{
    console.log(val);
    this.state.BillSourceOptionData.forEach(item =>{
      if (val === item.id) {
        this.setState({
          BillSourceValue: item.name,
        });
      }
    });
  };

  // 获取项目类型的Option的value对应的name
  handleProTypeSourceValue = (val) =>{
    console.log(val);
    this.state.ProTypeOptionData.forEach(item =>{
      if (val === item.id ){
        this.setState({
          ProTypeValue: item.name,
        });
      }
    });
  };


  render() {
    const { form, dispatch, loading, submitting, handleNext, messageClickData } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { BillSourceValue, ProTypeValue, submitProcessVisible } = this.state;
    const parentMethods = {
      handleSubmitProcessVisible: this.handleSubmitProcessVisible,
    };
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'project/add',
            payload: values,
            callback: (res) => {
              if(res.meta.status !== "000000"){
                message.error(res.meta.errmsg);
              } else {
                message.success("提交成功!");
                handleNext(true);
                /*dispatch(routerRedux.push('/project/projectStart/confirm'));*/
              }
            },
          });
        }
      });
    };
    return (
      <Card>
        <Form layout="horizontal">
          <Row className={styles['fn-mb-15']}>
            <Col span={23} pull={5}>
              <Form.Item {...formItemLayout} label="项目名称">
                {getFieldDecorator('name', {
                  rules: [{ required: false, message: '请输入项目名称' }],
                  initialValue: messageClickData === null ? "" : messageClickData.name,
                })(
                  <Input  placeholder="请输入项目名称" style={{width:'140%'}} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="客户">
                {getFieldDecorator('customer', {
                  rules: [{ required: false, message: '请选择客户' }],
                })(
                  <Search
                    placeholder="请选择客户"
                    style={{ width: 150 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item {...formItemLayout} label="联系人">
                {getFieldDecorator('linkman', {
                  rules: [{ required: false, message: '请选择联系人' }],
                })(
                  <div>
                    <Input  placeholder="请选择联系人" style={{ width: '68%' }} />
                    <Divider type="vertical" className={styles['ant-verticalHz']} />
                    <a>新增联系人</a>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={8} >
              <Form.Item {...formItemLayout} label="项目类别">
                {getFieldDecorator('type', {
                  rules: [{ required: false, message: '请选择项目类别' }],
                })(
                  <Select
                    onChange={this.handleProTypeSourceValue}
                    placeholder="请选择项目类别"
                    style={{ width: 150 }}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {this.state.ProTypeOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item {...formItemLayout} label='合同'>
                {getFieldDecorator('contract')(
                  <div>
                    <Input  style={{ width: '68%' }} placeholder="合同" />
                    <Divider type="vertical"  />
                    <a>新增合同</a>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="业务来源">
                {getFieldDecorator('billSource', {
                  rules: [{ required: false, message: '业务来源' }],
                })(
                  <Select
                    onChange={this.handleGetBillSourceValue}
                    placeholder="请选择业务来源"
                    style={{ width: 150 }}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {this.state.BillSourceOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {
              ( BillSourceValue === `个人业务`)&& (
                <Col span={16}>
                  <Form.Item {...formItemLayout} label='业务人'>
                    {getFieldDecorator('partner')(
                      <Search  style={{ width: 150 }} placeholder="业务人" />
                    )}
                  </Form.Item>
                </Col>
              )
            }

            {
              ( BillSourceValue === `他人业务` )&& (
                <Col span={16}>
                  <Form.Item {...formItemLayout} label='业务人'>
                    {getFieldDecorator('billPerson')(
                      <Input  style={{ width: 150 }} placeholder="业务人" />
                    )}
                  </Form.Item>
                </Col>
              )
            }
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={8}>
              <Form.Item {...formItemLayout} label='分管领导'>
                {getFieldDecorator('leadership',{
                })(
                  <Search
                    placeholder="分管领导"
                    onSearch={this.handleConstructUnitVisible}
                    style={{ width: 150 }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={8}>
              <Form.Item {...formItemLayout} label='开始时间'>
                {getFieldDecorator('startTime')(
                  <DatePicker  style={{ width: 150 }} placeholder="开始时间" />
                )}
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item {...formItemLayout} label="结束日期">
                {getFieldDecorator('endTime')(
                  <DatePicker placeholder="结束日期" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={23} pull={5}>
              <Form.Item {...formItemLayout} label='说明'>
                {getFieldDecorator('remark',{
                })(
                  <TextArea style={{width:'140%'}} placeholder="说明" rows={4} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">{ProTypeValue}</Divider>
          { ( ProTypeValue === `工程造价业务项目` )&& (
            <div>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='送审金额'>
                    {getFieldDecorator('trialAmount')(
                      <Input style={{ width: '100%' }} placeholder="送审金额" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='施工单位'>
                    {getFieldDecorator('constructionUnit')(
                      <Input style={{ width: '100%' }} placeholder="施工单位" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}
          { ( ProTypeValue === `司法鉴定` )&& (
            <div>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='送审金额'>
                    {getFieldDecorator('contractCode')(
                      <Input style={{ width: '100%' }} placeholder="送审金额" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='施工单位'>
                    {getFieldDecorator('partner')(
                      <Input style={{ width: '100%' }} placeholder="施工单位" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}
          { ( ProTypeValue === `招标代理业务项目`) && (
            <div>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='招标公告发布'>
                    {getFieldDecorator('shigongdanwei')(
                      <DatePicker  style={{ width: '100%' }} placeholder="招标公告发布" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='招标文件发布'>
                    {getFieldDecorator('contractCode')(
                      <DatePicker  style={{ width: '100%' }} placeholder="招标文件发布" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='开标日期'>
                    {getFieldDecorator('shigongdanwei')(
                      <DatePicker  style={{ width: '100%' }} placeholder="开标日期" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='结束日期'>
                    {getFieldDecorator('contractCode')(
                      <DatePicker  style={{ width: '100%' }} placeholder="结束日期" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='项目个数'>
                    {getFieldDecorator('shigongdanwei')(
                      <Input style={{ width: '100%' }} placeholder="项目个数" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='控制价'>
                    {getFieldDecorator('shigongdanwei')(
                      <Input style={{ width: '100%' }} placeholder="控制价" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='中标价'>
                    {getFieldDecorator('contractCode')(
                      <Input style={{ width: '100%' }} placeholder="中标价" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={21} pull={3}>
                  <Form.Item {...formItemLayout} label='备注'>
                    {getFieldDecorator('shigongdanwei')(
                      <TextArea style={{ width: '100%' }} placeholder="备注" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}
          <Form.Item
            style={{ marginBottom: 8 }}
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <span>
              <Button type="primary" onClick={onValidateForm} loading={submitting} style={{ left: 400 }}>
                保存
              </Button>
              {/*<Button type="primary" onClick={() => this.handleSubmitProcessVisible(true)} style={{ marginLeft: 8, left: 400 }}>
                提交
              </Button>*/}
            </span>
          </Form.Item>
        </Form>
        <SubmitProcessModal {...parentMethods} submitProcessVisible={submitProcessVisible} />
      </Card>
    );
  }
}

export default connect(({ project, loading }) => ({
  project,
  submitting: loading.effects['project/add'],
}))(Form.create()(Step1));
