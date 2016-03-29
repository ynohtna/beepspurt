/* eslint-disable no-console */
import { render } from 'react-dom';
import createSagaMiddleware from 'redux-saga';
import App from './App';
import createStore from './store';

const main = () => {
  console.log('-- -- MAIN -- --');

  const middleware = createSagaMiddleware();
  const { store, dispatch } = createStore(middleware);
  render(<App />, document.getElementById('app'));

  console.log('-- -- MAIN -- --');
};

const loadedStates = ['complete', 'loaded', 'interactive'];
if (loadedStates.includes(document.readyState) && document.body) {
  main();
} else {
  window.addEventListener('DOMContentLoaded', main, false);
}
