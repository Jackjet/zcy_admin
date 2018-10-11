import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Select,
  Divider,
  Layout,
  Input,
} from 'antd';
import StandardTable from '../../../../components/StandardTable';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import EditableCell from '../../../EditableTable/EditableCell';
import styles from './Style.less';


const {Content, Sider} = Layout;
const { Option } = Select;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
// PureComponent优化Component的性能
export default class EvaluationViewModal extends PureComponent {
  state = {
    workDiaryVisible: false,
    selectedRows: [],
    formValues: {},
    dataSource:[],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }
  // 选中的条数已经选中的价格的和   参数（页码，过滤，把东西分类检出）
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
  // 重置查询的值
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  // 批量处理的操作选择
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    switch (e.key) {
      case 'remove':
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
        break;
      default:
        break;
    }
  };

  // 选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 查询功能
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  // 点击新增显示弹窗
  handleWorkDiaryVisible = flag => {
    this.setState({
      workDiaryVisible: !!flag,
    });
  };

  // 新增功能实现
  handleAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      workDiaryVisible: false,
    });
  };

  onCellChange = (key, dataIndex) => {
    return value => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({
          dataSource,
        })
        ;
      }
    };
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="指标总平均分">
              {getFieldDecorator('aveScore')(
                <Input readOnly placeholder="指标总平局分" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="指标数">
              {getFieldDecorator('years', {
                rules: [{ required: true, message: '指标数' }],
              })(
                <Input readOnly placeholder="指标数" style={{ width: 200 }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="指标总分">
              {getFieldDecorator('sumScore', {
                rules: [{ required: true, message: '指标总分' }],
              })(
                <Input readOnly placeholder="指标总分" style={{ width: 200 }} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { form, dispatch, rule: { data }, loading, EvaluationViewVisible, handleEvaluationViewVisible } = this.props;
    const { selectedRows } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功');
          handleEvaluationViewVisible(false);
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
        title: '考评指标',
        dataIndex: 'appraisalProject',
      },
      {
        title: '指标说明',
        dataIndex: 'appraisalExplain',
      },
      {
        title: '指标考评分',
        dataIndex: 'appraisalScore',
      },
      {
        title: '实际考评的分',
        dataIndex: 'appraisalGetScore',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'appraisalGetScore')} />
        ),
      },
    ];
    return (
      <Modal
          title="考评查看"
          style={{ top: 20 }}
          visible={EvaluationViewVisible}
          width="80%"
          maskClosable={false}
          onOk={validate}
          onCancel={() => handleEvaluationViewVisible(false)}
        >
          <Card bordered={false}>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <Content style={{ padding: '0 24px', minHeight: 280}}>
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={columns}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </Content>
            </Layout>
          </Card>
        </Modal>
    );
  }
}
