import { updateProInfo, queryProInfo, removeProInfoById, addProInfo, removeProInfoByCondition, statusCancelCancel, getDictByCondition } from '../services/proInfo';

export default {
  namespace: 'project',

  state: {
    step:{
      number:``,
    },
    data: {
      list: [],
      pagination: {},
      total:'',
    },
   // notice:[],
  },

  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(queryProInfo, payload);
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
      const response = yield call(updateProInfo, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *add({ payload, callback }, { call}) {
      const response = yield call(addProInfo, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *remove({ payload, callback }, { call }) {
      const response = yield call(removeProInfoById, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *removeMore({ payload, callback }, { call }) {
      const response = yield call(removeProInfoByCondition, payload);
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
      const response = yield call(statusCancel, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getDict({ payload, callback }, { call }) {
      const response = yield call(getDictByCondition, payload);
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
        step: action.payload.data.number,
      };
    },
   /* saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },*/
  },
};
