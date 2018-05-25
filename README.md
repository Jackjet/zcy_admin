[English](./README.md) | 简体中文

# Ant Design Pro 使用记录

[![](https://img.shields.io/travis/ant-design/ant-design-pro.svg?style=flat-square)](https://travis-ci.org/ant-design/ant-design-pro) [![Build status](https://ci.appveyor.com/api/projects/status/67fxu2by3ibvqtat/branch/master?svg=true)](https://ci.appveyor.com/project/afc163/ant-design-pro/branch/master)  [![Gitter](https://badges.gitter.im/ant-design/ant-design-pro.svg)](https://gitter.im/ant-design/ant-design-pro?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

开箱即用的中台前端/设计解决方案。

![](https://gw.alipayobjects.com/zos/rmsportal/xEdBqwSzvoSapmnSnYjU.png)

- 预览：http://preview.pro.ant.design
- 首页：http://pro.ant.design/index-cn
- 使用文档：http://pro.ant.design/docs/getting-started-cn
- 更新日志: http://pro.ant.design/docs/changelog-cn
- 常见问题：http://pro.ant.design/docs/faq-cn
- 国内镜像：http://ant-design-pro.gitee.io

## 特性

- :gem: **优雅美观**：基于 Ant Design 体系精心设计
- :triangular_ruler: **常见设计模式**：提炼自中后台应用的典型页面和场景
- :rocket: **最新技术栈**：使用 React/dva/antd 等前端前沿技术开发
- :iphone: **响应式**：针对不同屏幕大小设计
- :art: **主题**：可配置的主题满足多样化的品牌诉求
- :globe_with_meridians: **国际化**：内建业界通用的国际化方案
- :gear: **最佳实践**：良好的工程实践助您持续产出高质量代码
- :1234: **Mock 数据**：实用的本地数据调试方案
- :white_check_mark: **UI 测试**：自动化测试保障前端产品质量

## 使用

```
  src/components/SiderMenu/SiderMenu.js    第212代码。width改右边导航栏长度

  导航栏的内容在 src/common/menu.js 中
  全局的路由关系是这样一个走向：src/index.js 中通过 app.router(require('./router').default);，
 将 src/router.js 绑定到 dva 实例的 router 方法上。而在 src/router.js 中又引入了 src/common/router.js 中的 getRouterData 作为数据源。
 如果有点绕，不太能一下子看明白，那就直接记下面的结论：
 
 因而，src/common/menu.js 中 path 所指向的路径对应于 src/common/router.js 中的路由记录。
 getRouterData 
  
  同src目录下，.webpackrc.js里面配置了，关联了页面入口设置。
 
 
routes：每个路由对应的页面组件文件。主要定义具体页面的基本结构和内容。
 
 services：用于与后台交互、发送请求等。
 
 models：用于组件的数据存储，接收请求返回的数据等。
 
 components：组件文件夹。每个页面可能是由一些组件组成的，对于一些相对通用的组件，建议将该组件写入components文件夹中，并在routes文件夹中的文件引入来使用。
 
 .roadhogrc.mock.js   拦截api接口地址
 
 utils/authority.js   控制 权限 登录用户名
 
  redux  和 dva 
  
  import createHistory from 'history/createHashHistory';  引入后  可以让url中多出#  比如：http://localhost:8000/#/?_k=gebc0m
  import createHistory from 'history/createBrowserHistory';  引入后  可以让url 中去掉#，形如restfulurl 方式的 url 
  在页面index.js 中  初始化dva  
  
  
```

## 模板

```
- Dashboard
  - 分析页
  - 监控页
  - 工作台
- 表单页
  - 基础表单页
  - 分步表单页
  - 高级表单页
- 列表页
  - 查询表格
  - 标准列表
  - 卡片列表
  - 搜索列表（项目/应用/文章）
- 详情页
  - 基础详情页
  - 高级详情页
- 结果
  - 成功页
  - 失败页
- 异常
  - 403 无权限
  - 404 找不到
  - 500 服务器出错
- 帐户
  - 登录
  - 注册
  - 注册成功
```

## 使用

```bash
$ git clone https://github.com/ant-design/ant-design-pro.git --depth=1
$ cd ant-design-pro
$ npm install
$ npm start         # 访问 http://localhost:8000
```

也可以使用集成化的 [ant-design-pro-cli](https://github.com/ant-design/ant-design-pro-cli) 工具。

```bash
$ npm install ant-design-pro-cli -g
$ mkdir pro-demo && cd pro-demo
$ pro new
```

更多信息请参考 [使用文档](http://pro.ant.design/docs/getting-started)。

## 兼容性

现代浏览器及 IE11。

## 参与贡献

我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建 :smiley:：

- 在你的公司或个人项目中使用 Ant Design Pro。
- 通过 [Issue](http://github.com/ant-design/ant-design-pro/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](http://github.com/ant-design/ant-design-pro/pulls) 改进 Pro 的代码。
