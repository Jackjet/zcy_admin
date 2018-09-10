import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import $ from  'jquery';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: false,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  showHideQRModal(state){
    var obj = $("#qrcodeModal");
    if(state===1){
      obj.show();
    }else{
      obj.hide();
    }
  }


  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <a href="javascript:;" className={styles.ercode} onClick={()=>{this.showHideQRModal(1)}} ></a>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
         <div>
            {login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('账户或密码错误（admin/888888）')}
            <UserName name="userName" placeholder="请输入手机号" />
            <Password name="password" placeholder="请输入密码" />
          </div>
          <div className={styles.other}>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              记住用户
            </Checkbox>
            <Link className={styles.register} to="/user/reset">
              忘记密码
            </Link>

          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>

        <div className={styles["ercode-open"]} id="qrcodeModal">
          <a href="javascript:;" onClick={()=>{this.showHideQRModal(0)}}  className={styles['code_close']}><span className={styles['close-btn']}></span></a>
          <div  className={styles["head"]}>
            <h3>扫码二维码登录至诚云APP</h3>
            <p>请打开至诚云APP应用，‘扫一扫’登录</p>
          </div>
          <div >
            <img src />
          </div>
        </div>

      </div>
    );
  }
}
