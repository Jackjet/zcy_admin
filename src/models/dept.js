import { queryDept, updateDept, addDept, removeDeptById, removeDeptByCondition, statusCancelCancel } from '../services/dept';

export default {
  namespace: 'dept',

  state: {
    data: {
      list: [],
      pagination: {},
      total:'',
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryDept, payload);
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
    *update({ payload ,callback}, { call }) {
      const response = yield call(updateDept, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *add({ payload, callback }, { call}) {
      const response = yield call(addDept, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *remove({ payload, callback }, { call }) {
      const response = yield call(removeDeptById, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *removeMore({ payload, callback }, { call }) {
      const response = yield call(removeDeptByCondition, payload);
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
    *cancel({ payload, callback }, { call }) {
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
