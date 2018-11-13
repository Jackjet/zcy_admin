import { queryDict, addNewDict, updateDict,deleteDict,getAllDictType,getDictTypeTree } from '../services/dict';

export default {
  namespace: 'dict',

  state: {
    data: {
      list: [],
      pagination: {},
      total:'',
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryDict, payload);
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
      const response = yield call(addNewDict, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *update({ payload, callback }, { call}) {
      const response = yield call(updateDict, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *remove({ payload, callback }, { call}) {
      const response = yield call(deleteDict, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getAllDictType({ payload, callback }, { call}) {
      const response = yield call(getAllDictType, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getDictTypeTree({ payload, callback }, { call}) {
      const response = yield call(getDictTypeTree, payload);
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
