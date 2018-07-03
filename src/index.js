import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';

//import createHistory from 'history/createHashHistory';
// user BrowserHistory
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';

// 1. Initialize  dva初始化
const app = dva({
  history: createHistory(),
});

// 2. Plugins   加载插件
app.use(createLoading());
//app.use("/api",proxy("htpp://192.178279327.909.9809/api"));

// 3. Register global model   注册全集model
app.model(require('./models/global').default);

// 4. Router  加载路由
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
