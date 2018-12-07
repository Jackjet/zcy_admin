import React, { PureComponent } from 'react';
import {
  Form,
  Icon,
  Col,
  Row,
  Input,
  Select,
  Popover,
  Modal,
  Card,
  message,
  Transfer,
  Button,
} from 'antd';
import { connect } from 'dva';
import AuthorityView from '../Role/AuthorityView';
import styles from '../style.less';

const { Search } = Input;
const fieldLabels = {
  cusApplyCode: '客户编号',
  cusApplyName: '客户名称',
  cusApplyNature: '联系人业务性质',
  cusApplyStatus: '状态',
  cusApplyMobilePhone: '移动电话',
  cusApplyContacts: '联系人',
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

class DistributionAuthorityModal extends PureComponent {
  state = {
    width: '100%',
    targetKeys: [],
    selectedKeys: [],
    AuthorityViewVisible: false,
    permItemData: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    const { dispatch } = this.props;
    dispatch({
      type: 'permItem/fetch',
      payload: {},
      callback: (res) => {
        if (res.meta.status !== "000000") {
          message.error(res.data.alert_msg);
        } else {
          this.setState({
            permItemData: res.data.list,
          });
        }
      },
    });
    this.props.dispatch({
      type: 'userPerm/fetch',
      payload: {},
      callback: (res) => {
        if (res.meta.status !== "000000") {
          message.error(res.data.alert_msg);
        } else {
          const resVal = res.data.list;
          console.log(resVal);
          if (resVal) {
            this.setState({
              targetKeys: resVal.map(item => item.permId ),
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
  render() {
    const { form, dispatch , DistributionAuthorityVisible, handleDistributionAuthorityVisible, rowInfo} = this.props;
    const { targetKeys, selectedKeys, AuthorityViewVisible,permItemData } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const mockData = [];
    for (let i = 0; i < permItemData.length; i += 1) {
      mockData.push({
        key: permItemData[i].id,
        name: permItemData[i].name,
      });
    }
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          const arrayList = [];
          for (let i =0; i<Object.values(values)[0].length; i+=1) {
            arrayList.push({
              permId: Object.values(values)[0][i],
              roleId: rowInfo.id,
            })
          }
          dispatch({
            type: 'userPerm/add',
            payload: arrayList,
            callback: res => {
              if (res.meta.status !== '000000') {
                message.error(res.data.alert_msg);
              } else {
                dispatch({
                  type: 'user/fetch',
                  payload: {},
                });
                message.success("权限分配成功");
                DistributionAuthorityVisible(false);
              }
            },
          });
        }
      });
    };
    const onCancel = () => {
      this.props.dispatch({
        type: 'userPerm/fetch',
        payload: {},
        callback: (res) => {
          if (res.meta.status !== "000000") {
            message.error(res.data.alert_msg);
          } else {

            const resVal = res.data.list;
            console.log(resVal);
            if (resVal) {
              this.setState({
                targetKeys: resVal.map(item => item.permId ),
              })
            }
          }
        },
      });
      handleDistributionAuthorityVisible(false);
    };
    const parentMethods = {
      handleAuthorityViewVisible: this.handleAuthorityViewVisible,
    };
    return (
      <Modal
        title="分配权限"
        style={{ top: 20 }}
        visible={DistributionAuthorityVisible}
        width="60%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              {/*<Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="用户">
                    {getFieldDecorator('cusApplyCode', {
                      rules: [{ required: false, message: '请输入用户' }],
                    })(
                      <Input readOnly placeholder="默认当前" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="组织">
                    {getFieldDecorator('cusApplyCode', {
                      rules: [{ required: false, message: '组织' }],
                    })(
                      <Search readOnly placeholder="组织" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>*/}
              <Row className={styles['fn-mb-15']}>
                <Col span={23} offset={4}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('permItemHave', {
                      rules: [{ required: true, message: '数据未改动，请直接关闭' }],
                    })(
                      <Transfer
                        listStyle={{
                          width: 250,
                          height: 250,
                        }}
                        dataSource={mockData}
                        titles={['可分配权限', '已分配权限']}
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
}))(Form.create()(DistributionAuthorityModal));
