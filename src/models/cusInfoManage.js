import { addCusInfoManage, queryCusInfoManage,updateCusInfoManage ,deleteCusInfoManage, statusCancelCancel  } from '../services/cusInfoManage';

export default {
  namespace: 'cusInfoManage',

  state: {
    data: {
      list: [],
      pagination: {},
      total:'',
    },
  },

  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(queryCusInfoManage, payload);
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

    *add({ payload, callback }, { call}) {
      const response = yield call(addCusInfoManage, payload);
      if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
      }
    },
    *update({ payload, callback }, { call}) {
      const response = yield call(updateCusInfoManage, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *remove({ payload, callback }, { call}) {
      const response = yield call(deleteCusInfoManage, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *cancelCancel({ payload, callback }, { call }) {
      const response = yield call(statusCancelCancel, payload);
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
      };
    },
  },
};
