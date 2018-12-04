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
import styles from './style.less';

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
class ChoiceCusModal extends PureComponent {
  state = {
    width: '100%',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleGiveValue = text => {
    this.props.handleGetCusValue(text);
    this.props.handleChoiceCusVisible(false);
  };
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting, choiceCusVisible, handleChoiceCusVisible } = this.props;
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
          handleChoiceCusVisible(false);
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handleChoiceCusVisible(false);
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
    const data = [
      {
        key: '1',
        name: '义务至诚客户',
        age: 32,
        address: '111',
      },
      {
        key: '2',
        name: '大义务客户',
        age: 42,
        address: '222',
      },
      {
        key: '3',
        name: '大杭州客户',
        age: 32,
        address: '333',
      },
    ];
    const columns = [
      {
        title: '客户',
        dataIndex: 'name',
        render: text => <a onDoubleClick={() => this.handleGiveValue(text)}>{text}</a>,
      },
      {
        title: '字段A',
        dataIndex: 'age',
      },
      {
        title: '字段B',
        dataIndex: 'address',
      },
    ];

    return (
      <Modal
        title="客户选择"
        style={{ top: 180 }}
        visible={choiceCusVisible}
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
              onRow={record => {
                return {
                  onClick: () => {
                    this.handleGiveValue(record.name);
                  },
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
}))(Form.create()(ChoiceCusModal));
