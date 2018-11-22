import { addCusApplication, queryCusApplication,updateCusApplication ,deleteCusApplication, statusCancelCancel, getDictTree  } from '../services/cusApplication';

export default {
  namespace: 'cusApplication',

  state: {
    data: {
      list: [],
      pagination: {},
      total:'',
    },
  },

  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(queryCusApplication, payload);
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

    *add({ payload, callback }, { call }) {
      const response = yield call(addCusApplication, payload);
      if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateCusApplication, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(deleteCusApplication, payload);
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
    *getDictTree({ payload, callback }, { call }) {
      const response = yield call(getDictTree, payload);
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
