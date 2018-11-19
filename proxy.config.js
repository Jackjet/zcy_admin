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
  '/cusApplication': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^cusApplication': '/cusApplication',
    },
  },
  '/cusInfoManage': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^cusInfoManage': '/cusInfoManage',
    },
  },
  '/projectAssignment': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^projectAssignment': '/projectAssignment',
    },
  },
  '/proPartnerRelation': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^proPartnerRelation': '/proPartnerRelation',
    },
  },

  '/opportunity': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^opportunity': '/opportunity',
    },
  },

  '/visit': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^visit': '/visit',
    },
  },

  '/contract': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^contract': '/contract',
    },
  },

  '/dept': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^dept': '/dept',
    },
  },
  '/user': {
    target:'http://localhost:1801',
    changeOrigin: true,
    pathRewrite: {
      '^user': '/user',
    },
  },
};
