import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Register.less';
import Login from '../../components/Login';

const {  Mobile, Captcha } = Login;

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/submitReset'],
}))
@Form.create()
export default class ResetPassword extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
  };

  componentWillReceiveProps(nextProps) {
    const account = this.props.form.getFieldValue('mobile');
    if (nextProps.login.status === 'resetTest') {
      this.props.dispatch(
        routerRedux.push ({
          pathname: '/user/modify',
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

  // handleSubmit = () => {
  //   this.props.form.validateFields({ force: true }, (err, values) => {
  //     if (!err) {
  //       this.props.dispatch({
  //         type: 'login/submitReset',
  //         payload: {
  //           ...values,
  //           prefix: this.state.prefix,
  //         },
  //       });
  //     }else{
  //
  //     }
  //   });
  // };

  handleSubmit = (err, values) => {
    const { prefix } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/submitReset',
        payload: {
          ...values,
          prefix,
        },
      });
    }
  };

  render() {
    const { login, submitting } = this.props;
    const { count, prefix } = this.state;
    return (
      <div className={styles.main}>
        <h3>重置密码</h3>
        <Login  onSubmit={this.handleSubmit}>
          <div>
            {login.status === 'error' &&
            !login.submitting &&
            this.renderMessage('验证码错误')}
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </div>
          <div>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              下一步
            </Button>
            <Link className={styles.login} to="/user/login">
              返回登录
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}
