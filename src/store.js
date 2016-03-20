import { applyMiddleware, combineReducers, createStore as createReduxStore } from 'redux';
import reducers from './providers/reducers';

const createStore = (middleware) => {
  const store = createReduxStore(combineReducers(reducers), applyMiddleware(middleware));
  const dispatch = (type, payload = undefined) => store.dispatch({ type, payload });
  return {
    store,
    dispatch
  };
};
export default createStore;
