import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Select,
  Divider,
} from 'antd';
import StandardTable from '../../../../components/StandardTable';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './style.less';
import OrgRangeAddModal from './OrgRangeAddModal';


const { Option } = Select;
const  { confirm } = Modal;
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
class OrgRangeBill extends PureComponent {
  state = {
    OrgRangeAddVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }
  /**
   * 功能描述: 选中的条数已经选中的价格的和   参数（页码，过滤，数据分拣）
   *
   * @param:
   * @return:
   * @auther: fanghui_yang
   * @date: 2018/10/16 13:17
   */
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
  /**
   * 功能描述: 重置查询功能的Input框，并重置列表数据
   *
   * @param:
   * @return:
   * @auther: fanghui_yang
   * @date: 2018/10/16 13:18
   */
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

   /**
   * 功能描述: 批量处理操作的具体事务
   *
   * @param:
   * @return:
   * @auther: fanghui_yang
   * @date: 2018/10/16 13:19
   */
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

  /**
   * 功能描述: table选中行状态的设置
   *
   * @param:
   * @return:
   * @auther: fanghui_yang
   * @date: 2018/10/16 13:20
   */
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  /**
   * 功能描述:查询功能实现
   *
   * @param:
   * @return:
   * @auther: fanghui_yang
   * @date: 2018/10/16 13:21
   */
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

  /**
   * 功能描述:新增组织Modal的显示隐藏
   *
   * @param:
   * @return:
   * @auther: fanghui_yang
   * @date: 2018/10/16 13:21
   */
  handleOrgRangeAddVisible = flag => {
    this.setState({
      OrgRangeAddVisible: !!flag,
    });
  };
  /**
   * 功能描述:删除功能的友好提示
   *
   * @param:
   * @return:
   * @auther: fanghui_yang
   * @date: 2018/10/16 13:23
   */
  showDeleteConfirm = () => {
    confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };


  /**
   * 功能描述:简单查询功能
   *
   * @param:
   * @return:
   * @auther: fanghui_yang
   * @date: 2018/10/16 13:23
   */
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="拜访对象">
              {getFieldDecorator('visit')(
                <Select placeholder="请选择拜访对象" style={{ width: 200 }}>
                  <Option value="0">请选择</Option>
                  <Option value="1">初期沟通</Option>
                  <Option value="2">立项评估</Option>
                  <Option value="3">需求分析</Option>
                  <Option value="4">方案制定</Option>
                  <Option value="5">招投标/竞争</Option>
                  <Option value="6">商务谈判</Option>
                  <Option value="7">合同签约</Option>
                </Select>
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
    const { selectedRows, OrgRangeAddVisible } = this.state;
    const { form, dispatch, submitting , OrgRangeBillVisible, handleOrgRangeBillVisible, rule: { data }, loading} = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handleOrgRangeBillVisible(false);
          form.resetFields();
          message.success('成功申请用户');
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handleOrgRangeBillVisible(false);
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
        title: '组织编码',
        dataIndex: 'visitCus',
      },
      {
        title: '组织名称',
        dataIndex: 'withBusiness',
      },
    ];
    const parentMethods = {
      handleOrgRangeAddVisible: this.handleOrgRangeAddVisible,
    };
    return (
      <Modal
        title="组织维度"
        style={{ top: 20 }}
        visible={OrgRangeBillVisible}
        width="60%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button style={{ marginLeft: 8 }} type="primary" onClick={()=>this.handleOrgRangeAddVisible(true)}>
                  增加组织
                </Button>
                <Button style={{ marginLeft: 8 }} type="primary" onClick={()=>this.handleOrgRangeAddVisible(true)}>
                  删除组织
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
            </div>
          </Card>
          <OrgRangeAddModal {...parentMethods} OrgRangeAddVisible={OrgRangeAddVisible} />
        </div>
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(OrgRangeBill));

