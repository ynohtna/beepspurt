/* eslint-disable no-console */
import { render } from 'react-dom';
import App from './App';

import providers from './providers/index';

const context = {
  providers,
  providedState: {
//    socketStatus: '???',
    spurterState: {
      message: 'testing'
    }
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
