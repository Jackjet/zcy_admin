import { queryMessage } from '../services/api';

export default {
  namespace: 'message',

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
      const payload = {userName:currentUser.userName};
      const response = yield call(queryMessage,payload);
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
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
