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
    permItemList: [], // 权限集合
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
    const { dispatch } = this.props;
    dispatch({
      type: 'userPerm/fetch',
      payload: {
        userId: this.props.getFieldValue('account'),
       /* userId: '034',*/
      },
      callback: (res) => {
        if (res.meta.status !== "000000") {
          message.error(res.data.alert_msg);
        } else if(res.data.list) {
          this.setState({
            permItemList: res.data.list,
          })
        }
      },
    });
    this.setState({
      AuthorityViewVisible: !!flag,
    });
  };

  // 穿梭框的查询
  handleSearch = (dir, value) => {
    console.log('search:', dir, value);
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
                initialValue: this.props.rowInfo.id,
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
    const { form, dispatch , DistributionRoleVisible, handleDistributionRoleVisible, rowInfo, roleGroup} = this.props;
    const { targetKeys, selectedKeys, AuthorityViewVisible, roleData, permItemList } = this.state;
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
          for (let i =0; i<values.roleHave.length; i+=1) {
            arrayList.push({
              roleId:values.roleHave[i],
              userId: rowInfo.id,
            });
          }
          const params = {
            roleHave: arrayList,
            account: values.account,
          };
          console.log(params);
          dispatch({
            type: 'userRole/add',
            payload: params,
            callback: res => {
              if (res.meta.status !== '000000') {
                message.error(res.data.alert_msg);
              } else {
                dispatch({
                  type: 'user/fetch',
                  payload: {},
                });
                message.success("角色分配成功");
                this.setState({
                  targetKeys: [],
                });
                handleDistributionRoleVisible(false);
              }
            },
          });
        }
      });
    };
    const onCancel = () => {
      this.setState({
        targetKeys: [],
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
        width="65%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <div style={{marginLeft: 122}}>
                  {this.renderSimpleForm()}
                </div>
              </div>
            </div>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={23} offset={4}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('roleHave', {
                      rules: [{ required: true, message: '数据未改动，请直接关闭' }],
                    })(
                      <Transfer
                        listStyle={{
                          width:  '45%',
                          height: 300,
                        }}
                        dataSource={mockData}
                        titles={['可分配角色', '已分配角色']}
                        targetKeys={targetKeys.length === 0 ?roleGroup:targetKeys}
                        selectedKeys={selectedKeys}
                        showSearch
                        onSearch={this.handleSearch}
                        onChange={this.handleChange}
                        onSelectChange={this.handleSelectChange}
                        render={(item) => (
                          <span style={{textAlign:'left'}}>
                            <span style={{width: '40%'}}>{`${item.name}`}</span>
                          </span>
                        )}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <AuthorityView {...parentMethods} AuthorityViewVisible={AuthorityViewVisible} permItemList={permItemList} />
        </div>
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(DistributionRoleModal));
