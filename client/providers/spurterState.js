const defaultSpurterState = {
  message: `test - ${Date()}`,
  fontFamily: 'Roboto',
  colour: [255, 255, 255, 255]
};

const reducers = {
  spurterState: (state = defaultSpurterState, action) => {
    switch (action.type) {
      case '/spurter/MESSAGE':
        return {
          ...state,
          message: action.payload
        };
      case '/spurter/COLOUR':
        return {
          ...state,
          colour: action.payload
        };
      default:
        return state;
    }
  }
};

const middleware = store => next => action => {
  console.log('MIDDLEWARE', store.getState(), action);  // eslint-disable-line no-console
  return (typeof action === 'function') ?	// thunk!
         action(store.dispatch, store.getState) :
         next(action);
};

export default {
  middleware,
  reducers
};
