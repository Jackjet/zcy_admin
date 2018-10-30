import { routerRedux } from 'dva/router';
import {fakeAccountLogin, fakeReset, fakeRegister} from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';


export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload ,callback}, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login
      if (response.status === 'ok') {
          reloadAuthorized();
        if (callback && typeof callback === 'function') {
            callback(response); // 返回结果
        }

      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
    *submitReset(_, { call, put }) {
      const response = yield call(fakeReset);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
     setAuthority(payload.currentAuthority);
      return {
          ...state,
          status: payload.status,
          type: payload.type,
      };
    },
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
