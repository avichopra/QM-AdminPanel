import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootsaga from './sagas';
import reducer from './reducers';

const sagaMiddleware = createSagaMiddleware();
const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT_REQUEST_SUCCESS') {
    state = undefined;
  }
  return reducer(state, action);
};
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootsaga);

export const getReduxKey = key => store.getState();

export default store;
