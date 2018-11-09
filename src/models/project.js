import { updatePerson, queryPerson, removePersonById, addPerson, removePersonByCondition, statusCancelCancel, statusCancel } from '../services/person';
import {queryProjectNotice} from '../services/api';

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
      const response = yield call(queryPerson, payload);
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
      const response = yield call(updatePerson, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *add({ payload, callback }, { call}) {
      const response = yield call(addPerson, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *remove({ payload, callback }, { call }) {
      const response = yield call(removePersonById, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *removeMore({ payload, callback }, { call }) {
      const response = yield call(removePersonByCondition, payload);
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

  /*  *fetchNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response) ? response : [],
      });
    },*/

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
