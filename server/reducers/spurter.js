// SERVER IMPLEMENTATION! TODO: Share with client-side.

const defaultVarsState = {
  message: 'deep\ndeep\n[beep]',
  fontFamily: 'Rockwell',
  bold: false,
  italic: false,
  halign: 1,	// 0: left; 1: center; 2: right
  valign: 1		// 0: top; 1: middle; 2: bottom
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
    case '/spurter/HALIGN_':
      return {
        ...state,
        halign: action.payload
      };
    case '/spurter/VALIGN':
      return {
        ...state,
        valign: action.payload
      };
    default:
      return state;
  }
};

export default spurterState;
