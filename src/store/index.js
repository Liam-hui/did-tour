import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './ducks';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [
  sagaMiddleware,
  thunkMiddleware,
];

const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middlewares)),
);

sagaMiddleware.run(sagas);

export default store;
