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
  Collapse,
} from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable/index';
import styles from '../add/style.less';

const { Panel } = Collapse;
const fieldLabels = {
  projectName: '项目名称',
  projectCode: '项目编号',
  operationType: '业务类型',
  branchCompanyA: '分公司',
  invoiceNumber: '发票号码',
  invoicePerson: '开票人员',
  branchCompanyB: '分公司',
  commissionExplain: '提成说明',
  invoiceMoney: '发票金额',
  projectMoney: '本项目金额',
  distributable: '实际可分配',
  commissionSum: '实际可提成总额',
  expenditure: '支出费用',
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
class CommissionQueryModal extends PureComponent {
  state = {
    width: '100%',
    selectedRows: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

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

  // 获取选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
    const { form, dispatch, submitting , commissionViewVisible, handleCommissionViewVisible, rule: { data }, loading, rowInfo } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedRows } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          form.resetFields();
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handleCommissionViewVisible(false);
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handleCommissionViewVisible(false);
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

    const columns = [
      {
        title: '项目成员',
        dataIndex: 'customerCode',
      },
      {
        title: '分配角色',
        dataIndex: 'customerName',
      },
      {
        title: '分配比例',
        dataIndex: 'linkman',
      },
      {
        title: '项目奖惩比例',
        dataIndex: 'linkman',
      },
      {
        title: '分配金额',
        dataIndex: 'address',
      },
      {
        title: '发票号码',
        dataIndex: 'company',
      },
      {
        title: '状态',
        dataIndex: 'mobilePhone',
      },
      {
        title: '分配人',
        dataIndex: 'industry',
      },
      {
        title: '备注',
        dataIndex: 'status',
      },
    ];

    return (

      <Modal
        title="提成比例设置"
        style={{ top: 20 }}
        visible={commissionViewVisible}
        width="90%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
      >
        <div>
          <Card>
            <Form layout="inline">
              <Collapse defaultActiveKey={['1','2','3']} >
                <Panel header="项目提成分配" key="1">
                  <Row className={styles['fn-mb-15']}>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.projectName}>
                        {getFieldDecorator('projectName', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="项目名称" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.projectCode}>
                        {getFieldDecorator('projectCode', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="项目编号" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.operationType}>
                        {getFieldDecorator('operationType', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="业务类型" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formhz11} label={fieldLabels.branchCompanyA}>
                        {getFieldDecorator('branchCompanyA', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder=" 分公司" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
                <Panel header="发票" key="2">
                  <Row className={styles['fn-mb-15']}>
                    <Col span={6}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceNumber}>
                        {getFieldDecorator('invoiceNumber', {
                          initialValue:`${rowInfo.invoiceNumber}`,
                        })(
                          <Input disabled placeholder="发票号码" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...formhz11} label={fieldLabels.invoicePerson}>
                        {getFieldDecorator('invoicePerson', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="开票人员" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...formhz11} label={fieldLabels.branchCompanyB}>
                        {getFieldDecorator('branchCompanyB', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="分公司" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...formhz11} label={fieldLabels.commissionExplain}>
                        {getFieldDecorator('commissionExplain', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="提成说明" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={6}>
                      <Form.Item {...formhz11} label={fieldLabels.invoiceMoney}>
                        {getFieldDecorator('invoiceMoney', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="发票金额" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...formhz11} label={fieldLabels.projectMoney}>
                        {getFieldDecorator('projectMoney', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="本项目金额" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...formhz11} label={fieldLabels.distributable}>
                        {getFieldDecorator('distributable', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="实际可分配" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...formhz11} label={fieldLabels.commissionSum}>
                        {getFieldDecorator('commissionSum', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="实际可提成总额" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={6}>
                      <Form.Item {...formhz11} label={fieldLabels.expenditure}>
                        {getFieldDecorator('expenditure', {
                          initialValue:`${rowInfo.projectName}`,
                        })(
                          <Input disabled placeholder="支出费用" className={styles['ant-input-lg']} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
                <Panel header="提成分配明细" key="3">
                  <div>
                    <Card>
                      <StandardTable
                        selectedRows={selectedRows}
                        loading={loading}
                        data={data}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange}
                      />
                    </Card>
                  </div>
                </Panel>
              </Collapse>
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
}))(Form.create()(CommissionQueryModal));
