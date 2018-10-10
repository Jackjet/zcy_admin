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
  Select,
  InputNumber,
  Table,
  Divider,
} from 'antd';
import { connect } from 'dva';
import styles from './Style.less';

const fieldLabels = {
  commissionType: '提成比例类别',
  commissionCoefficient: '提成比例系数',
  status: '状态',
  subordinateUnit: '所属单位',
  remarks: '备注',
};



@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class PartnerType extends PureComponent {


  state = {
    width: '100%',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleGiveValue = (text) => {
    this.props.handlePartnerTypeValue(text);
    this.props.handlePartnerTypeVisible(false);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting , partnerTypeVisible, handlePartnerTypeVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          form.resetFields();
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handlePartnerTypeVisible(false);
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handlePartnerTypeVisible(false);
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
    const data = [{
      key: '1',
      name: '执行合伙人',
      Type: 32,
    }, {
      key: '2',
      name: '技术合伙人',
      Type: 42,
    }, {
      key: '3',
      name: '管理合伙人',
      Type: 32,
    }];
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a onDoubleClick={() =>this.handleGiveValue(text)}>{text}</a>,
    }, {
      title: 'Type',
      dataIndex: 'Type',
    }];

    return (
      <Modal
        title="单位选择"
        style={{ top: 180 }}
        visible={partnerTypeVisible}
        width="30%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        footer={null}
      >
        <div>
          <Card>
            <Table
              columns={columns}
              dataSource={data}
              onRow={(record) => {
                return {
                  onClick: () => {this.handleGiveValue(record.name)},
                };
              }}
            />
          </Card>
        </div>
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(PartnerType));
