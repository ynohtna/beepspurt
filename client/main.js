/* eslint-disable no-console */
import { render } from 'react-dom';
import App from './App';

import providers from './providers/index';

/*
import { unshiftMiddleware } from 'react-redux-provide';
const testMiddleware = store => next => action => {
  console.log('MIDDLEWARE', store.getState(), action);  // eslint-disable-line no-console
  if (action.root === true) {
    console.warn('XXXXXXXXXXX ROOOTED $$$$\n\n', action, store);
    store.dispatch({ ...action, root: null });
  } else {
    next(action);
  }
};
unshiftMiddleware(providers, testMiddleware);
*/

const context = {
  providers,
  providedState: {
    //    socketStatus: '???',
  }
};


const main = () => {
  console.log('-- -- MAIN -- --');

  render(<App {...context} />,
         document.getElementById('app'));

  console.log('-- -- MAIN -- --');
};

const loadedStates = ['complete', 'loaded', 'interactive'];
if (loadedStates.includes(document.readyState) && document.body) {
  main();
} else {
  window.addEventListener('DOMContentLoaded', main, false);
}
