import { query as queryUsers,addUser,updateUser,deleteUser } from '../services/user';
import {getLeftTreeMenu} from "../services/company";

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
      total:'',
    },
    currentUser: {},
  },

  effects: {
    *fetch({payload, callback }, { call, put }) {
      const response = yield call(queryUsers,payload);
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
      const response = yield call(addUser, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *update({ payload, callback }, { call}) {
      const response = yield call(updateUser, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *remove({ payload, callback }, { call}) {
      const response = yield call(deleteUser, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *fetchCurrent(_, {put }) {
      yield put({
        type: 'saveCurrentUser',
        payload: JSON.parse(localStorage.getItem("user")),
      });
    },
    *getLeftTreeMenu({ callback }, { call}) {
      const response = yield call(getLeftTreeMenu);
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
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
