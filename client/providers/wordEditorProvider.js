// CLIENT PROVIDER!
const MERGE_EDITOR_STATE = '/wordEditor/MERGE';

const actions = {
  mergeEditorState: payload => ({ type: MERGE_EDITOR_STATE, payload })
};

const defaultWordEditorState = {
//  message: `test - ${Date()}`,
  message: 'let\'s go!',
  fontFamily: 'Roboto',
  colour: [255, 255, 255, 255]
};

const reducers = {
  editor: (state = defaultWordEditorState, action) => {
    switch (action.type) {
      case '/wordEditor/MERGE': {
        const s = {
          ...state,
          ...action.payload
        };
        console.log('MERGE', state, action);
        console.log(s);
        return s;
      }
      case '/wordEditor/MESSAGE':
        return {
          ...state,
          message: action.payload
        };
      case '/wordEditor/COLOUR':
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
  console.log('WORD EDITOR', store.getState(), action);  // eslint-disable-line no-console
  return (typeof action === 'function') ?	// thunk!
         action(store.dispatch, store.getState) :
         next(action);
};

export default {
  actions,
  middleware,
  reducers
};
