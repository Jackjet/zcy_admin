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
  Radio,
} from 'antd';
import { connect } from 'dva';
import styles from '../Project/ProInfoManage/style.less';


const { Search }= Input;
const RadioGroup = Radio.Group;
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

class AddModalDemo extends PureComponent {
  state = {
    width: '100%',
    radioTypeKey: 0,
    contractOptionData:[],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleGetRadioValue = (RadioValue) => {
    this.setState({
      radioTypeKey: RadioValue.key,
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
    const { form, dispatch, submitting, handleContractAddVisible, handleContractTypeVisible, contractTypeVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { radioTypeKey } =this.state;
    const validate = () => {
      validateFieldsAndScroll(() => {
        if(radioTypeKey === 0){
          message.config({
            top: 100,
            duration: 2,
            maxCount: 1,
          });
          message.warning(
            '请选择合同类型',
          );
          return false;
        }
        handleContractTypeVisible(false);
        handleContractAddVisible(true);
      });
    };
    const cancel = () => {
      form.resetFields();
      handleContractTypeVisible(false);
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
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Modal
        title={<h5><span> 请选择合同类别</span></h5>}
        style={{ top: 20 }}
        visible={contractTypeVisible}
        width="20%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancel}
        destroyOnClose='true'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Form.Item {...formItemLayout}>
                {getFieldDecorator('contractTitle', {

                })(
                  <RadioGroup onChange={this.handleGetRadioValue}>
                    <Radio style={radioStyle} value={1}>年度合同</Radio>
                    <Radio style={radioStyle} value={2}>单项合同</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
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
}))(Form.create()(AddModalDemo));
