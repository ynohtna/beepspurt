const defaultRendererState = {
  frame: -1,
  clearColour: [64, 0, 0, 255],
  beatInterval: 1000,
  state: 'on'
};

const renderer = (state = defaultRendererState, action) => {
  switch (action.type) {
    case '/renderer/FRAME_ADVANCE':
      return {
        ...state,
        frame: state.frame + 1
      };
    case '/renderer/CLEAR_COLOUR':
      return {
        ...state,
        clearColour: action.payload
      };
    default:
      return state;
  }
};

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
    default:
      return state;
  }
};

export default {
  renderer,
  vars
};
