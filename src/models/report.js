import { addReport, generateReportNum, updateCompany, queryCompany, removeCompanyById, addCompany, removeCompanyByCondition, statusCancelCancel } from '../services/report';

export default {
  namespace: 'report',

  state: {
    data: {
      list: [],
      pagination: {},
      total:'',
    },
  },

  effects: {
    /**fetch({ payload ,callback}, { call, put }) {
      const response = yield call(queryCompany, payload);
      if (response.meta.status === '000000') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getLeftTreeMenu({ callback }, { call}) {
      const response = yield call(getLeftTreeMenu);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },*/
    *add({ payload, callback }, { call}) {
      const response = yield call(addReport, payload);
      if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
      }
    },
    *generateReportNum({ payload, callback }, { call}) {
      const response = yield call(generateReportNum, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
        /*data: {
          list: action.payload.data.items,
          pagination: action.payload.data.pagination,
          total:action.payload.data.num_items,
        },*/
      };
    },
  },
};
