import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import dataReducer from './reducers/dataReducer';
import userReducer from './reducers/userReducer';

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: userReducer,
  data: dataReducer,
});

const store = createStore(
  reducers,
  initialState,
  compose(applyMiddleware(...middleware)),
);

export default store;
