import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from 'components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <a href="/user/login">
      <Button size="large">返回登录</Button>
    </a>
  </div>
);

export default ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        你的账户密码:修改成功
      </div>
    }
    actions={actions}
    style={{ marginTop: 56 }}
  />
);
