import React, { Component } from 'react';
import { connect } from 'dva';
import {Link, routerRedux} from 'dva/router';
import { Checkbox, Alert, Icon,message,Modal ,Button,Radio } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import $ from  'jquery';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

const RadioGroup = Radio.Group;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    loading: false,
    type: 'account',
    autoLogin: false,
    switchOrgvisible: false,
    value:'',
    companyId:'',
    companyName:'',

  };

  onTabChange = type => {
    console.log(type+"esfdsgsdgdfgdfhfgjg");
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.setState({userName:values.userName})
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
        callback: (res) => {

         /* {res.status === 'ok'  &&  this.renderMessage("222222")}*/
          if(res.meta.status === '000000' ) {
              this.handleSwitchOrgShowModal();
          }
            // routerRedux.push()

        }
      });
    }
  };


  // 登录公司 取消
  handleCancel = () => {
    this.setState({ switchOrgvisible: false });
  };


// 登录公司选择确定
  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, switchOrgvisible: false });
      this.props.dispatch(routerRedux.push({
        pathname: '/',
        query: {companyId: this.state.companyId,companyName:this.state.companyName}
      }));
    }, 1000);
  };

  //  显示登录 公司
  handleSwitchOrgShowModal = () => {
    this.setState({
      switchOrgvisible: true,
    });

  };

  // 检查 是否 记住用户
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  // 显示  隐藏  二维码 登录
  showHideQRModal(state){
    var obj = $("#qrcodeModal");
    if(state===1){
      obj.show();
      this.onTabChange("qrcode");
    }else{
      obj.hide();
    }
  }


  //公司列表 单选框 变化事件
  onChange = (e) => {
    let checkvalue = e.target.value;
    let nameid = '';
    if(checkvalue){
      nameid =  checkvalue.split('<@>');
    }
    console.log('radio checked', nameid[0]);
    console.log('radio checked', nameid[1]);
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
      companyId:nameid[0],
      companyName:nameid[1],
    });
  };

// 提示信息
  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { switchOrgvisible,type,loading } = this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <div className={styles.main}>
        <a href="javascript:;" className={styles.ercode} onClick={()=>{this.showHideQRModal(1)}} ></a>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <div>
            {login.status === 'error' &&
            login.type === 'account' &&
            !login.submitting &&
            this.renderMessage('账户或密码错误（18888888888/888888）')}
            <Mobile name="userName" placeholder="请输入手机号" />
            <Password name="password" placeholder="请输入密码" />
          </div>
          <div className={styles.other}>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              记住用户
            </Checkbox>
            <Link className={styles.register} to="/user/reset">
              忘记密码</Link>

          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>

        <div className={styles["ercode-open"]} id="qrcodeModal">
          <a href="javascript:;" onClick={()=>{this.showHideQRModal(0)}}  className={styles['code_close']}><span className={styles['close-btn']}></span></a>
          <div  className={styles["head"]}>
            <h3>扫码二维码登录至诚云</h3>
            <p>请打开至诚云APP，‘扫一扫’登录</p>
          </div>
          <div className={styles['ercode-con']}>
            <img src={'../../src/assets/1536566323.png'} />
          </div>
        </div>


        <Modal
          visible={switchOrgvisible}
          title={<h5 ><i className="anticon anticon-bars" ></i><span> 请选择登录公司</span></h5>}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <div style={{paddingLeft:16}}>
            <RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio style={radioStyle} value={'1<@>义乌至诚会计师事务所'}>义乌至诚会计师事务所</Radio>
              <Radio style={radioStyle} value={'2<@>杭州至诚云软件技术有限公司'}>杭州至诚云软件技术有限公司</Radio>
              <Radio style={radioStyle} value={'3<@>杭州至诚会计师事务所'}>杭州至诚会计师事务所</Radio>
              <Radio style={radioStyle} value={'4<@>---'}>...</Radio>
            </RadioGroup>
          </div>
        </Modal>



      </div>
    );
  }
}
