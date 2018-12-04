module.exports = {
  '/api': {
    target:'http://192.168.125.115:1801',
    changeOrigin: true,
    pathRewrite: {
      '^api': '/api',
    },
  },
};
