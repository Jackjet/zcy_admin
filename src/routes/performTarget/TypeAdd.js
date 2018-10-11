import React, { PureComponent } from 'react';
import moment from "moment/moment";
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
  Upload,
  Button,
  Popover,
} from 'antd';
import { connect } from 'dva';
import styles from './TypeList.less';

const { Search }= Input;
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
  contractCode: '指标编码',
  contractType: '分值',
  years: '达标值',
  projectName: '指标名称',
  contractStatus: '挑战值',
  contractTitle: '指标名称',
  dfCompany: '指标描述',
  authorizedAgent: '评价标准',
  PartyAcompany: '回报频度',
  PartyBcompany: '乙方公司',
  fatherContract: '父合同',
  signDate: '签订日期',
  paymentMethod: '付款方式',
  businessType: '评价标准',
  contractSignPlace: '合同签订地点',
  contractSubject: '合同标的',
  startDate: '开始日期',
  endDate: '结束日期',
  totalAmount: '合同金额',
  fzperson: '指标性质',
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

class TypeAdd extends PureComponent {
  state = {
    width: '100%',
    contractOptionData:[],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { form, dispatch, submitting, contractVisible, handleContractVisible, choiceTypeValue } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const {contractOptionData} = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功');
          handleContractVisible(false);
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
        title="指标信息新增"
        style={{ top: 20 }}
        visible={contractVisible}
        width="50%"
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleContractVisible()}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row  className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.contractCode}>
                    {getFieldDecorator('contractCode', {
                      rules: [{ required: true, message: '不重复的数字' }],
                    })(
                      <Input placeholder="自动生成" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.fzperson}>
                    {getFieldDecorator('fzperson', {
                      rules: [{ required: true, message: '请选择指标性质' }],
                    })(
                      <Select placeholder="请选择指标性质" >
                        <Option key={1}>增加考核分</Option>
                        <Option key={2}>减少考核分</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>



              </Row>
              <Row className={styles['fn-mb-15']} >

                <Col span={12} >
                  <Form.Item {...formItemLayout} label={fieldLabels.contractTitle}>
                    {getFieldDecorator('contractTitle')(<TextArea placeholder="请输入指标名称信息" rows={4} style={{width:'170%'}} />)}
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.contractType}>
                    {getFieldDecorator('contractType', {
                      rules: [{ required: true, message: '分值' }],
                    })(
                      <Input placeholder="分值" />
                    )}
                  </Form.Item>
                </Col>


              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.dfCompany}>
                    {getFieldDecorator('dfCompany')(<TextArea placeholder="请输入指标描述" rows={4} style={{width:'170%'}} />)}
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item {...formItemLayout} label={fieldLabels.authorizedAgent}>
                    {getFieldDecorator('authorizedAgent')(<TextArea placeholder="请输入评价标准" rows={4} style={{width:'170%'}} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['fn-mb-15']}>
                <Col span={24} pull={4}>
                  <Form.Item {...formItemLayout} label={fieldLabels.remark}>
                    {getFieldDecorator('remark')(<TextArea placeholder="请输入备注信息" rows={4} style={{width:'170%'}} />)}
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
}))(Form.create()(TypeAdd));
