// CLIENT PROVIDER!
// import { shallowEqual } from '../utils';

// const TRANSMIT_MESSAGE = '/wordEditor/TRANSMIT';
const MERGE_STATE = '/wordEditor/MERGE';
const CLEAR_MESSAGE = '/wordEditor/CLEAR_MESSAGE';
const SET_MESSAGE = '/wordEditor/MESSAGE';
const SET_BOLD = '/wordEditor/BOLD';
const SET_ITALIC = '/wordEditor/ITALIC';
const SET_FONT = '/wordEditor/FONT';
const SET_HALIGN = '/wordEditor/HALIGN';
const SET_VALIGN = '/wordEditor/VALIGN';

const creator = type => payload => ({ type, payload });

const actions = {
//  transmitMessage: creator(TRANSMIT_MESSAGE),
  mergeState: creator(MERGE_STATE),
  clearMessage: creator(CLEAR_MESSAGE),
  setMessage: creator(SET_MESSAGE),
  setFont: creator(SET_FONT),
  setBold: creator(SET_BOLD),
  setItalic: creator(SET_ITALIC),
  setHorizontalAlignment: creator(SET_HALIGN),
  setVerticalAlignment: creator(SET_VALIGN)
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
const defaultMessage = 'do it';
const defaultStyling = {
  bold: false,
  italic: false,
  fontFamily: 'Heiti SC',
  fontSize: 80
};
const defaultAlignment = {
  halign: ALIGN.LEFT,
  valign: ALIGN.TOP
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
const FONT_MAP = FONT_LIST.reduce((total, cur) => ({ ...total,
                                                     [cur.family]: {
                                                       family: cur.family,
                                                       size: cur.size
                                                     } }));

const reducers = {
  message: (state = defaultMessage, { type, payload }) => {
    switch (type) {
      case CLEAR_MESSAGE:
        return '';
      case SET_MESSAGE:
        return payload;
      case MERGE_STATE:
        return payload.message || state;
      default:
        return state;
    }
  },
  alignment: (state = defaultAlignment, { type, payload }) => {
    switch (type) {
      case SET_HALIGN:
        return {
          ...state,
          halign: payload
        };
      case SET_VALIGN:
        return {
          ...state,
          valign: payload
        };
      case MERGE_STATE:
        return {
          ...state,
          ...payload.alignment
        };
      default:
        return state;
    }
  },
  styling: (state = defaultStyling, { type, payload }) => {
    switch (type) {
      case SET_BOLD:
        return {
          ...state,
          bold: !!payload
        };
      case SET_ITALIC:
        return {
          ...state,
          italic: !!payload
        };
      case SET_FONT:
        return {
          ...state,
          fontFamily: payload,
          fontSize: FONT_MAP[payload] ? FONT_MAP[payload].size : BASE_FONT_SIZE
        };
      case MERGE_STATE:
        return {
          ...state,
          ...payload.styling
        };
      default:
        return state;
    }
  },

  fontList: () => FONT_LIST,
  fontMap: () => FONT_MAP
};

export default {
  actions,
  reducers
};
