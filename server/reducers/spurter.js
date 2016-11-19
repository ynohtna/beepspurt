// SERVER IMPLEMENTATION! TODO: Share with client-side.

const defaultVarsState = {
  message: '[beep]',
  fontFamily: 'Rockwell',
  bold: false,
  italic: false,
  zoomScale: 0.3,
  halign: 1,				// 0: left; 1: center; 2: right
  valign: 1,				// 0: top; 1: middle; 2: bottom
  marginVH: 0.1,			// Ratio of margin to viewport height.
  lineSpacing: 1.0,			// Ratio of emHeight between subsequent lines of text.
  backgroundMode: 1,		  // 0: none, 1: tape, 2: shadow
  backgroundOffsetRatio: 0.2, // offset = lineSpacing * backgroundOffsetRatio
  debug: false
};

const spurterState = (state = defaultVarsState, action) => {
  switch (action.type) {
    case '/spurter/STATE':
    case '/spurter/MERGE':
      return {
        ...state,
        ...action.payload
      };
    case '/spurter/MESSAGE':
      return {
        ...state,
        message: action.payload
      };
    case '/spurter/MASSAGE':
      return {
        ...state,
        message: action.payload.replace(/\\n/g, '\n')
      };
    case '/spurter/FONT_FAMILY':
      return {
        ...state,
        fontFamily: action.payload
      };
    case '/spurter/BOLD':
      return {
        ...state,
        bold: action.payload
      };
    case '/spurter/ITALIC':
      return {
        ...state,
        italic: action.payload
      };
    case '/spurter/ZOOM_SCALE':
      return {
        ...state,
        zoomScale: action.payload
      };
    case '/spurter/MARGIN_VH':
      return {
        ...state,
        marginVH: action.payload
      };
    case '/spurter/LINE_SPACING':
      return {
        ...state,
        lineSpacing: action.payload
      };
    case '/spurter/BACKGROUND_MODE':
      return {
        ...state,
        backgroundMode: action.payload
      };
    case '/spurter/BACKGROUND_OFFSET_RATIO':
      return {
        ...state,
        backgroundOffsetRatio: action.payload
      };
    case '/spurter/HALIGN':
      return {
        ...state,
        halign: action.payload
      };
    case '/spurter/VALIGN':
      return {
        ...state,
        valign: action.payload
      };
    case '/spurter/DEBUG':
      return {
        ...state,
        debug: action.payload
      };
    default:
      return state;
  }
};

export default spurterState;
