module.exports = {
  '/api': {
    target:'http://192.168.0.188:8090',
    changeOrigin: true,
    pathRewrite: {
      '^api': '/api'
    }
  }
};
