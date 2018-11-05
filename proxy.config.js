module.exports = {
  '/api': {
    target:'http://192.168.0.105:1801',
    changeOrigin: true,
    pathRewrite: {
      '^api': '/api',
    },
  },
  '/company': {
    target:'http://192.168.0.105:1801',
    changeOrigin: true,
    pathRewrite: {
      '^company': '/company',
    },
  },
  '/dept': {
    target:'http://192.168.0.105:1801',
    changeOrigin: true,
    pathRewrite: {
      '^dept': '/dept',
    },
  },
};
