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
  
  cesjosfhoslhfshgdl hgdl 
  
  1、下载或克隆项目源码
  2.npm安装相关包文件
     npm i
     
  3.启动项目 
  
   npm start 
   
   4.打包项目
   npm run build  
  
  
```


