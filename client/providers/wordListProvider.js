import { uuid } from 'short-uuid';

const SET_WORD_LIST = 'words/SET';
const DEL_WORD = 'words/DEL';
const DUP_WORD = 'words/DUP';
const NUDGE_WORD = 'words/NUDGE';
const ACTIVATE_WORD = 'words/ACTIVATE';
const ACTIVATE_NEXT_WORD = 'words/ACTIVATE_NEXT';
const ACTIVATE_PREV_WORD = 'words/ACTIVATE_PREV';
const EDIT_WORD = 'words/EDIT';
const SAVE_WORD = 'words/SAVE';
const SAVE_NEW_WORD = 'words/SAVE_NEW';

const actions = {
  setWordList: list => ({ type: SET_WORD_LIST, list }),
  delWord: index => ({ type: DEL_WORD, index }),
  dupWord: index => ({ type: DUP_WORD, index }),
  nudgeWord: (index, dir) => ({ type: NUDGE_WORD, index, dir }),
  activateWord: index => ({ type: ACTIVATE_WORD, index }),
  activateNextWord: () => ({ type: ACTIVATE_NEXT_WORD }),
  activatePrevWord: () => ({ type: ACTIVATE_PREV_WORD }),
  editWord: index => ({ type: EDIT_WORD, index }),
  saveWord: word => ({ type: SAVE_WORD, word }),
  saveNewWord: word => ({ type: SAVE_NEW_WORD, word })
};

const defaultWordListInternal = [{
  message: '[beep]',
  styling: {
    fontFamily: 'Rockwell',
    bold: true,
    italic: true
  },
  alignment: {
    halign: 1,
    valign: 0
  }
}, {
  message: 'TECHNO',
  styling: {
    fontFamily: 'Wire One',
    bold: false,
    italic: false
  },
  alignment: {
    halign: 2,
    valign: 0
  }
}, {
  message: 'top left',
  styling: {
    fontFamily: 'Roboto',
    bold: false,
    italic: false
  },
  alignment: {
    halign: 0,
    valign: 0
  }
}, {
  message: 'middle center',
  styling: {
    fontFamily: 'Roboto',
    bold: false,
    italic: false
  },
  alignment: {
    halign: 1,
    valign: 1
  }
}, {
  message: 'multiple lines\nbottom right',
  styling: {
    fontFamily: 'Roboto',
    bold: false,
    italic: false
  },
  alignment: {
    halign: 2,
    valign: 2
  }
}];

const uuidify = list => list.map(w => ({ ...w, uuid: (w.uuid || uuid()) }));

const savedWordList = window.localStorage &&
                      !window.location.hash.includes('noload') &&
                      window.localStorage.getItem('wordListProvider');
const defaultWordList = savedWordList ?
                        uuidify(JSON.parse(savedWordList).data) :
                        uuidify(defaultWordListInternal);

const del = (list, index) => {
  if (index < 0 || index >= list.length || list.length === 1) {
    console.warn(`Bad del request at index ${index} for`, list); // eslint-disable-line no-console
    return list;
  }
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const dup = (list, index) => {
  if (index < 0 || index >= list.length) {
    console.warn(`Bad dup index ${index} for`, list); // eslint-disable-line no-console
    return list;
  }
  const dupe = {
    ...list[index],
    uuid: uuid(),
    activated: false,
    editing: false
  };
  return [
    ...list.slice(0, index),
    list[index],
    dupe,
    ...list.slice(index + 1)
  ];
};

const nudge = (list, index, dir = 1) => {
  const dest = index + dir;
  if (index < 0 || index >= list.length || dest < 0 || dest >= list.length) {
    console.warn(`Bad nudge request at ${index} & ${dest} for`, // eslint-disable-line no-console
                 list, index, dir);
    return list;
  }
  const l = list.slice();
  l[dest] = list[index];
  l[index] = list[dest];
  return l;
};

const edit = (list, index) => list.map((w, i) => ({ ...w, editing: (i === index) }));
const activate = (list, index) => list.map((w, i) => ({ ...w, activated: (i === index) }));

const activateOffset = (list, offset) => {
  if (!list || !list.length) {
    return list;
  }

  const l = list.slice();
  const index = list.findIndex(w => (w.activated === true));
  let next;

  if (index !== -1) {	// Found currently activated entry at index.
    l[index].activated = false;
    next = (index + offset) % list.length;
    if (next < 0) { // Wrapped around head of list.
      next += list.length;
    }
  } else {	// No item currently activated: choose first/last according to offset.
    next = (offset >= 0) ? 0 : (list.length - 1);
  }

  l[next].activated = true;
  return l;
};

const saveNew = (list, word) => [...list.map(w => ({ ...w, editing: false })),
                                 { ...word, uuid: uuid(), editing: true }];

const save = (list, word) => {
//  console.log('save', list, word);
  const index = list.findIndex(w => (w.editing === true));
  let l;
  if (index === -1) { // Save new word at end of list, and activate it.
    l = [...list, { ...word, uuid: uuid(), editing: true }];
  } else {	// Save new word details over word being currently edited.
    l = list.slice();
    l[index] = { ...word, uuid: list[index].uuid, editing: true };
  }
  return l;
};

const reducers = {
  wordList: (state = defaultWordList, action) => {
    switch (action.type) {
      case SET_WORD_LIST:
        return uuidify(action.list);

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

      case ACTIVATE_NEXT_WORD:
        return activateOffset(state, 1);

      case ACTIVATE_PREV_WORD:
        return activateOffset(state, -1);

      case SAVE_WORD:
        return save(state, action.word);

      case SAVE_NEW_WORD:
        return saveNew(state, action.word);

      default:
        return state;
    }
  }
  // FIXME: This needs to handle all word list actions that modify list indices.
  // 		i.e.: set, del, dup, nudge, activate.
  //  activeWordIndex: (state = null, action) =>
  //    ((action.type === ACTIVATE_WORD) ? action.index : state)
};

let lastSavedState = null;

const middleware = store => next => action => {
  const result = next(action);
  const wordList = store.getState().wordList;
  // FIXME: word lists should be stored as named presets, with
  //		an entry named init that references the actual named preset to load.

  // TODO: Check for a changed in which entry is activated, when found
  //       push a sendSocket '/spurter/STATE' action through the store.

  // Only persist upon actual state changes. TODO: check via diff.
  if (lastSavedState === wordList) {
    return result;
  }

  try {
    const listState = JSON.stringify({ data: wordList });
    window.localStorage.setItem('wordListProvider', listState);
    console.warn('+ wordListProvider persisted +'); // eslint-disable-line no-console
//    console.log(wordList); // eslint-disable-line no-console
    lastSavedState = wordList;
  } catch (e) {
    console.error('Failed to persist wordList: ', e); // eslint-disable-line no-console
  }

  return result;
};

export default {
  actions,
  reducers,
  middleware
};
