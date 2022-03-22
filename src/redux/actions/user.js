import {
  USER_LOGIN_REQUEST,
  USER_LOGOUT_REQUEST,
  USER_UPDATE_REQUEST
} from '../constants';

export const login = payload => {
  return {
    type: USER_LOGIN_REQUEST,
    payload
  };
};

export const logout = payload => {
  return {
    type: USER_LOGOUT_REQUEST,
    payload
  };
};
export const update = payload => {
  return {
    type: USER_UPDATE_REQUEST,
    payload
  };
};

// export default login;
