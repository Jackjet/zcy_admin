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
import styles from './UserListAdd.less';
import moment from "moment/moment";

const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  userName: '用户账号',
  person: '用户实名',
  company: '所属公司',
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
  group: '所属用户组',
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

class UserEditModal extends PureComponent {
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
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  onOrgTreeSelectChange = (value) => {
    console.log(value);

  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const {
      form,
      dispatch,
      submitting,
      PersonEditVisible,
      handlePersonEditVisible,
      rowInfo,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'person/add',
            payload: values,
            callback: res => {
              if (res.meta.status !== '000000') {
                message.error(res.meta.errmsg); // 返回错误信息
                // this.props.data = res.data;
              } else {
                message.success('公司更新成功!');
                this.props.dispatch({
                  type: 'person/fetch',
                  payload: {
                    page: this.props.pageCurrent,
                    pageSize: this.props.pageSizeCurrent,
                  },
                });
              }
            },
          });

          handlePersonEditVisible(false);
          message.success('成功申请用户');
        }
      });
    };
    const onCancel = () => {
      handlePersonEditVisible(false);
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
        title="人员信息编辑"
        style={{ top: 20 }}
        visible={PersonEditVisible}
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
                          initialValue: rowInfo.userName,
                        })(
                          <Input placeholder="请输入用户账号" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.group}>
                        {getFieldDecorator('group', {
                          rules: [{ required: false, message: '请输入所属用户组' }],
                          initialValue: rowInfo.group,
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
                      <Form.Item {...formItemLayout} label={fieldLabels.company}>
                        {getFieldDecorator('company', {
                          rules: [{ required: false, message: '请选择所属公司' }],
                          initialValue: rowInfo.company,
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
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.person}>
                        {getFieldDecorator('person', {
                          rules: [{ required: true, message: '请选择用户实名' }],
                          initialValue: rowInfo.person,
                        })(
                          <Input placeholder="请选择用户实名" />
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
                      initialValue: rowInfo.effectiveDate,
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
                      initialValue: rowInfo.password,
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
                      initialValue: rowInfo.repassword,
                    })(
                      <Input type='password' placeholder="请输入确认密码" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.email}>
                    {getFieldDecorator('email', {
                      rules: [{ required: false, message: '请输入电子邮箱' }],
                      initialValue: rowInfo.email,
                    })(
                      <Input placeholder="请输入电子邮箱" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.officePhone}>
                    {getFieldDecorator('officePhone', {
                      rules: [{ required: false, message: '请输入办公电话' }],
                      initialValue: rowInfo.officePhone,
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
                      initialValue: rowInfo.homePhone,
                    })(
                      <Input placeholder="请输入家庭电话" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.backupEMail}>
                    {getFieldDecorator('backupEMail', {
                      rules: [{ required: false, message: '请输入备用邮箱' }],
                      initialValue: rowInfo.backupEMail,
                    })(
                      <Input placeholder="请输入备用邮箱" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.defaultOrg}>
                    {getFieldDecorator('defaultOrg', {
                      rules: [{ required: false, message: '请选择缺省公司' }],
                      initialValue: rowInfo.defaultOrg,
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
                    {getFieldDecorator('remark',{
                      initialValue: rowInfo.remark,
                      })(
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
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(UserEditModal));
