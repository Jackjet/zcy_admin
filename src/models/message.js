import { queryActivities } from '../services/api';

export default {
  namespace: 'message',

  state: {
    list: [],
  },

  effects: {
    *fetchList(_, { call, put }) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const payload = {userName:currentUser.userName}
      const response = yield call(queryActivities,payload);
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
        list: action.payload,
      };
    },
  },
};
