const defaultVarsState = {
  message: '[beep]',
  fontFamily: 'Roboto',
  colour: [255, 255, 255, 255]
};

const vars = (state = defaultVarsState, action) => {
  switch (action.type) {
    case '/vars/MESSAGE':
      return {
        ...state,
        message: action.payload
      };
    case '/vars/COLOUR':
      return {
        ...state,
        colour: action.payload
      };
    default:
      return state;
  }
};

export default vars;
