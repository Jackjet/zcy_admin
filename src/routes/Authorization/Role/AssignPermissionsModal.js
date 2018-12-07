import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Popover,
  Modal,
  Transfer,
  message,
} from 'antd';
import { connect } from 'dva';
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

class AssignPermissionsModal extends PureComponent {
  state = {
    width: '100%',
    targetKeys: [],
    selectedKeys: [],
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
      type: 'rolePerm/fetch',
      payload: {},
      callback: (res) => {
        if (res.meta.status !== "000000") {
          message.error(res.data.alert_msg);
        } else {
          const resVal = res.data.list;
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

  handleChange = (nextTargetKeys, direction, moveKeys) => {
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
    const { permItemData } = this.state;
    const {
      form,
      dispatch,
      AssignPermissionsVisible,
      handleAssignPermissionsVisible,
      rowInfo,
    } = this.props;
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
            type: 'rolePerm/add',
            payload: arrayList,
            callback: res => {
              if (res.meta.status !== '000000') {
                message.error(res.data.alert_msg);
              } else {
                dispatch({
                  type: 'role/fetch',
                  payload: {},
                });
                message.success("权限分配成功");
                handleAssignPermissionsVisible(false);
              }
            },
          });



        }
      });
    };
    const cancelDate = () => {
      this.props.dispatch({
        type: 'rolePerm/fetch',
        payload: {},
        callback: (res) => {
          if (res.meta.status !== "000000") {
            message.error(res.data.alert_msg);
          } else {
            const resVal = res.data.list;
            if (resVal) {
              this.setState({
                targetKeys: resVal.map(item => item.permId ),
              })
            }
          }
        },
      });
      handleAssignPermissionsVisible(false);
    };

    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="分配权限"
        style={{ top: 20 }}
        visible={AssignPermissionsVisible}
        width="60%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText="提交"
      >
        <Card>
          <Form layout="horizontal">
            <Row className={styles['fn-mb-15']}>
              <Col span={23} push={5}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator('permItemHave', {
                    rules: [{ required: true, message: '数据未改动，请直接关闭' }],
                  })(
                    <Transfer
                      dataSource={mockData}
                      titles={['可授权', '已分配']}
                      listStyle={{
                        width: 200,
                        height: 200,
                      }}
                      targetKeys={this.state.targetKeys}
                      selectedKeys={this.state.selectedKeys}
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
      </Modal>
    );
  }
}

export default connect(() => ({
}))(Form.create()(AssignPermissionsModal));
