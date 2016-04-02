const SET_WORD_LIST = 'words/SET';
const DEL_WORD = 'words/DEL';
const DUP_WORD = 'words/DUP';
const NUDGE_WORD = 'words/NUDGE';
const ACTIVATE_WORD = 'words/ACTIVATE';
const EDIT_WORD = 'words/EDIT';
const SAVE_WORD = 'words/SAVE';
const SAVE_NEW_WORD = 'words/SAVE_NEW';

const actions = {
  setWordList: list => ({ type: SET_WORD_LIST, list }),
  delWord: index => ({ type: DEL_WORD, index }),
  dupWord: index => ({ type: DUP_WORD, index }),
  nudgeWord: (index, dir) => ({ type: NUDGE_WORD, index, dir }),
  activateWord: index => ({ type: ACTIVATE_WORD, index }),
  editWord: index => ({ type: EDIT_WORD, index }),
  saveWord: word => ({ type: SAVE_WORD, word }),
  saveNewWord: word => ({ type: SAVE_NEW_WORD, word })
};

const defaultWordList = [{
  message: '[beep]',
  fontFamily: 'Rockwell'
}, {
  message: 'TECHNO',
  fontFamily: 'Roboto'
}];

const dup = (list, index) => {
  if (index < 0 || index >= list.length) {
    console.warn(`Bad dup index ${index} for`, list);
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
    console.warn(`Bad del request at index ${index} for`, list);
    return list;
  }
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const nudge = (list, index, dir = 1) => {
  const dest = index + dir;
  if (index < 0 || index >= list.length || dest < 0 || dest >= list.length) {
    console.warn(`Bad nudge request at ${index} & ${dest} for`, list, index, dir);
    return list;
  }
  const l = list.slice();
  l[dest] = list[index];
  l[index] = list[dest];
  return l;
};

const edit = (list, index) => list.map((w, i) => ({ ...w, editting: (i === index) }));
const activate = (list, index) => list.map((w, i) => ({ ...w, activated: (i === index) }));

const findIndex = (list, fn) => {
  for (let i = 0; i < list.length; ++i) {
    if (fn(list[i], i, list)) {
      return i;
    }
  }
  return -1;
};

const saveNew = (list, word) => [...list.map(w => ({ ...w, editting: false })),
                                 { message: word, fontFamily: 'Roboto', editting: true }];

const save = (list, word) => {
  const index = findIndex(list, w => (w.editting === true));
  let l;
  if (index === -1) {
    l = [...list, { message: word, fontFamily: 'Roboto', editting: true }];
  } else {
    l = list.slice();
    l[index].message = word;
  }
  return l;
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
      case NUDGE_WORD:
        return nudge(state, action.index, action.dir);
      case EDIT_WORD:
        return edit(state, action.index);
      case ACTIVATE_WORD:
        return activate(state, action.index);
      case SAVE_WORD:
        return save(state, action.word);
      case SAVE_NEW_WORD:
        return saveNew(state, action.word);
      default:
        return state;
    }
  }
};

/*
const middleware = store => next => action => {
  console.log('wordList MIDDLEWARE', store.getState(), action);  // eslint-disable-line no-console
  return (typeof action === 'function') ?	// thunk!
         action(store.dispatch, store.getState) :
         next(action);
};
*/

export default {
  actions,
//  middleware,
  reducers
};
