import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Popover,
  Modal,
  Button,
} from 'antd';
import { connect } from 'dva';
import styles from './Style.less';

const { TextArea } = Input;
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

class OrgUnitViewModal extends PureComponent {
  state = {
    width: '100%',
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
    const { form, dispatch, submitting, OrgUnitViewVisible, handleOrgUnitViewVisible, rowInfo } = this.props;
    const { getFieldDecorator, getFieldsError } = form;
    const validate = () => {
      handleOrgUnitViewVisible(false);
    };
    const cancelDate = () => {
      handleOrgUnitViewVisible(false);
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
        keyboard={false}
        title="组织机构基本信息查看"
        style={{ top: 20 }}
        visible={OrgUnitViewVisible}
        width="55%"
        maskClosable={false}
        onCancel={cancelDate}
        okText='提交'
        footer={[
          <Button type="primary" onClick={validate}>知道了</Button>,
        ]}
      >
        <Card>
          <Form layout="horizontal">
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="组织名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入组织名称' }],
                    initialValue:`${rowInfo.name}`,
                  })(
                    <Input readOnly placeholder="请输入组织名称" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item {...formItemLayout} label="上级组织">
                  {getFieldDecorator('parentOrg', {
                    rules: [{ required: true, message: '请选择上级组织' }],
                    initialValue:`至诚`,
                  })(
                    <Input readOnly />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="组织编码">
                  {getFieldDecorator('number', {
                    rules: [{ required: true, message: '请输入组织编码' }],
                    initialValue:`${rowInfo.number}`,
                  })(
                    <Input readOnly placeholder="请输入组织编码" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="是否分公司">
                  {getFieldDecorator('isBranch', {
                    rules: [{ required: true, message: '是否分公司' }],
                    initialValue:`${rowInfo.isBranch}`,
                  })(
                    <Input readOnly placeholder="请输入组织编码" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="简称">
                  {getFieldDecorator('simpleName', {
                    rules: [{ required: false, message: '请输入简称' }],
                  })(
                    <Input readOnly placeholder="请输入简称" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="英文名称">
                  {getFieldDecorator('englishName', {
                    rules: [{ required: false, message: '请输入英文名称' }],
                  })(
                    <Input readOnly placeholder="请输入英文名称" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="负责人">
                  {getFieldDecorator('principal', {
                    rules: [{ required: false, message: '请选择负责人' }],
                    initialValue:`${rowInfo.principal}`,
                  })(
                    <Input readOnly />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="联系人">
                  {getFieldDecorator('linkMan', {
                    rules: [{ required: false, message: '请输入联系人' }],
                  })(
                    <Input readOnly placeholder="请输入联系人" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="移动电话">
                  {getFieldDecorator('mobilePhone', {
                    rules: [{ required: false, message: '请输入移动电话' }],
                  })(
                    <Input readOnly placeholder="请输入移动电话" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="电话">
                  {getFieldDecorator('phone', {
                    rules: [{ required: false, message: '请输入电话' }],
                  })(
                    <Input readOnly placeholder="请输入电话" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="电子邮箱">
                  {getFieldDecorator('enterpriseEmail', {
                    rules: [{ required: false, message: '请输入电子邮箱' }],
                    initialValue:`${rowInfo.enterpriseEmail}`,
                  })(
                    <Input readOnly placeholder="请输入电子邮箱" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="邮政编码">
                  {getFieldDecorator('postalCode', {
                    rules: [{ required: false, message: '请输入邮政编码' }],
                    initialValue:`${rowInfo.postalCode}`,
                  })(
                    <Input readOnly placeholder="请输入邮政编码" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="传真">
                  {getFieldDecorator('fax', {
                    rules: [{ required: false, message: '请输入传真' }],
                    initialValue:`${rowInfo.fax}`,
                  })(
                    <Input readOnly placeholder="请输入传真" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="海关编码">
                  {getFieldDecorator('customsCode', {
                    rules: [{ required: false, message: '请输入海关编码' }],
                    initialValue:`${rowInfo.customsCode}`,
                  })(
                    <Input readOnly placeholder="请输入海关编码" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="EDI编码">
                  {getFieldDecorator('ediNum', {
                    rules: [{ required: false, message: '请输入EDI编码' }],
                    initialValue:`${rowInfo.ediNum}`,
                  })(
                    <Input readOnly placeholder="请输入EDI编码" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="税务编码">
                  {getFieldDecorator('taxCode', {
                    rules: [{ required: false, message: '请输入税务编码' }],
                    initialValue:`${rowInfo.taxCode}`,
                  })(
                    <Input readOnly placeholder="请输入税务编码" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="详细地址">
                  {getFieldDecorator('address', {
                    rules: [{ required: false, message: '请输入详细地址' }],
                  })(
                    <TextArea readOnly placeholder="请输入详细地址" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="网站首页">
                  {getFieldDecorator('url', {
                    rules: [{ required: false, message: '请输入网站首页' }],
                    initialValue:`${rowInfo.url}`,
                  })(
                    <Input readOnly placeholder="请输入网站首页" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={21} pull={3}>
                <Form.Item {...formItemLayout} label="备注">
                  {getFieldDecorator('remarks', {
                    rules: [{ required: false, message: '备注' }],
                    initialValue:`${rowInfo.remarks}`,
                  })(
                    <TextArea readOnly placeholder="请输入备注信息" rows={2} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(OrgUnitViewModal));
