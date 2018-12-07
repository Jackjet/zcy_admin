import React, { PureComponent } from 'react';
import {
  Form,
  Col,
  Row,
  Input,
  Select,
  Modal,
  Card,
  message,
  Transfer,
  Button,
} from 'antd';
import { connect } from 'dva';
import AuthorityView from './AuthorityView';
import styles from '../style.less';

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

class DistributionRoleModal extends PureComponent {
  state = {
    width: '100%',
    targetKeys: [],
    selectedKeys: [],
    AuthorityViewVisible: false,
    roleData: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
      payload: {},
      callback: (res) => {
        if (res.meta.status !== "000000") {
          message.error(res.data.alert_msg);
        } else {
          this.setState({
            roleData: res.data.list,
          });
        }
      },
    });
    dispatch({
      type: 'userRole/fetch',
      payload: {},
      callback: (res) => {
        if (res.meta.status !== "000000") {
          message.error(res.data.alert_msg);
        } else {
          const resVal = res.data.list;
          if (resVal) {
            this.setState({
              targetKeys: resVal.map(item => item.roleId ),
            })
          }
        }
      },
    });

  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  handleChange = (nextTargetKeys, direction) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleAuthorityViewVisible = flag => {
    this.setState({
      AuthorityViewVisible: !!flag,
    });
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item {...formItemLayout} label="用户">
              {getFieldDecorator('account', {
                rules: [{ required: false, message: '请输入用户' }],
              })(
                <Input readOnly placeholder="默认当前" style={{ width: 200 }} />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button
              type="primary"
              onClick={() => this.handleAuthorityViewVisible(true)}
            >
              查看权限
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { form, dispatch , DistributionRoleVisible, handleDistributionRoleVisible, rowInfo} = this.props;
    const { targetKeys, selectedKeys, AuthorityViewVisible, roleData } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const mockData = [];
    for (let i = 0; i < roleData.length; i += 1) {
      mockData.push({
        key: roleData[i].id,
        name: roleData[i].name,
      });
    }
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        console.log(values);
        if (!error) {
          const arrayList = [];
          for (let i =0; i<Object.values(values)[0].length; i+=1) {
            arrayList.push({
              roleId: Object.values(values)[0][i],
              userId: rowInfo.id,
            })
            console.log(arrayList);
          }

          dispatch({
            type: 'userRole/add',
            payload: arrayList,
            callback: res => {
              if (res.meta.status !== '000000') {
                message.error(res.data.alert_msg);
              } else {
                dispatch({
                  type: 'user/fetch',
                  payload: {},
                });
                message.success("角色分配成功");
                handleDistributionRoleVisible(false);
              }
            },
          });
        }
      });
    };
    const onCancel = () => {
      this.props.dispatch({
        type: 'userRole/fetch',
        payload: {},
        callback: (res) => {
          if (res.meta.status !== "000000") {
            message.error(res.data.alert_msg);
          } else {
            console.log(res.data);
            const resVal = res.data.list;
            if (resVal) {
              this.setState({
                targetKeys: resVal.map(item => item.roleId ),
              })
            }
          }
        },
      });
      handleDistributionRoleVisible(false);
    };
    const parentMethods = {
      handleAuthorityViewVisible: this.handleAuthorityViewVisible,
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="分配角色"
        style={{ top: 20 }}
        visible={DistributionRoleVisible}
        width="60%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            {/*<div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <div style={{marginLeft: 122}}>
                  {this.renderSimpleForm()}
                </div>
              </div>
            </div>*/}
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={23} offset={4}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('roleHave', {
                      rules: [{ required: true, message: '数据未改动，请直接关闭' }],
                    })(
                      <Transfer
                        listStyle={{
                          width: 200,
                          height: 200,
                        }}
                        dataSource={mockData}
                        titles={['可分配角色', '已分配角色']}
                        targetKeys={targetKeys}
                        selectedKeys={selectedKeys}
                        onChange={this.handleChange}
                        onSelectChange={this.handleSelectChange}
                        render={item => item.name}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <AuthorityView {...parentMethods} AuthorityViewVisible={AuthorityViewVisible} />
        </div>
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(DistributionRoleModal));
