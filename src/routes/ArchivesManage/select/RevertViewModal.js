import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Transfer,
  Modal,
  Icon,
  message,
  Popover,
  Collapse,
} from 'antd';
import StandardTable from 'components/StandardTable';
import { connect } from 'dva';
import styles from './style.less';


const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  visitors: '拜访对象',
  visitType: '拜访方式',
  connectBusiness: '关联商机',
  visitDate: '拜访日期',
  communication: '交流内容',
  participants: '参与人员',
  remarks: '备注',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};


@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class RevertViewModal extends PureComponent {
  state = {
    width: '90%',
    selectedRows: [],
    mockData: [],
    targetKeys: [],
  };
  componentDidMount() {
    this.getMock();
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }



  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  };
  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  };

  // 选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    // Object.keys()方法会返回一个由一个给定对象的自身可枚举属性组成的数组,
    // reduce方法有两个参数，第一个参数是一个callback，用于针对数组项的操作；
    // 第二个参数则是传入的初始值，这个初始值用于单个数组项的操作。
    // 需要注意的是，reduce方法返回值并不是数组，而是形如初始值的经过叠加处理后的操作。

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

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting, RevertViewVisible, handleRevertViewVisible, rowInfo, rule: { data }, loading } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedRows } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
          handleRevertViewVisible(false);
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
        title: '清单编号',
        dataIndex: 'dictID',
      },
      {
        title: '文档名称',
        dataIndex: 'code',
      },
      {
        title: '页/份数',
        dataIndex: 'dictTypeName',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
    ];
    return (
      <Modal
        title="借阅信息查看"
        style={{ top: 150 }}
        // 对话框是否可见
        visible={RevertViewVisible}
        width="60%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleRevertViewVisible()}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="档案号">
                    {getFieldDecorator('visitors', {
                      rules: [{ required: false, message: '档案号' }],
                      initialValue:`${rowInfo.dictID}`,
                    })(
                      <Input placeholder="档案号" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="归档日期">
                    {getFieldDecorator('visitType', {
                      rules: [{ required: false, message: '归档日期' }],
                    })(
                      <Input placeholder="归档日期" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={24} pull={4}>
                  <Form.Item {...formItemLayout} label="档案名称">
                    {getFieldDecorator('visitType', {
                      rules: [{ required: false, message: '档案名称' }],
                    })(
                      <Input placeholder="档案名称" style={{ width: 650 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={24} pull={4}>
                  <Form.Item {...formItemLayout} label="存放位置">
                    {getFieldDecorator('visitDate', {
                      rules: [{ required: false, message: '存放位置' }],
                    })(
                      <Input placeholder="存放位置" style={{ width: 650 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={24} pull={4}>
                  <Form.Item {...formItemLayout} label="备注">
                    {getFieldDecorator('connectBusiness', {
                      rules: [{ required: false, message: '备注' }],
                    })(
                      <Input placeholder="备注" style={{ width: 650 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Collapse defaultActiveKey={['1']} >
                <Panel header="档案" key="1">
                  <Row className={styles['fn-mb-15']}>
                    <Col span={24}>
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
                    </Col>
                  </Row>
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
}))(Form.create()(RevertViewModal));
