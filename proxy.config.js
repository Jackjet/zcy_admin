module.exports = {
  '/api': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^api': '/api',
    },
  },
};
