// SERVER IMPLEMENTATION! TODO: Share with client-side.

const defaultVarsState = {
  message: '[beep]',
  fontFamily: 'Rockwell',
  colour: [255, 255, 255, 255]
};

const spurterState = (state = defaultVarsState, action) => {
  switch (action.type) {
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
    case '/spurter/COLOUR':
      return {
        ...state,
        colour: action.payload
      };
    default:
      return state;
  }
};

export default spurterState;
