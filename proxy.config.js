module.exports = {
  '/api': {
    target:'http://192.168.0.105:1801',
    changeOrigin: true,
    pathRewrite: {
      '^api': '/api',
    },
  },
};
