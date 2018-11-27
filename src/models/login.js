import { routerRedux } from 'dva/router';
import {fakeAccountLogin, fakeReset, fakeRegister} from '../services/api';
import { setAuthority,setuser } from '../utils/authority';
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
      if (response.meta.status === '000000') {
          reloadAuthorized();
        const urlParams = new URL(window.location.href);

        //如果是用户登录时返回登录路径，则以用户登录路径为准
        /*let defaultPath = response.data.list.path;
        if(defaultPath){
          yield put(
            routerRedux.push({
              pathname: defaultPath,
              search: JSON.stringify({
                redirect: window.location.href,
              }),
            })
          );
        }*/
          //不知道怎么玩呢，走默认的好了


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
          type: 'changeLogoutStatus',
          payload: {
            status: "999999",
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
      setAuthority(payload.data.list.currentAuthority);
      setuser(payload.data.list);
      return {
          ...state,
          status: payload.meta.status,
          type: payload.data.list.type,
      };
    },
    changeLogoutStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      setuser("");
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
        status: payload.meta.status,
      };
    },
  },
};
