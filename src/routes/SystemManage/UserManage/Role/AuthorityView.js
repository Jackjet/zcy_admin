import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  message,
  Icon,
  Modal,
  Popover,
  Input,
  Row,
  Col,
  Table,
} from 'antd';
import { connect } from 'dva';
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
class AuthorityView extends PureComponent {
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
    const { form, dispatch , AuthorityViewVisible, handleAuthorityViewVisible, permItemList} = this.props;
    const { validateFieldsAndScroll, getFieldDecorator } = form;
    const dataSource = permItemList;
    const columns = [{
      title: '权限id',
      dataIndex: 'id',
    }, {
      title: '权限名称',
      dataIndex: 'name',
    }, {
      title: '备注',
      dataIndex: 'remark',
    }];
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handleAuthorityViewVisible(false);
          form.resetFields();
          message.success('成功申请用户');
        }
      });
    };
    const onCancel = () => {
      console.log(permItemList);
      form.resetFields();
      handleAuthorityViewVisible(false);
    };
    return (
      <Modal
        title="查看权限"
        style={{ top: 20 }}
        visible={AuthorityViewVisible}
        width="60%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
        okText='提交'
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('workingCondition', {
                      rules: [{ required: true, message: '已分配的权限' }],
                    })(
                      <Table
                        dataSource={dataSource}
                        columns={columns}
                      />
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
}))(Form.create()(AuthorityView));
