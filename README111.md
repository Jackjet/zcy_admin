English | [简体中文](./README.zh-CN.md)

# Ant Design Pro

[![](https://img.shields.io/travis/ant-design/ant-design-pro/master.svg?style=flat-square)](https://travis-ci.org/ant-design/ant-design-pro) [![Build status](https://ci.appveyor.com/api/projects/status/67fxu2by3ibvqtat/branch/master?svg=true)](https://ci.appveyor.com/project/afc163/ant-design-pro/branch/master)  [![Gitter](https://badges.gitter.im/ant-design/ant-design-pro.svg)](https://gitter.im/ant-design/ant-design-pro?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

An out-of-box UI solution for enterprise applications as a React boilerplate.

![](https://gw.alipayobjects.com/zos/rmsportal/xEdBqwSzvoSapmnSnYjU.png)

- Preview: http://preview.pro.ant.design
- Home Page: http://pro.ant.design
- Documentation: http://pro.ant.design/docs/getting-started
- ChangeLog: http://pro.ant.design/docs/changelog
- FAQ: http://pro.ant.design/docs/faq
- Mirror Site in China: http://ant-design-pro.gitee.io

## Translation Recruitment :loudspeaker:

We need your help: https://github.com/ant-design/ant-design-pro/issues/120

## Features

- :gem: **Neat Design**: Follow [Ant Design specification](http://ant.design/)
- :triangular_ruler: **Common Templates**: Typical templates for enterprise applications
- :rocket: **State of The Art Development**: Newest development stack of React/dva/antd
- :iphone: **Responsive**: Designed for varies of screen size
- :art: **Theming**: Customizable theme with simple config
- :globe_with_meridians: **International**: Built-in i18n solution
- :gear: **Best Practice**: Solid workflow make your code health
- :1234: **Mock development**: Easy to use mock development solution
- :white_check_mark: **UI Test**: Fly safely with unit test and e2e test

## Templates

```
- Dashboard
  - Analytic
  - Monitor
  - Workspace
- Form
  - Basic Form
  - Step Form
  - Advanced From
- List
  - Standard Table
  - Standard List
  - Card List
  - Search List (Project/Applications/Article)
- Profile
  - Simple Profile
  - Advanced Profile
- Result
  - Success
  - Failed
- Exception
  - 403
  - 404
  - 500
- User
  - Login
  - Register
  - Register Result
```

## Usage

```bash
$ git clone https://github.com/ant-design/ant-design-pro.git --depth=1
$ cd ant-design-pro
$ npm install
$ npm start         # visit http://localhost:8000
```

Or you can use the command tool: [ant-design-pro-cli](https://github.com/ant-design/ant-design-pro-cli)

```bash
$ npm install ant-design-pro-cli -g
$ mkdir pro-demo && cd pro-demo
$ pro new
```

More instruction at [documentation](http://pro.ant.design/docs/getting-started).

## Compatibility

Modern browsers and IE11.

## Contributing

Any Contribution of following ways will be welcome:

- Use Ant Design Pro in your daily work.
- Submit [issue](http://github.com/ant-design/ant-design-pro/issues) to report bug or ask questions.
- Propose [pull request](http://github.com/ant-design/ant-design-pro/pulls) to improve our code.

  list列表中的新建弹窗创建：
  定义常量集合，其中包括弹窗的显示 隐藏状态，form， 表单数据的提交方法 点击取消改变对话框状态隐藏的方法。
  validateFields是form中校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件。
  Modal组建确定取消是在<Modal footer={null}>方法，自定义按钮方法footer={null,(这边可以写自己的按钮，以及按钮方法，事件，)}
  
  PureComponent和Component区别：
  PureComponent非常适合于不变的组件，尤其是和数据、业务无关的纯展示组件，因为它的节省了大量比较的工作。
  
  Object.keys()方法会返回一个由一个给定对象的自身可枚举属性组成的数组,
  reduce方法有两个参数，第一个参数是一个callback，用于针对数组项的操作；
  第二个参数则是传入的初始值，这个初始值用于单个数组项的操作。
  需要注意的是，reduce方法返回值并不是数组，而是形如初始值的经过叠加处理后的操作。
 
  common/router.js中的自动加载modals代码  原则上只要这个modals在一行代码被加载，那么其他代码即使不写这个modals组建也能渲染对应的组建。
  但为了代码清晰，还是选择将所需的modals加入到[]中.
  
  render()只能有一个  return可以多个。
  
  this.props获取return（）;中的外面组建中的所有组建的属性。
  this.state获取当前组建的状态.
  
  2018/10/30
    Input框 历史记录问题，点击 滚动后会发生可怕的事情
