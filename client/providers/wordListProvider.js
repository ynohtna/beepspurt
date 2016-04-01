const SET_WORD_LIST = 'words/SET';
const DEL_WORD = 'words/DEL';
const DUP_WORD = 'words/DUP';

const actions = {
  setWordList: list => ({ type: SET_WORD_LIST, list }),
  delWord: index => ({ type: DEL_WORD, index }),
  dupWord: index => ({ type: DUP_WORD, index })
};

const defaultWordList = [{
  message: '[beep]'
}, {
  message: 'TECHNO'
}];

const dup = (list, index) => {
  if (index < 0 || index >= list.length) {
    console.warn(`Bad dup_word index ${index} for`, list);
    return list;
  }
  return [
    ...list.slice(0, index),
    list[index],
    list[index],
    ...list.slice(index + 1)
  ];
};

const del = (list, index) => {
  if (index < 0 || index >= list.length || list.length === 1) {
    console.warn(`Bad del_word request at index ${index} for`, list);
    return list;
  }
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const reducers = {
  wordList: (state = defaultWordList, action) => {
    switch (action.type) {
      case SET_WORD_LIST:
        return action.list;
      case DEL_WORD:
        return del(state, action.index);
      case DUP_WORD:
        return dup(state, action.index);
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
