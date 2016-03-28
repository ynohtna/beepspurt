const defaultVarsState = {
  message: '[beep]',
  fontFamily: 'Roboto',
  colour: [255, 255, 255, 255]
};

const spurter = (state = defaultVarsState, action) => {
  switch (action.type) {
    case '/spurter/MESSAGE':
      return {
        ...state,
        message: action.payload
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

export default spurter;
