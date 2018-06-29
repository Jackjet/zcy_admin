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
} from 'antd';
import { connect } from 'dva';
import styles from './UserListAdd.less';

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

// 照片上传方法明细
const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const formItemLayout = {
  style: {
    width: '55%',
  },
  wrapperCol: {
    style: {
      width: '60%',
    },
  },
};

class UserListAdd extends PureComponent {
  state = {
    width: '90%',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Card>
          <Form layout="inline">
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.account}>
                  {getFieldDecorator('account', {
                    rules: [{ required: true, message: '请输入帐号' }],
                  })(<Input placeholder="请输入帐号" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.employeeNumber}>
                  {getFieldDecorator('employeeNumber', {
                    rules: [{ required: true, message: '请输入工号' }],
                  })(<Input placeholder="请输入工号" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.name}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择姓名' }],
                  })(<Input placeholder="请选择姓名" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={fieldLabels.branchOffice}>
                  {getFieldDecorator('branchOffice', {
                    rules: [{ required: true, message: '请选择所属分公司' }],
                  })(
                    <Select placeholder="请选择所属分公司" style={{ width: 200 }}>
                      <Option value="g">至诚</Option>
                      <Option value="y">事务所有限公司</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.department}>
                  {getFieldDecorator('department', {
                    rules: [{ required: true, message: '请选择部门' }],
                  })(<Input placeholder="请选择部门" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.station}>
                  {getFieldDecorator('station', {
                    rules: [{ required: true, message: '请选择所属岗位' }],
                  })(
                    <Select placeholder="请选择所属岗位" style={{ width: 200 }}>
                      <Option value="g">总经理</Option>
                      <Option value="y">开发部</Option>
                      <Option value="s">审计部</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.rank}>
                  {getFieldDecorator('rank', {
                    rules: [{ required: true, message: '请选择职级' }],
                  })(
                    <Select placeholder="请选择职级" style={{ width: 200 }}>
                      <Option value="1">合伙人1</Option>
                      <Option value="2">合伙人2</Option>
                      <Option value="3">合伙人3</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.sex}>
                  {getFieldDecorator('sex', {
                    rules: [{ required: true, message: '请选择性别' }],
                  })(
                    <Select placeholder="请选择性别" style={{ width: 200 }}>
                      <Option value="1">男</Option>
                      <Option value="2">女</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.nation}>
                  {getFieldDecorator('nation', {
                    rules: [{ required: true, message: '请选择民族' }],
                  })(<Input placeholder="请选择民族" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.workingCondition}>
                  {getFieldDecorator('workingCondition', {
                    rules: [{ required: true, message: '请选择工作状态' }],
                  })(
                    <Select placeholder="请选择工作状态" style={{ width: 200 }}>
                      <Option value="1">在职</Option>
                      <Option value="2">外派</Option>
                      <Option value="3">请假</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.nativePlace}>
                  {getFieldDecorator('nativePlace', {
                    rules: [{ required: true, message: '请输入籍贯' }],
                  })(<Input placeholder="请输入籍贯" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.health}>
                  {getFieldDecorator('health', {
                    rules: [{ required: true, message: '请输入健康状态' }],
                  })(
                    <Select placeholder="请输入健康状态" style={{ width: 200 }}>
                      <Option value="1">良好</Option>
                      <Option value="2">一般</Option>
                      <Option value="3">体质差</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.maritalStatus}>
                  {getFieldDecorator('maritalStatus', {
                    rules: [{ required: true, message: '请输入婚姻状况' }],
                  })(
                    <Select placeholder="请输入婚姻状况" style={{ width: 200 }}>
                      <Option value="1">已婚</Option>
                      <Option value="2">未婚</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.education}>
                  {getFieldDecorator('education', {
                    rules: [{ required: true, message: '请输入健最高学历' }],
                  })(
                    <Select placeholder="请输入健最高学历" style={{ width: 200 }}>
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
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.politicalStatus}>
                  {getFieldDecorator('politicalStatus', {
                    rules: [{ required: true, message: '请输入政治面貌' }],
                  })(
                    <Select placeholder="请输入政治面貌" style={{ width: 200 }}>
                      <Option value="1">党员</Option>
                      <Option value="2">共青团员</Option>
                      <Option value="3">群众</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.hiredate}>
                  {getFieldDecorator('hiredate', {
                    rules: [{ required: true, message: '请输入入职时间' }],
                  })(<DatePicker placeholder="请输入入职时间" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.identityCard}>
                  {getFieldDecorator('identityCard', {
                    rules: [{ required: true, message: '请输入身份证' }],
                  })(<Input placeholder="请输入身份证" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.birthday}>
                  {getFieldDecorator('birthday', {
                    rules: [{ required: true, message: '请输入生日' }],
                  })(<DatePicker placeholder="请输入生日" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.photo}>
                  {getFieldDecorator('photo', {
                    rules: [{ required: true, message: '请上传照片' }],
                  })(
                    <Upload {...props} style={{ width: 200 }}>
                      <Button>
                        <Icon type="upload" /> 请上传照片
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.fax}>
                  {getFieldDecorator('fax', {
                    rules: [{ required: true, message: '请输入传真' }],
                  })(<Input placeholder="请输入传真" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.mailBox}>
                  {getFieldDecorator('mailBox', {
                    rules: [{ required: true, message: '请输入电子邮箱' }],
                  })(<Input placeholder="请输入电子邮箱" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.homePhone}>
                  {getFieldDecorator('homePhone', {
                    rules: [{ required: true, message: '请输入住宅电话' }],
                  })(<Input placeholder="请输入住宅电话" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.officePhone}>
                  {getFieldDecorator('officePhone', {
                    rules: [{ required: true, message: '请输入办公电话' }],
                  })(<Input placeholder="请输入办公电话" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.homePhone}>
                  {getFieldDecorator('homePhone', {
                    rules: [{ required: true, message: '请输入住宅电话' }],
                  })(<Input placeholder="请输入住宅电话" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.officePhone}>
                  {getFieldDecorator('officePhone', {
                    rules: [{ required: true, message: '请输入办公电话' }],
                  })(<Input placeholder="请输入办公电话" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.mobilePhone}>
                  {getFieldDecorator('mobilePhone', {
                    rules: [{ required: true, message: '请输入移动电话' }],
                  })(<Input placeholder="请输入移动电话" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={fieldLabels.virtualTelephone}>
                  {getFieldDecorator('virtualTelephone', {
                    rules: [{ required: true, message: '请输入虚拟短号' }],
                  })(<Input placeholder="请输入虚拟短号" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.address}>
                  {getFieldDecorator('address')(
                    <Input placeholder="请输入地址" style={{ width: 400 }} />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={24}>
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
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(UserListAdd));
