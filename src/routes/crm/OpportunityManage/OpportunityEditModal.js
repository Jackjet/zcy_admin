import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  // TimePicker,
  Input,
  Select,
  Popover,
  Modal,
  Transfer,
  Menu,
  Tree,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import {message} from "antd/lib/index";

const { TreeNode } = Tree;
const { SubMenu, MenuItemGroup } = Menu;
const { TextArea } = Input;
const { Option } = Select;

const mockData = [];
for (let i = 0; i < 10; i += 1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
}
const fieldLabels = {
  number: '编码',
  businessName: '商机名称',
  customerName: '客户名称',
  customerContact: '客户联系人',
  mobilePhone: '联系电话',
  businessState: '商机状态',
  customerDemand: '客户需求',
  remarks: '备注',
  platform: '商机平台',
  submissionPerson: '商机提供人',
  executor: '执行人',
  assignor: '分配人',
};
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

const formItemLayoutTextArea = {
  style: {
    paddingRight: 150,
    width: '110%',
  },
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

class BusinessEditModal extends PureComponent {
  state = {
    width: '100%',
    targetKeys: [],
    selectedKeys: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleChange = nextTargetKeys => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
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
      handleBusinessEditVisible,
      businessEditVisible,
      rowInfo,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedKeys } = this.state;
    const okHandle = () => handleBusinessEditVisible();
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        dispatch({
          type: 'opportunity/edit',
          payload: values,
          callback: res => {
            if (res.meta.status === '000000') {
              dispatch({
                type: 'opportunity/fetch',
              });
              handleBusinessEditVisible(false);
            } else {
              message.error(res.meta.errmsg);
            }
          },
        });
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
    return (
      <Modal
        title="商机分配"
        style={{ top: 20 }}
        visible={businessEditVisible}
        width="55%"
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleBusinessEditVisible()}
        okText="分配"
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.number}>
                    {getFieldDecorator('number', {
                      rules: [{ required: true, message: '请输入编码' }],
                      initialValue: `${rowInfo.businessCode}`,
                    })(<Input readOnly placeholder="不重复的数字" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.businessName}>
                    {getFieldDecorator('businessName', {
                      rules: [{ required: true, message: '请输入商机名称' }],
                      initialValue: `${rowInfo.businessName}`,
                    })(<Input readOnly placeholder="商机描述" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.businessState}>
                    {getFieldDecorator('businessState', {
                      rules: [{ required: true, message: '请选择商机状态' }],
                    })(
                      <Select readOnly placeholder="请选择商机状态" style={{ width: 150 }}>
                        <Option value="1">提交审核</Option>
                        <Option value="2">跟进中</Option>
                        <Option value="3">成功</Option>
                        <Option value="4">失败</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.customerName}>
                    {getFieldDecorator('customerName', {
                      rules: [{ required: false, message: '请输入客户名称' }],
                      initialValue: `${rowInfo.customerForBusinessName}`,
                    })(<Input readOnly placeholder="请输入客户名称" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.mobilePhone}>
                    {getFieldDecorator('mobilePhone', {
                      rules: [{ required: false, message: '请输入联系电话' }],
                      initialValue: `${rowInfo.mobilePhone}`,
                    })(<Input readOnly placeholder="请输入联系电话" style={{ width: 150 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.platform}>
                    {getFieldDecorator('platform', {
                      rules: [{ required: false, message: '请选择商机平台' }],
                    })(
                      <Select readOnly placeholder="请选择商机平台" style={{ width: 150 }}>
                        <Option value="0">杭州工程平台</Option>
                        <Option value="1">义务工程平台</Option>
                        <Option value="2">杭州审计平台</Option>
                        <Option value="3">义务审计平台</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.submissionPerson}>
                    {getFieldDecorator('submissionPerson', {})(
                      <Input placeholder="商机提供人" style={{ width: 150 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.assignor}>
                    {getFieldDecorator('assignor', {})(
                      <div className={styles.divBorder}>
                        <Tree>
                          <TreeNode title="杭州至诚" key="0-0">
                            <TreeNode title="管理层1" key="0-0-0">
                              <TreeNode title="员工1" key="0-0-0-0" />
                              <TreeNode title="员工2" key="0-0-0-1" />
                            </TreeNode>
                            <TreeNode title="管理层2" key="0-0-1">
                              <TreeNode title="小卒1" key="0-0-1-0" />
                              <TreeNode title="小卒2" key="0-0-1-1" />
                            </TreeNode>
                          </TreeNode>
                          <TreeNode title="义务至诚" key="0-1">
                            <TreeNode title="董事会" key="0-1-0">
                              <TreeNode title="主管1" key="0-1-0-0" />
                              <TreeNode title="主管2" key="0-1-0-1" />
                            </TreeNode>
                            <TreeNode title="财务部" key="0-1-1">
                              <TreeNode title="会计1" key="0-1-1-0" />
                            </TreeNode>
                          </TreeNode>
                        </Tree>
                      </div>
                    )}
                  </Form.Item>
                </Col>
                <Col span={15} offset={1}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('personal', {})(
                      <div>
                        <Transfer
                          dataSource={mockData}
                          titles={['可选人员', '已选人员']}
                          targetKeys={this.state.targetKeys}
                          selectedKeys={selectedKeys}
                          onChange={this.handleChange}
                          onSelectChange={this.handleSelectChange}
                          render={item => item.title}
                        />
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.remarks}>
                    {getFieldDecorator('remarks', {
                      rules: [{ required: false, message: '请输入备注' }],
                    })(<TextArea placeholder="请输入备注" />)}
                  </Form.Item>
                </Col>
              </Row>
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
}))(Form.create()(BusinessEditModal));
