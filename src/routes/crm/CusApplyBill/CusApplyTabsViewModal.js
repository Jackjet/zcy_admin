import React, { PureComponent } from 'react';
import {
  Tabs,
  Icon,
  Form,
  Modal,
  message,
  Card,
  Col,
  Row,
  Input,
  Popover,
  Cascader,
  Collapse,
  Badge,
  Button,
} from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable';
import picture from './test.png';
import styles from './style.less';

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
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class CusApplyViewTabs extends PureComponent {
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
    const { TabPane } = Tabs;
    const {
      form,
      dispatch,
      cusApplyTabsViewVisible,
      handleCusApplyTabsViewVisible,
      rowInfo,
      rule: { data },
      loading,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const {
      selectedRows,
    } = this.state;
    const validate = () => {
      handleCusApplyTabsViewVisible(false);
    };
    const cancelDate = () => {
      handleCusApplyTabsViewVisible(false);
    };
    const columnsProcedure = [
      {
        title: '编号',
        dataIndex: 'no',
      },
      {
        title: '环节名称',
        dataIndex: 'name',
      },
      {
        title: '执行人',
        dataIndex: 'linkman',
      },
      {
        title: '审批意见',
        dataIndex: 'status',
      },
      {
        title: '创建时间',
        dataIndex: 'company',
      },
      {
        title: '完成时间',
        dataIndex: 'finishFee',
      },
      {
        title: '消耗时间',
        dataIndex: 'consumeFee',
      },
    ];
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="客户申请单查看"
        style={{ top: 20 }}
        visible={cusApplyTabsViewVisible}
        width="80%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        footer={
          <Button type="primary" onClick={validate}>知道了</Button>
        }  // 在button外面加上数据，会报迭代没有设置key属性值
      >
        <Card style={{ marginBottom: 24 }} >
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <Icon type="team" />客户申请基本信息
                </span>
              }
              key="1"
            >
              <Card style={{ marginBottom: -24 }} >
                <Form layout="horizontal">
                  <Row className={styles['fn-mb-15']}>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="客户编码">
                        {getFieldDecorator('number', {
                          rules: [{ required: false, message: '请输入客户编码' }],
                          initialValue:rowInfo.number,
                        })(
                          <Input readOnly placeholder="新增自动产生" style={{ width: 200 }} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="客户名称">
                        {getFieldDecorator('name', {
                          rules: [{ required: false, message: '请输入客户名称' }],
                          initialValue:rowInfo.name,
                        })(
                          <Input
                            readOnly
                            placeholder="请输入客户名称"
                            style={{ width: 200 }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="联系人业务性质">
                        {getFieldDecorator('linkManTypeId', {
                          rules: [{ required: false, message: '请选择联系人业务性质' }],
                          initialValue:rowInfo.linkManTypeId,
                        })(
                          <Input readOnly placeholder="请选择联系人业务性质" style={{ width: 200 }} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles['fn-mb-15']}>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="状态">
                        {getFieldDecorator('status', {
                          rules: [{ required: false, message: '状态' }],
                          initialValue:rowInfo.status,
                        })(
                          <Input readOnly placeholder="默认待审核" style={{ width: 200 }} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="联系人">
                        {getFieldDecorator('linkMan', {
                          rules: [{ required: false, message: '请输入联系人' }],
                          initialValue:rowInfo.linkMan,
                        })(
                          <Input readOnly placeholder="请输入联系人" style={{ width: 200 }} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label="联系电话">
                        {getFieldDecorator('phone', {
                          rules: [{ required: false, message: '请输入联系电话' }],
                          initialValue:rowInfo.phone,
                        })(
                          <Input readOnly placeholder="请输入联系电话" style={{ width: 200 }} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Icon type="api" />流程图
                </span>
              }
              key="2"
            >
              <div>
                <Card bordered={false}>
                  <div className={styles.tableList}>
                    <StandardTable
                      selectedRows={selectedRows}
                      loading={loading}
                      data={data}
                      columns={columnsProcedure}
                      onSelectRow={this.handleSelectRows}
                      onChange={this.handleStandardTableChange}
                    />
                  </div>
                  <div>
                    <img src={picture} alt="流程图" />
                  </div>
                </Card>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(CusApplyViewTabs));
