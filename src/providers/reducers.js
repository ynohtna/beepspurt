const defaultRendererState = {
  frame: -1,
  clearColour: [64, 0, 0, 255],
  beatInterval: 1000,
  state: 'on'
};

const renderer = (state = defaultRendererState, action) => {
  switch (action.type) {
    case 'renderer/FRAME_ADVANCE':
      return {
        ...state,
        frame: state.frame + 1
      };
    default:
      return state;
  }
};

const defaultVarsState = {
  message: '[beep]'
};

const vars = (state = defaultVarsState, action) => {
  switch (action.type) {
    case 'vars/SET_MESSAGE':
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
 
