import { queryRolePerm, addRolePerm, updateRolePerm  } from '../services/rolePerm';

export default {
  namespace: 'rolePerm',

  state: {
    data: {
      list: [],
      pagination: {},
      total:'',
    },
  },

  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(queryRolePerm, payload);
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
      const response = yield call(addRolePerm, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *update({ payload ,callback}, { call }) {
      const response = yield call(updateRolePerm, payload);
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
