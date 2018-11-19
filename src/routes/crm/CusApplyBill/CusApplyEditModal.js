import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  Input,
  Popover,
  Modal,
  Cascader,
  Collapse,
  Select,
  message,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const linkManTypeOption = {"1":"工程", "2":"招标", "3":"采购"};
const { Option } = Select;
const status = ['已审核', '审核中'];
const { Panel } = Collapse;
const { TextArea } = Input;

const fieldLabels = {
  cusApplyCode: '客户编码',
  cusApplyLevel: '客户等级',
  industry: '所属行业',
  cusApplyName: '客户名称',
  dateRange: '生效日期',
  simpleName: '简称',
  pinyin: ' 拼 音 码 ',
  url: '网站主页',
  taxCode: '税务登记号',
  cusApplyMobilePhone: '移动手机',
  email: '电子邮箱',
  companyPhone: '公司电话',
  postalCode: '邮政编码',
  region: '所在区域',
  incomeTax: '所得税征收方式',
  cusApplyCompany: '所属公司',
  address: '详细地址',
  remark: '备注',
  cusApplyStatus: '状态',
  companyName: '单位名称',
  companyAddress: '单位地址',
  taxNumber: '税号',
  openAccountBank: '开户银行',
  bankAccount: '银行账户',
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

class CusApplyEditModal extends PureComponent {
  state = {
    width: '100%',
    linkManOptionData: ``,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleLinkManTypeChange();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleLinkManTypeChange = () => {
    const optionData = Object.values(linkManTypeOption).map((data,index) => {
      const val = `${data}`;
      const keyNum = `${index}`;
      return <Option key={keyNum} value={keyNum}>{val}</Option>;
    });
    this.setState({
      linkManOptionData: optionData,
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
      cusApplyEditVisible,
      handleCusApplyEditVisible,
      rowInfo,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { linkManOptionData } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          if( values.status === '待审核') {
            const params = {
              ...values,
              status: 1,
            };
            dispatch({
              type: 'cusApplication/update',
              payload: {
                ...params,
                id: rowInfo.id,
                key: rowInfo.key,
              },
              callback: (res) => {
                if(res.meta.status === '000000' ) {
                  handleCusApplyEditVisible(false);
                  this.props.dispatch({
                    type: 'cusApplication/fetch',
                    payload: {
                      page: this.state.pageCurrent,
                      pageSize: this.state.pageSizeCurrent,
                      keyWord: rowInfo.keyWord,
                    },
                  });
                  message.success("申请单更新成功!")
                } else {
                  message.error(res.meta.errmsg);
                }
              },
            });
          }

        }
      });
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="客户申请单信息编辑"
        style={{ top: 20 }}
        visible={cusApplyEditVisible}
        width="40%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleCusApplyEditVisible(false)}
      >
        <Card>
          <Form layout="horizontal">
            <Card>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="客户编码">
                    {getFieldDecorator('number', {
                      rules: [{ required: false, message: '请输入客户编码' }],
                      initialValue:rowInfo.number,
                    })(
                      <Input readOnly placeholder="新增自动产生" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="客户名称">
                    {getFieldDecorator('name', {
                      rules: [{ required: false, message: '请输入客户名称' }],
                      initialValue:rowInfo.name,
                    })(
                      <Input
                        placeholder="请输入客户名称"
                        style={{ width: 200 }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="联系人业务性质">
                    {getFieldDecorator('linkManTypeId', {
                      rules: [{ required: false, message: '请选择联系人业务性质' }],
                      initialValue:rowInfo.linkManTypeId,
                    })(
                      <Select placeholder="请选择联系人业务性质" style={{ width: 200 }}>
                        {linkManOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="状态">
                    {getFieldDecorator('status', {
                      rules: [{ required: false, message: '状态' }],
                      initialValue:rowInfo.status,
                    })(
                      <Input readOnly placeholder="默认待审核" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="联系人">
                    {getFieldDecorator('linkMan', {
                      rules: [{ required: false, message: '请输入联系人' }],
                      initialValue:rowInfo.linkMan,
                    })(<Input placeholder="请输入联系人" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={16} offset={4}>
                  <Form.Item {...formItemLayout} label="联系电话">
                    {getFieldDecorator('phone', {
                      rules: [{ required: false, message: '请输出联系电话' }],
                      initialValue:rowInfo.phone,
                    })(
                      <Input placeholder="请输出联系电话" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(CusApplyEditModal));
