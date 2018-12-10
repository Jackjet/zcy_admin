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
    targetKeys: [], // 穿梭框右边的数据
    selectedKeys: [], // 穿梭框左边的数据
    AuthorityViewVisible: false, // 查看权限modal的显隐状态
    permItemData: [], // 穿梭框左侧的权限对象数据集合
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

  // 查看 <权限> modal框的显隐
  handleAuthorityViewVisible = flag => {
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
  render() {
    const { form, dispatch , DistributionAuthorityVisible, handleDistributionAuthorityVisible, rowInfo, permItemGroup} = this.props;
    const { targetKeys, selectedKeys, AuthorityViewVisible, permItemData } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const mockData = [];
   /* for (let i = 0; i < 2; i += 1) {
      mockData.push({
        key: i.toString(),
        name: "权限对象名称",
        number: "权限对象编码",
        disabled: 1,
      });
    }*/
    for (let i = 0; i < permItemData.length; i += 1) {
      mockData.push({
        key: permItemData[i].id,
        name: permItemData[i].name,
        number: permItemData[i].number,
      });
    }
    const validate = () => {
      validateFieldsAndScroll((error, values) => {

        if (!error) {
          const arrayList = [];
          for (let i =0; i<values.permItemHave.length; i+=1) {
            arrayList.push({
              permId: values.permItemHave[i],
              userId: rowInfo.id,
            })
          }
          const params = {
            permItemHave: arrayList,
            account: values.account,
            companyId: values.companyId,
          };
          console.log(params);
          dispatch({
            type: 'userPerm/add',
            payload: params,
            callback: res => {
              if (res.meta.status !== '000000') {
                message.error(res.data.alert_msg);
              } else {
                dispatch({
                  type: 'user/fetch',
                  payload: {},
                });
                message.success("权限分配成功");
                this.setState({
                  targetKeys: [],
                });
                DistributionAuthorityVisible(false);
              }
            },
          });
        }
      });
    };
    const onCancel = () => {
     /* console.log(rowInfo);
      console.log(rowInfo[0]);*/
     this.setState({
       targetKeys: [],
     });
      handleDistributionAuthorityVisible(false);
    };
    const parentMethods = {
      handleAuthorityViewVisible: this.handleAuthorityViewVisible,
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="分配权限"
        style={{ top: 20 }}
        visible={DistributionAuthorityVisible}
        width="65%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="用户">
                    {getFieldDecorator('account', {
                      rules: [{ required: false, message: '请输入用户' }],
                      initialValue: rowInfo.id,
                    })(
                      <Input readOnly placeholder="默认当前" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="组织">
                    {getFieldDecorator('companyId', {
                      rules: [{ required: false, message: '组织' }],
                    })(
                      <Search readOnly placeholder="组织" style={{ width: 200 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={23} offset={4}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('permItemHave', {
                      rules: [{ required: true, message: '数据未改动，请直接关闭' }],
                    })(
                      <Transfer
                        listStyle={{
                          width:  '45%',
                          height: 300,
                        }}
                        dataSource={mockData}
                        titles={['可分配权限', '已分配权限']}
                        targetKeys={targetKeys.length === 0? permItemGroup: targetKeys}
                        selectedKeys={selectedKeys}
                        showSearch
                        onSearch={this.handleSearch}
                        onChange={this.handleChange}
                        onSelectChange={this.handleSelectChange}
                        render={(item) => (
                          <span style={{textAlign:'left'}}>
                            <span style={{width: '40%'}}>{`${item.name}`}</span>
                            <span style={{width: '25%',float:'right'}}>{`${item.number}`}</span>
                          </span>
                        )}
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
