import { queryMessage, updateMessage } from '../services/api';


export default {
  namespace: 'sysMessage',

  state: {
    messageData : {
      list: [],
      pagination: {},
      total:'',
    },
  },

  effects: {
    *fetchList(_, { call, put }) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const payload = {userName:currentUser.userName,uid:currentUser.id};
      const response = yield call(queryMessage,payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *update({ payload ,callback}, { call }) {
      const response = yield call(updateMessage, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        messageData: action.payload.data,
      };
    },
  },
};
