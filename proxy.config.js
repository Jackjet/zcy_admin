module.exports = {
  '/api': {
    target:'http://192.168.0.121:1801',
    changeOrigin: true,
    pathRewrite: {
      '^api': '/api',
    },
  },
};
