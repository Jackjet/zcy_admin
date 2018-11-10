import React, { PureComponent } from 'react';
import { Card, Form, Icon, Col, Row, DatePicker, Input, Select, Popover, Modal, Table } from 'antd';
import { connect } from 'dva';

import styles from './Style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Search } = Input;
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

class AssignRoleModal extends PureComponent {
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
    const { form, dispatch, submitting, AssignRoleVisible, handleAssignRoleVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          form.resetFields();
          handleAssignRoleVisible(false);
        }
      });
    };
    const cancelDate = () => {
      form.resetFields();
      handleAssignRoleVisible(false);
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
    const dataSourceTest = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ];

    const columnsTest = [
      {
        title: '分配组织编码',
        dataIndex: 'name',
        key: 'name',
        width: 120,
      },
      {
        title: '分配组织名称',
        dataIndex: 'age',
        key: 'age',
        width: 120,
      },
      {
        title: '用户名',
        dataIndex: 'address',
        key: 'address',
        width: 120,
      },
      {
        title: '类型',
        dataIndex: 'address',
        key: 'address',
        width: 120,
      },
      {
        title: '用户实名',
        dataIndex: 'address',
        key: 'address',
        width: 120,
      },
      {
        title: '所属单位',
        dataIndex: 'address',
        key: 'address',
        width: 120,
      },
    ];
    return (
      <Modal
        title="分配用户"
        style={{ top: 20 }}
        visible={AssignRoleVisible}
        width="55%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText="提交"
      >
        <Card>
          <Form layout="horizontal">
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="角色">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '自动生成' }],
                  })(<Search placeholder="角色" onSearch="" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="组织">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入名称' }],
                  })(<Search placeholder="组织" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={23} push={4}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator('describe', {
                    rules: [{ required: true, message: '请输入描述' }],
                  })(<Table dataSource={dataSourceTest} columns={columnsTest} />)}
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
}))(Form.create()(AssignRoleModal));
