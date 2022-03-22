import {
  USER_LOGIN_REQUEST_SUCCESS,
  USER_LOGIN_REQUEST_FAILURE,
  USER_LOGOUT_REQUEST_SUCCESS,
  USER_LOGOUT_REQUEST_FAILURE,
  USER_UPDATE_REQUEST_SUCCESS,
  USER_UPDATE_REQUEST_FAILURE,
  USER_LOGIN_CHECK_SUCCESS
  // USER_LOGIN_CHECK_FAILURE
} from "../constants";

const initialState = {
  user: {},
  userErr: {}
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST_SUCCESS:
    case USER_LOGOUT_REQUEST_SUCCESS:
    case USER_UPDATE_REQUEST_SUCCESS: {
      console.log("action", action.payload);

      return { ...state, user: action.payload };
    }
    case USER_LOGIN_CHECK_SUCCESS:
      return { ...state, user: action.payload };
    case USER_LOGIN_REQUEST_FAILURE:
    case USER_LOGOUT_REQUEST_FAILURE:
    case USER_UPDATE_REQUEST_FAILURE:
      // case USER_LOGIN_CHECK_FAILURE:
      return { ...state, userErr: action.payload };

    default:
      return state;
  }
};

export default user;
