module.exports = {
  '/api': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^api': '/api',
    },
  },
  '/company': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^company': '/company',
    },
  },
  '/dept': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^dept': '/dept',
    },
  },
};
