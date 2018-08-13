import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
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

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class ModifyPassword extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
  };

  componentWillReceiveProps(nextProps) {
    const account = this.props.form.getFieldValue('mail');
    if (nextProps.register.status === 'ok') {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/user/register-result',
          state: {
            account,
          },
        })
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix: this.state.prefix,
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix } = this.state;
    return (
      <div className={styles.main}>
        <h3>重置密码---至诚会计事务所项目管理系统</h3>
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col>
              <FormItem label="新密码">
                {getFieldDecorator('lock', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码！ ',
                    },
                  ],
                })(
                  <Input size="large" placeholder="请输入密码" />
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem label="确认密码">
                {getFieldDecorator('lock', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码！ ',
                    },
                  ],
                })(
                  <Input size="large" placeholder="请输入密码" />
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem >
                <Button
                  size="large"
                  loading={submitting}
                  className={styles.submit}
                  type="primary"
                  htmlType="submit"
                >
                  确定
                </Button>
                <Link className={styles.login} to="/user/login">
                  返回登录
                </Link>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
