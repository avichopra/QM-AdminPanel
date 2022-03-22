import { all, call, put, takeLatest } from 'redux-saga/effects';
import { USER_LOGIN_REQUEST_SUCCESS, USER_LOGIN_REQUEST_FAILURE, USER_LOGIN_REQUEST } from '../constants';

import { callApi } from '../../api';

export function* login(data) {
  try {
    const response = yield call(callApi, 'post', 'v1/auth/login', data.payload);

    yield put({
      type: USER_LOGIN_REQUEST_SUCCESS,
      payload: response.data
    });
  } catch (err) {
    console.log('error');
    yield put({
      type: USER_LOGIN_REQUEST_FAILURE,
      payload: err.response.data
    });
  }
}
export default function* root() {
  yield all([takeLatest(USER_LOGIN_REQUEST, login)]);
}
