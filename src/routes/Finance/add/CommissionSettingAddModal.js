import React, { PureComponent } from 'react';
import { Card, Form, Icon, Col, Row, Input, Popover, Modal, Select, InputNumber } from 'antd';
import { connect } from 'dva';
import SubordinateUnitModal from './SubordinateUnitModal';
import styles from '../add/style.less';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const CommissionSettingOption = ['类别A', '类别B', '类别C'];

const fieldLabels = {
  commissionType: '提成比例类别',
  commissionCoefficient: '提成比例系数',
  status: '状态',
  subordinateUnit: '所属单位',
  remarks: '备注',
};

const formhz11 = {
  wrapperCol: {
    style: {
      width: '60%',
    },
  },
  style: {
    width: '101%',
  },
};
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class CommissionSettingAddModal extends PureComponent {
  state = {
    width: '100%',
    subordinateUnitVisible: false,
    getUnitValue: ['杭州至诚云'],
    commissionSettingOptionData: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleCommissionSettingChange = () => {
    this.setState({
      commissionSettingOptionData: CommissionSettingOption.map(data => {
        const value = `${data}`;
        return <Option value={value}>{value}</Option>;
      }),
    });
  };

  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleSubordinateUnitVisible = flag => {
    this.setState({
      subordinateUnitVisible: !!flag,
    });
  };

  handleChangeUnitValue = unit => {
    this.setState({
      getUnitValue: unit,
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
      commissionSetAddVisible,
      handleCommissionSetAddVisible,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { commissionSettingOptionData, subordinateUnitVisible, getUnitValue } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          form.resetFields();
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handleCommissionSetAddVisible(false);
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handleCommissionSetAddVisible(false);
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

    const subordinateUnitMethods = {
      handleSubordinateUnitVisible: this.handleSubordinateUnitVisible,
      handleChangeUnitValue: this.handleChangeUnitValue,
    };

    return (
      <Modal
        title="提成比例系数新增"
        style={{ top: 20 }}
        visible={commissionSetAddVisible}
        width="30%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
      >
        <div>
          <Card>
            <Form layout="inline">
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.commissionType}>
                    {getFieldDecorator('commissionType', {
                      rules: [{ required: false, message: '请输入提成比例类别' }],
                    })(
                      <Select
                        onMouseEnter={this.handleCommissionSettingChange}
                        placeholder="请输入提成比例类别"
                      >
                        {commissionSettingOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formhz11} label={fieldLabels.commissionCoefficient}>
                    {getFieldDecorator('commissionCoefficient', {
                      rules: [{ required: false, message: '请输入提成比例系数' }],
                    })(
                      <InputNumber
                        defaultValue={0}
                        min={0}
                        max={100}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formhz11} label="考评比例系数">
                    {getFieldDecorator('commissionCoefficient', {
                      rules: [{ required: false, message: '请输入提成比例系数' }],
                    })(
                      <InputNumber
                        defaultValue={0}
                        min={0}
                        max={100}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.status}>
                    {getFieldDecorator('status', {
                      initialValue: `保存`,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.subordinateUnit}>
                    {getFieldDecorator('subordinateUnit', {
                      rules: [{ required: false, message: '请输入所属单位' }],
                      initialValue: `${getUnitValue}`,
                    })(
                      <Search
                        placeholder="请输入所属单位"
                        onSearch={this.handleSubordinateUnitVisible}
                        style={{ width: 200 }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.remarks}>
                    {getFieldDecorator('remarks', {
                      rules: [{ required: false, message: '请输入备注' }],
                    })(<TextArea placeholder="请输入备注" rows={4} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <SubordinateUnitModal
          {...subordinateUnitMethods}
          subordinateUnitVisible={subordinateUnitVisible}
        />
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(CommissionSettingAddModal));
