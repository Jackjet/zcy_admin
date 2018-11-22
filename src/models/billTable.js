import { queryBillTable, addNewDict, updateDict,deleteDict,getAllDictType,getDictTreeByTypeId } from '../services/billTable';

export default {
  namespace: 'billTable',

  state: {
    data: {
      list: [],
      pagination: {},
      total:'',
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryBillTable, payload);
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
    *getDictTreeByTypeId({ payload, callback }, { call}) {
      const response = yield call(getDictTreeByTypeId, payload);
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
