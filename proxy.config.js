module.exports = {
  '/api': {
    target:'http://127.0.0.1:1801',
    changeOrigin: true,
    pathRewrite: {
      '^api': '/api',
    },
  },
  '/company': {
    target:'http://127.0.0.1:1801',
    changeOrigin: true,
    pathRewrite: {
      '^company': '/company',
    },
  },
};
