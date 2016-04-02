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
      case '/wordEditor/MERGE':
        return {
          ...state,
          ...action.payload
        };
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

export default {
  actions,
  reducers
};
