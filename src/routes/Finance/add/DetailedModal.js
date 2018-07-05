import React, { PureComponent, Fragment } from 'react';
import {
  Select,
  Card,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Divider,
  Checkbox,
  Button,
  Icon,
  Modal,
  message,
} from 'antd';
import { connect } from 'dva';
import StandardTable from 'components/StandardTable';
import ReceivablesAddModal from './ReceivablesAddModal';
import ReceivablesEditModal from '../edit/ReceivablesEditModal';
import ReceivablesViewModal from '../select/ReceivablesViewModal';
import styles from './style.less';


const { Option } = Select;
const FormItem = Form.Item;
const formhz11 = {
  wrapperCol: {
    style: {
      width: '50%',
    },
  },
  style: {
    width: '80%',
  },
};

const fieldLabels = {
  clientName: '委托方名称',
  projectUnitName: '项目单位名称',
  businessType: '业务类型',
  specificBusinessType: '具体业务类型',
  standardCharge: '标准收费',
  realCharge: '实际收费',
  discountRate: '折扣率',
  entrustType: '委托类型',
  acceptancePerson: '承接人',
  acceptanceDate: '承接日期',
  acceptanceDepartment: '承接部门',
  businessSource: '业务来源',
  planedProjectImplementationDate: '计划项目实施时间',
  planedIssueReportingDate: '计划出具报告时间',
  competentPartnerApproval: '主管合伙人审批',
  ImplementSignature: '项目实施部门负责人签名',
  pursuitSignature: '落实项目负责人签名',
  projectMembers: '计划项目组成员',
  technicalSupervisionSignature: '负责项目技术督导人签名',
  projectPersonChange: '项目组人员调整',
  planedDateChange: '计划时间调整',
  planChangeReason: '计划调整理由',
  ImplementOpinion: '项目实施部门负责人意见',
  technicalSupervisionOpinion: '负责项目技术督导人意见',
  projectResponsiblePerson: '项目负责人',
  actualSubmissionDate: '实际提交报告日期',
  comprehensiveUnitSignature: '综合部签名',
  signDate: '签收日期',
  auditOpinion: '审计意见',
  CPA_Signature: '签名注册会计师',
};

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class DetailedModal extends PureComponent {
  state = {
    selectedRows:[],
    receivablesAddVisible: false,
    receivablesEditVisible: false,
    receivablesViewVisible: false,
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

  handleReceivablesAddVisible = flag => {
    this.setState({
      receivablesAddVisible: !!flag,
    });
  };
  handleReceivablesEditVisible = flag => {
    this.setState({
      receivablesEditVisible: !!flag,
    });
  };
  handleReceivablesViewVisible = flag => {
    this.setState({
      receivablesViewVisible: !!flag,
    });
  };

  handleDelClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'rule/remove',
      payload: {
        no: selectedRows.map(row => row.no).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="合同标题">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" style={{ width: 200 }} />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }



  render() {
    const { form, dispatch, submitting, detailedVisible, handleDetailedVisible,  rule: { data }, loading } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedRows, receivablesAddVisible, receivablesEditVisible, receivablesViewVisible } =this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
          handleDetailedVisible(false);
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
    const columns = [
      {
        title: '合同标题',
        dataIndex: 'contractTitle',
      },
      {
        title: '开票金额（元）',
        dataIndex: 'invoiceMoney',
      },
      {
        title: '收入金额（元）',
        dataIndex: 'incomeMoney',
      },
      {
        title: '承办人',
        dataIndex: 'contractor',
      },
      {
        title: '收款时间',
        dataIndex: 'receivablesDate',
      },
      {
        title: '收款类型',
        dataIndex: 'receivablesType',
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a type="primary" onClick={() => this.handleReceivablesViewVisible(true)}>
              查看
            </a>
            <Divider type="vertical" />
            <a type="primary" onClick={() => this.handleReceivablesEditVisible(true)}>
              编辑
            </a>
            <Divider type="vertical" />
            <a type="primary" onClick={() => this.handleDelClick(true)}>
              删除
            </a>
          </Fragment>
        ),
      },
    ];
    const ReceivablesAddMethods ={
      handleReceivablesAddVisible:this.handleReceivablesAddVisible,
    };
    const ReceivablesEditMethods ={
      handleReceivablesEditVisible:this.handleReceivablesEditVisible,
    };
    const ReceivablesViewMethods ={
      handleReceivablesViewVisible:this.handleReceivablesViewVisible,
    };
    return (

      <Modal
        title="收款管理"
        style={{ top: 150 }}
        // 对话框是否可见
        visible={detailedVisible}
        width="60%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleDetailedVisible()}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleReceivablesAddVisible(true)}>
                新增
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
            <ReceivablesAddModal {...ReceivablesAddMethods} receivablesAddVisible={receivablesAddVisible} />
            <ReceivablesEditModal {...ReceivablesEditMethods} receivablesEditVisible={receivablesEditVisible} />
            <ReceivablesViewModal {...ReceivablesViewMethods} receivablesViewVisible={receivablesViewVisible} />
          </div>
        </Card>
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(DetailedModal));
