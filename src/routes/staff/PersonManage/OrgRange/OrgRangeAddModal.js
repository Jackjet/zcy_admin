import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Select, DatePicker, Transfer, Modal, Icon, message, Popover, Tree } from 'antd';
import { connect } from 'dva';
import styles from '../style.less';

const mockData = [];
for (let i = 0; i < 10; i+=1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
};
const { TreeNode } = Tree;
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

class OrgRangeAddModal extends PureComponent {
  state = {
    width: '90%',
    selectedKeys: [],
    targetKeys: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  /**
   * 功能描述:穿梭框数据穿梭状态设置
   *
   * @param:
   * @return:
   * @auther: fanghui_yang
   * @date: 2018/10/16 13:26
   */
  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting, OrgRangeAddVisible, handleOrgRangeAddVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedKeys } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功bbb');
          handleOrgRangeAddVisible(false);
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
    return (
      <Modal
        title="组织新增"
        style={{ top: 20 }}
        // 对话框是否可见
        visible={OrgRangeAddVisible}
        width="50%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleOrgRangeAddVisible()}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col lg={12} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.visitors}>
                    {getFieldDecorator('visitors', {
                      rules: [{ required: false, message: '请选择拜访对象' }],
                    })(
                      <Select placeholder="请选择拜访对象" >
                        <Option value="0">电话来访</Option>
                        <Option value="1">客户介绍</Option>
                        <Option value="2">老客户</Option>
                        <Option value="3">代理商</Option>
                        <Option value="4">合作伙伴</Option>
                        <Option value="5">公开招聘</Option>
                        <Option value="6">互联网</Option>
                        <Option value="7">自主开发</Option>
                        <Option value="8">其他</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.visitType}>
                    {getFieldDecorator('visitType', {
                      rules: [{ required: false, message: '请选择拜访方式' }],
                    })(
                      <Select placeholder="请选择拜访方式" >
                        <Option value="0">电话来访</Option>
                        <Option value="1">现场拜访</Option>
                        <Option value="8">其他</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.visitDate}>
                    {getFieldDecorator('visitDate', {
                      rules: [{ required: false, message: '请选择拜访日期' }],
                    })(<DatePicker placeholder="请选择拜访日期" />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.connectBusiness}>
                    {getFieldDecorator('connectBusiness', {
                      rules: [{ required: false, message: '请选择关联商机' }],
                    })(
                      <Select placeholder="请选择关联商机">
                        <Option value="0">电话来访</Option>
                        <Option value="1">现场拜访</Option>
                        <Option value="8">其他</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={21} pull={3} >
                  <Form.Item {...formItemLayout} label={fieldLabels.communication}>
                    {getFieldDecorator('communication')(
                      <TextArea placeholder="请输入交流内容" style={{ minHeight: '200%' }} rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={10} push={1}>
                  <Form.Item {...formItemLayout} label='参与人员'>
                    {getFieldDecorator('assignor', {
                    })(
                      <div className={styles.divBorder}>
                        <Tree>
                          <TreeNode title="杭州至诚" key="0-0">
                            <TreeNode title="管理层1" key="0-0-0" >
                              <TreeNode title="员工1" key="0-0-0-0"  />
                              <TreeNode title="员工2" key="0-0-0-1" />
                            </TreeNode>
                            <TreeNode title="管理层2" key="0-0-1">
                              <TreeNode title="小卒1" key="0-0-1-0" />
                              <TreeNode title="小卒2" key="0-0-1-1" />
                            </TreeNode>
                          </TreeNode>
                          <TreeNode title="义务至诚" key="0-1">
                            <TreeNode title="董事会" key="0-1-0" >
                              <TreeNode title="主管1" key="0-1-0-0"  />
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
                <Col span={11} push={1}>
                  <Form.Item >
                    {getFieldDecorator('personal', {
                    })(
                      <div>
                        <Transfer
                          listStyle={{
                            width: 130,
                            height: 150,
                          }}
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
              <Row>
                <Col span={21} pull={3} >
                  <Form.Item {...formItemLayout} label={fieldLabels.remarks}>
                    {getFieldDecorator('remarks')(
                      <TextArea placeholder="请输入备注" rows={4} />
                    )}
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
}))(Form.create()(OrgRangeAddModal));
