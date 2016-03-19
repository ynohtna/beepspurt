import { combineReducers, createStore, applyMiddleware } from 'redux';
import reducers from './providers/reducers';
import sagaMiddleware from './providers/sagas';

const store = createStore(combineReducers(reducers),
                          applyMiddleware(sagaMiddleware));
export default store;

const dispatch = (type, payload = undefined) => store.dispatch({ type, payload });

export {
  dispatch
};
