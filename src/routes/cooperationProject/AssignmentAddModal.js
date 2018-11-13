import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Popover,
  Modal,
  Radio,
  Upload,
  message,
  Button,
  Tooltip,
  Select,
  InputNumber,
  Popconfirm,
  Table,
  Divider,
} from 'antd';
import { connect } from 'dva';
import SeniorModal from '../../components/MoveModal';
import EditableCell from '../../components/EditableItem';
import styles from './Style.less';
import moment from "moment/moment";
import ModalWin from "../../components/ModalWin";


const { Search } = Input;

const fieldLabels = {
  projectCode:'编码',
  projectType:'项目类别',
  projectName:'项目名称',
  year:'年度',
  explain:'说明',
};

const RadioGroup = Radio.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
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



class AssignmentAddModal extends PureComponent {
  state = {
    width: '100%',
    dataSource: [
      {
        key: '0',
        company: '杭州至诚',
        partner: '杨',
        remarks: 'aaa',
      },
      {
        key: '1',
        company: '义务至诚',
        partner: '赵',
        remarks: 'bbb',
      },
    ],
    count: 2,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  onCellChange = (key, dataIndex) => {
    return value => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  };
  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      company: `小杨 ${count}`,
      partner: 18,
      remarks: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
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
    const { form, dispatch, submitting, projectAssigVisible, handleProjectAssignmentAddVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError, getFieldValue } = form;
    const { dataSource } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          form.resetFields();
          handleProjectAssignmentAddVisible(false);
        }
      });
    };
    const cancelDate = () => {
      form.resetFields();
      handleProjectAssignmentAddVisible(false);
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
        title: '公司',
        dataIndex: 'company',
        width:150,
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'name')} />
        ),
      },
      {
        title: '合伙人',
        dataIndex: 'partner',
        width:100,
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'phone')} />
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:100,
        render: (text, record) => {
          return this.state.dataSource.length > 1 ? (
            <span>
              <a onClick={() => this.handleAdd()}>+</a>
              <Divider type="vertical" />
              <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                <a>-</a>
              </Popconfirm>
            </span>
          ) : (
            <a onClick={() => this.handleAdd()}>+</a>
          );
        },
      },
    ];
    return (
      <ModalWin
        title="新增项目指派"
        style={{ top: 20 }}
        visible={projectAssigVisible}
        width="50%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={2}>
                  <Form.Item {...formItemLayout} label="指派编号">
                    {getFieldDecorator('authorizedAgent', {
                      rules: [{ required: true, message: '指派编号' }],
                    })(
                      <Input placeholder="默认带出" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={2}>
                  <Form.Item {...formItemLayout} label="平台">
                    {getFieldDecorator('where', {
                      rules: [{ required: true, message: '平台' }],
                    })(
                      <Input placeholder="平台" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={2}>
                  <Form.Item {...formItemLayout} label="部门">
                    {getFieldDecorator('authorizedAgent', {
                      rules: [{ required: true, message: '部门' }],
                    })(
                      <Input placeholder="当前登录人所在部门" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} push={2}>
                  <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                  />
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={2}>
                  <Form.Item {...formItemLayout} label={fieldLabels.explain}>
                    {getFieldDecorator('explain', {
                      rules: [{ required: false, message: '说明' }],
                    })(
                      <TextArea placeholder="请输入说明" rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </ModalWin>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(AssignmentAddModal));
