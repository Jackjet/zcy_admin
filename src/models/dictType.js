import { queryDictType, addDictType, updateDictType,removeDictTypeById } from '../services/dictType';

export default {
  namespace: 'dictType',

  state: {
    data: {
      list: [],
      pagination: {},
      total:'',
    },
  },

  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(queryDictType, payload);
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
      const response = yield call(addDictType, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *update({ payload, callback }, { call}) {
      const response = yield call(updateDictType, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *remove({ payload, callback }, { call}) {
      const response = yield call(removeDictTypeById, payload);
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
