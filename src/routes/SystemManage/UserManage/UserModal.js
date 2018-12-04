import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  message,
  Upload,
  Button,
  Icon,
  Modal,
  Popover,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import moment from "moment/moment";
import styles from './UserListAdd.less';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  userName: '用户账号',
  personId: '用户实名',
  companyId: '所属公司',
  type: '用户类型',
  effectiveDate: '账号生效日期',
  invalidationDate: '账号失效日期',
  password: '用户密码',
  repassword: '确认密码',
  email: '电子邮箱',
  faceId: '用户头像',
  officePhone: '办公电话',
  homePhone: '家庭电话',
  backupEMail: '备用邮箱',
  defaultOrg: '缺省公司',
  groupId: '所属用户组',
  remark: '描述',
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
class UserModal extends PureComponent {
  state = {
    width: '90%',
    previewVisible: false,
    previewImage: '',
    treeData:[{
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [{
        title: 'Child Node1',
        value: '0-0-1',
        key: '0-0-1',
      }, {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
      }],
    }, {
      title: 'Node2',
      value: '0-1',
      key: '0-1',
    }],
    fileList: [
      {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.props.dispatch({
      type: 'user/getLeftTreeMenu',
      callback: (res) => {
        if(res.meta.status === '000000' ) {
          this.setState({treeData : res.data.list});
        } else {
          message.error(res.meta.errmsg);
        }
      },
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleCancel = () => this.setState({ previewVisible: false });

  onOrgTreeSelectChange = (value) => {
    console.log(value);

  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { form, dispatch, PersonAddVisible, handlePersonAddVisible, choiceTypeKey, choiceTypeValue } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'user/add',
            payload: {
              ...values,
              group: choiceTypeKey,
            },
            callback: res => {
              if (res.meta.status === '000000') {
                this.props.dispatch({
                  type: 'user/fetch',
                  payload: {
                    page: 1,
                    pageSize: 10,
                  },
                });
                handlePersonAddVisible(false);
              } else {
                message.error(res.meta.errmsg);
              }
            },
          });
        }
      });
    };
    const onCancel = () => {
      handlePersonAddVisible(false);
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="用户新增"
        style={{ top: 20 }}
        visible={PersonAddVisible}
        width="60%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText="提交"
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <div>
                <div>
                  <Row>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.userName}>
                        {getFieldDecorator('userName', {
                          rules: [{ required: true, message: '请输入用户账号' }],
                        })(
                          <Input placeholder="请输入用户账号" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.groupId}>
                        {getFieldDecorator('groupId', {
                          rules: [{ required: false, message: '请输入所属用户组' }],
                          initialValue: choiceTypeValue,
                        })(
                          <Input readOnly placeholder="请输入所属用户组" />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row>
                   {/* <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.type}>
                        {getFieldDecorator('type', {
                          rules: [{ required: true, message: '请输入用户类型' }],
                        })(<Input placeholder="请输入用户类型" />)}
                      </Form.Item>
                    </Col>*/}
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.companyId}>
                        {getFieldDecorator('companyId', {
                          rules: [{ required: false, message: '请选择所属公司' }],
                        })(
                          <TreeSelect
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.state.treeData}
                            placeholder="请选择所属公司"
                            treeDefaultExpandAll
                            onChange={this.onOrgTreeSelectChange}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.personId}>
                        {getFieldDecorator('personId', {
                          rules: [{ required: true, message: '请选择用户实名' }],
                        })(
                          <Search
                            placeholder="请选择用户实名"
                          />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                </div>
                <div className={styles.pictureRight}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('faceId', {
                      rules: [{ required: false, message: '上传头像' }],
                    })(
                      <div className="clearfix">
                        <Upload
                          action="//jsonplaceholder.typicode.com/posts/"
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={this.handlePreview}
                          onChange={this.handleChange}
                        >
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      </div>
                    )}
                  </Form.Item>
                </div>
              </div>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.effectiveDate}>
                    {getFieldDecorator('effectiveDate', {
                      rules: [{ required: false, message: '请输入账号生效日期' }],
                      initialValue: moment().format('YYYY-MM-DD'),
                    })(
                      <Input readOnly placeholder="请输入账号生效日期" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.invalidationDate}>
                    {getFieldDecorator('invalidationDate', {
                      rules: [{ required: false, message: '请输入账号失效日期' }],
                      initialValue: '2099-12-31',
                    })(
                      <Input readOnly placeholder="请输入账号失效日期" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.password}>
                    {getFieldDecorator('password', {
                      rules: [{ required: false, message: '请输入用户密码' }],
                    })(
                      <Input type='password' placeholder="请输入用户密码" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.repassword}>
                    {getFieldDecorator('repassword', {
                      rules: [
                        { required: false, message: '请输入确认密码' },
                        {validator: this.checkConfirm},
                        ],
                    })(
                      <Input type='password' placeholder="请输入确认密码" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.email}>
                    {getFieldDecorator('email', {
                      rules: [{ required: false, message: '请输入电子邮箱' }],
                    })(
                      <Input placeholder="请输入电子邮箱" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.officePhone}>
                    {getFieldDecorator('officePhone', {
                      rules: [{ required: false, message: '请输入办公电话' }],
                    })(
                      <Input placeholder="请输入办公电话" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.homePhone}>
                    {getFieldDecorator('homePhone', {
                      rules: [{ required: false, message: '请输入家庭电话' }],
                    })(
                      <Input placeholder="请输入家庭电话" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.backupEMail}>
                    {getFieldDecorator('backupEMail', {
                      rules: [{ required: false, message: '请输入备用邮箱' }],
                    })(
                      <Input placeholder="请输入备用邮箱" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.defaultOrg}>
                    {getFieldDecorator('defaultOrg', {
                      rules: [{ required: false, message: '请选择缺省公司' }],
                    })(
                      <TreeSelect
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.treeData}
                        placeholder="请选择缺省公司"
                        treeDefaultExpandAll
                        onChange={this.onOrgTreeSelectChange}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.remark}>
                    {getFieldDecorator('remark')(
                      <TextArea placeholder="请输入描述" style={{ width: 1000 }} />
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
  submitting: loading.effects['person/saveUser'],
}))(Form.create()(UserModal));
