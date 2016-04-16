// CLIENT PROVIDER!
const DISPATCH_EDITOR_STATE = '/wordEditor/DISPATCH';
const MERGE_EDITOR_STATE = '/wordEditor/MERGE';
const SET_MESSAGE = '/wordEditor/MESSAGE';
const SET_AUTO_DISPATCH = '/wordEditor/AUTO_DISPATCH';
const SET_COLOUR = '/wordEditor/COLOUR';
const SET_FONT = '/wordEditor/FONT';
const SET_BOLD = '/wordEditor/BOLD';
const SET_ITALIC = '/wordEditor/ITALIC';
const SET_HALIGN = '/wordEditor/HALIGN';
const SET_VALIGN = '/wordEditor/VALIGN';

const creator = type => payload => ({ type, payload });

const actions = {
  dispatchEditorState: () => ({ type: DISPATCH_EDITOR_STATE }),
  mergeEditorState: creator(MERGE_EDITOR_STATE),
  setMessage: creator(SET_MESSAGE),
  setAutoDispatch: creator(SET_AUTO_DISPATCH),
  setColour: creator(SET_COLOUR),
  setFont: creator(SET_FONT),
  setBold: creator(SET_BOLD),
  setItalic: creator(SET_ITALIC)
};

export const ALIGN = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
  TOP: 0,
  MIDDLE: 1,
  BOTTOM: 2
};

// TODO: Replicate from localForage.
const defaultWordEditorState = {
  message: 'let\'s go!',
  autoDispatch: false,
  fontFamily: 'Heiti SC',
  bold: false,
  italic: false,
  halign: ALIGN.LEFT,
  valign: ALIGN.TOP,
  colour: [255, 255, 255, 255]
};

const BASE_FONT_SIZE = 80;
const FONT_LIST = [
  { family: 'Aladin', size: 110 },
  { family: 'American Typewriter', size: BASE_FONT_SIZE },
  { family: 'Arial Black', size: BASE_FONT_SIZE },
  { family: 'Bradley Hand', size: BASE_FONT_SIZE },
  { family: 'Chalkduster', size: BASE_FONT_SIZE },
  { family: 'Copperplate', size: BASE_FONT_SIZE },
  { family: 'Courier New', size: BASE_FONT_SIZE },
  { family: 'DIN Alternate', size: BASE_FONT_SIZE },
  { family: 'Futura', size: BASE_FONT_SIZE },
  { family: 'Georgia', size: BASE_FONT_SIZE },
  { family: 'Gill Sans', size: BASE_FONT_SIZE },
  { family: 'Heiti SC', size: BASE_FONT_SIZE },
  { family: 'Helvetica', size: BASE_FONT_SIZE },
  { family: 'Marker Felt', size: BASE_FONT_SIZE },
  { family: 'Menlo', size: BASE_FONT_SIZE },
  { family: 'Optima', size: BASE_FONT_SIZE },
  { family: 'Papyrus', size: BASE_FONT_SIZE },
  { family: 'Roboto', size: BASE_FONT_SIZE },
  { family: 'Rockwell', size: BASE_FONT_SIZE },
  { family: 'Share Tech Mono', size: 90 },
  { family: 'Skia', size: 90 },
  { family: 'Superclarendon', size: BASE_FONT_SIZE },
  { family: 'Times New Roman', size: BASE_FONT_SIZE },
  { family: 'Trebuchet MS', size: BASE_FONT_SIZE },
  { family: 'Ultra', size: BASE_FONT_SIZE },
  { family: 'Underdog', size: BASE_FONT_SIZE },
  { family: 'Unica One', size: 90 },
  { family: 'Wallpoet', size: BASE_FONT_SIZE },
  { family: 'Wire One', size: 120 },
  { family: 'Zapfino', size: 60 },
  { family: 'Zeyada', size: 120 }
];

const reducers = {
  editor: (state = defaultWordEditorState, action) => {
    switch (action.type) {
      case MERGE_EDITOR_STATE:
        return {
          ...state,
          ...action.payload
        };
      case SET_MESSAGE:
        return {
          ...state,
          message: action.payload
        };
      case SET_AUTO_DISPATCH:
        return {
          ...state,
          autoDispatch: action.payload
        };
      case SET_COLOUR:
        return {
          ...state,
          colour: action.payload
        };
      case SET_FONT:
        return {
          ...state,
          fontFamily: action.payload
        };
      case SET_BOLD:
        return {
          ...state,
          bold: !!action.payload
        };
      case SET_ITALIC:
        return {
          ...state,
          italic: !!action.payload
        };
      case SET_HALIGN:
        return {
          ...state,
          halign: action.payload
        };
      case SET_VALIGN:
        return {
          ...state,
          valign: action.payload
        };
      default:
        return state;
    }
  },

  fontList: () => FONT_LIST
};

export default {
  actions,
  reducers
};
