module.exports = {
  '/api': {
    target:'http://192.168.12.23:1801',
    changeOrigin: true,
    pathRewrite: {
      '^api': '/api',
    },
  },
};
