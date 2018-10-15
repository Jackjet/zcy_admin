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
} from 'antd';
import { connect } from 'dva';
import styles from './UserListAdd.less';

const left = {
  style:{
     float: left,
   },
  };
const right = {
  style:{
    float: right,
  },
};

const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  account: '帐号',
  employeeNumber: '工号',
  name: '姓名',
  branchOffice: '所属分公司',
  department: '部门',
  station: '岗位',
  rank: '职级',
  sex: '性别',
  nation: '民族',
  workingCondition: '工作状态',
  nativePlace: '籍贯',
  health: '健康状况',
  maritalStatus: '婚姻情况',
  education: '最高学历',
  politicalStatus: '政治面貌',
  hiredate: '入职时间',
  identityCard: '身份证',
  birthday: '生日',
  photo: '上传照片',
  fax: '传真',
  mailBox: '电子邮箱',
  homePhone: '住宅电话',
  officePhone: '办公电话',
  mobilePhone: '移动电话',
  virtualTelephone: '虚拟短号',
  address: '地址',
  remarks: '备注',
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
class PersonAddModal extends PureComponent {
  state = {
    width: '90%',
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
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
    const { form, dispatch, submitting , PersonAddVisible, handlePersonAddVisible} = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handlePersonAddVisible(false);
          form.resetFields();
          message.success('成功申请用户');
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handlePersonAddVisible(false);
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );
    return (
      <Modal
        title="人员信息新增"
        style={{ top: 20 }}
        visible={PersonAddVisible}
        width="60%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <div>
                <div {...left} >
                  <Row>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.account}>
                        {getFieldDecorator('account', {
                          rules: [{ required: true, message: '请输入帐号' }],
                        })(<Input placeholder="请输入帐号" />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.employeeNumber}>
                        {getFieldDecorator('employeeNumber', {
                          rules: [{ required: true, message: '请输入工号' }],
                        })(<Input placeholder="请输入工号" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.name}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请选择姓名' }],
                        })(<Input placeholder="请选择姓名" />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formItemLayout} label={fieldLabels.sex}>
                        {getFieldDecorator('sex', {
                          rules: [{ required: true, message: '请选择性别' }],
                        })(
                          <Select placeholder="请选择性别" >
                            <Option value="1">男</Option>
                            <Option value="2">女</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div {...right}>
                  <Form.Item {...formItemLayout} label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请选择姓名' }],
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
                  <Form.Item {...formItemLayout} label={fieldLabels.nation}>
                    {getFieldDecorator('nation', {
                      rules: [{ required: true, message: '请选择民族' }],
                    })(<Input placeholder="请选择民族" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.nativePlace}>
                    {getFieldDecorator('nativePlace', {
                      rules: [{ required: true, message: '请输入籍贯' }],
                    })(<Input placeholder="请输入籍贯" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.health}>
                    {getFieldDecorator('health', {
                      rules: [{ required: true, message: '请输入健康状态' }],
                    })(
                      <Select placeholder="请输入健康状态">
                        <Option value="1">良好</Option>
                        <Option value="2">一般</Option>
                        <Option value="3">体质差</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.branchOffice}>
                    {getFieldDecorator('branchOffice', {
                      rules: [{ required: true, message: '请选择所属分公司' }],
                    })(
                      <Select placeholder="请选择所属分公司">
                        <Option value="g">至诚</Option>
                        <Option value="y">事务所有限公司</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.rank}>
                    {getFieldDecorator('rank', {
                      rules: [{ required: true, message: '请选择职级' }],
                    })(
                      <Select placeholder="请选择职级" >
                        <Option value="1">合伙人1</Option>
                        <Option value="2">合伙人2</Option>
                        <Option value="3">合伙人3</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.workingCondition}>
                    {getFieldDecorator('workingCondition', {
                      rules: [{ required: true, message: '请选择工作状态' }],
                    })(
                      <Select placeholder="请选择工作状态" >
                        <Option value="1">在职</Option>
                        <Option value="2">外派</Option>
                        <Option value="3">请假</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.department}>
                    {getFieldDecorator('department', {
                      rules: [{ required: true, message: '请选择部门' }],
                    })(<Input placeholder="请选择部门" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.station}>
                    {getFieldDecorator('station', {
                      rules: [{ required: true, message: '请选择所属岗位' }],
                    })(
                      <Select placeholder="请选择所属岗位" >
                        <Option value="g">总经理</Option>
                        <Option value="y">开发部</Option>
                        <Option value="s">审计部</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.hiredate}>
                    {getFieldDecorator('hiredate', {
                      rules: [{ required: true, message: '请输入入职时间' }],
                    })(<DatePicker placeholder="请输入入职时间" />)}
                  </Form.Item>
                </Col>

              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.maritalStatus}>
                    {getFieldDecorator('maritalStatus', {
                      rules: [{ required: true, message: '请输入婚姻状况' }],
                    })(
                      <Select placeholder="请输入婚姻状况">
                        <Option value="1">已婚</Option>
                        <Option value="2">未婚</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.education}>
                    {getFieldDecorator('education', {
                      rules: [{ required: true, message: '请输入健最高学历' }],
                    })(
                      <Select placeholder="请输入健最高学历">
                        <Option value="1">博士后</Option>
                        <Option value="2">博士</Option>
                        <Option value="3">硕士</Option>
                        <Option value="4">本科</Option>
                        <Option value="5">大专</Option>
                        <Option value="6">中专</Option>
                        <Option value="7">高中</Option>
                        <Option value="8">初中</Option>
                        <Option value="9">小学</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.politicalStatus}>
                    {getFieldDecorator('politicalStatus', {
                      rules: [{ required: true, message: '请输入政治面貌' }],
                    })(
                      <Select placeholder="请输入政治面貌">
                        <Option value="1">党员</Option>
                        <Option value="2">共青团员</Option>
                        <Option value="3">群众</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.identityCard}>
                    {getFieldDecorator('identityCard', {
                      rules: [{ required: true, message: '请输入身份证' }],
                    })(<Input placeholder="请输入身份证" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.birthday}>
                    {getFieldDecorator('birthday', {
                      rules: [{ required: true, message: '请输入生日' }],
                    })(<DatePicker placeholder="请输入生日" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="是否合伙人">
                    {getFieldDecorator('partner', {
                      rules: [{ required: true, message: '合伙人' }],
                    })(
                      <Select placeholder="合伙人"  >
                        <Option value={1}>是</Option>
                        <Option value={2}>否</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.fax}>
                    {getFieldDecorator('fax', {
                      rules: [{ required: true, message: '请输入传真' }],
                    })(<Input placeholder="请输入传真" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.mailBox}>
                    {getFieldDecorator('mailBox', {
                      rules: [{ required: true, message: '请输入电子邮箱' }],
                    })(<Input placeholder="请输入电子邮箱" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="合伙人类别">
                    {getFieldDecorator('partnerType', {
                      rules: [{ required: true, message: '合伙人类别' }],
                    })(
                      <Select placeholder="合伙人类别"  >
                        <Option value={1}>执行合伙人</Option>
                        <Option value={2}>管理合伙人</Option>
                        <Option value={3}>技术合伙人</Option>
                        <Option value={4}>合伙人</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.homePhone}>
                    {getFieldDecorator('homePhone', {
                      rules: [{ required: true, message: '请输入住宅电话' }],
                    })(<Input placeholder="请输入住宅电话" />)}
                  </Form.Item>
                </Col>
                <Col span={14} pull={2}>
                  <Form.Item {...formItemLayout} label={fieldLabels.address}>
                    {getFieldDecorator('address')(
                      <Input placeholder="请输入地址" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.officePhone}>
                    {getFieldDecorator('officePhone', {
                      rules: [{ required: true, message: '请输入办公电话' }],
                    })(<Input placeholder="请输入办公电话" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.mobilePhone}>
                    {getFieldDecorator('mobilePhone', {
                      rules: [{ required: true, message: '请输入移动电话' }],
                    })(<Input placeholder="请输入移动电话" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.virtualTelephone}>
                    {getFieldDecorator('virtualTelephone', {
                      rules: [{ required: true, message: '请输入虚拟短号' }],
                    })(<Input placeholder="请输入虚拟短号" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.remarks}>
                    {getFieldDecorator('remarks')(
                      <TextArea placeholder="请输入备注" style={{ width: 1000 }} />
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
}))(Form.create()(PersonAddModal));
