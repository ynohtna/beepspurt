const SET_WORD_LIST = 'words/SET';

const actions = {
  setWordList: list => ({ type: SET_WORD_LIST, list })
};

const defaultWordList = [{
  message: '[beep]'
}, {
  message: 'TECHNO'
}];

const reducers = {
  wordList: (state = defaultWordList, action) => {
    switch (action.type) {
      case SET_WORD_LIST:
        return action.list;
      default:
        return state;
    }
  }
};

const middleware = store => next => action => {
  console.log('wordList MIDDLEWARE', store.getState(), action);  // eslint-disable-line no-console
  return (typeof action === 'function') ?	// thunk!
         action(store.dispatch, store.getState) :
         next(action);
};

export default {
  actions,
  middleware,
  reducers
};
